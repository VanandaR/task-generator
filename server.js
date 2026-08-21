const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const PORT = 3000;

const JIRA_SERVER = process.env.REACT_APP_JIRA_SERVER;
const JIRA_PAT = process.env.REACT_APP_JIRA_PAT;
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.REACT_APP_OPENAI_BASE_URL;
const AI_MODEL_NAME = process.env.REACT_APP_AI_MODEL_NAME;

// Helper: read request body
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

// Helper: proxy request to external URL
function proxyRequest(options, postData) {
  return new Promise((resolve, reject) => {
    // Allow self-signed / internal CA certificates (Jira on-premise)
    options.rejectUnauthorized = false;
    const protocol = options.protocol === 'https:' ? require('https') : require('http');
    const proxyReq = protocol.request(options, (proxyRes) => {
      let data = '';
      proxyRes.on('data', (chunk) => (data += chunk));
      proxyRes.on('end', () => {
        resolve({ statusCode: proxyRes.statusCode, headers: proxyRes.headers, body: data });
      });
    });
    proxyReq.on('error', reject);
    if (postData) proxyReq.write(postData);
    proxyReq.end();
  });
}

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // ======= API PROXY ROUTES =======

  // POST /api/jira/create-subtask
  if (req.method === 'POST' && req.url === '/api/jira/create-subtask') {
    try {
      const body = JSON.parse(await readBody(req));
      const jiraUrl = new URL(`${JIRA_SERVER}/rest/api/2/issue`);

      const postData = JSON.stringify(body.payload);
      const       result = await proxyRequest(
        {
          protocol: jiraUrl.protocol,
          hostname: jiraUrl.hostname,
          port: jiraUrl.port,
          path: jiraUrl.pathname,
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${JIRA_PAT}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
          },
        },
        postData
      );

      if (result.statusCode >= 400) {
        console.error('Jira Error Response:', result.body);
      }
      res.writeHead(result.statusCode, { 'Content-Type': 'application/json' });
      res.end(result.body);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  // POST /api/ai/generate
  if (req.method === 'POST' && req.url === '/api/ai/generate') {
    try {
      const body = JSON.parse(await readBody(req));
      const aiUrl = new URL(`${OPENAI_BASE_URL}/chat/completions`);

      const postData = JSON.stringify({
        model: AI_MODEL_NAME,
        messages: body.messages,
        temperature: body.temperature || 0.7,
        top_p: 0.9,
        max_tokens: body.max_tokens || 1000,
      });

      const result = await proxyRequest(
        {
          protocol: aiUrl.protocol,
          hostname: aiUrl.hostname,
          port: aiUrl.port,
          path: aiUrl.pathname,
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
          },
        },
        postData
      );

      res.writeHead(result.statusCode, { 'Content-Type': 'application/json' });
      res.end(result.body);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  // GET /api/jira/myself — get current logged-in Jira user from PAT
  if (req.method === 'GET' && req.url === '/api/jira/myself') {
    try {
      const jiraUrl = new URL(`${JIRA_SERVER}/rest/api/2/myself`);
      const result = await proxyRequest({
        protocol: jiraUrl.protocol,
        hostname: jiraUrl.hostname,
        port: jiraUrl.port,
        path: jiraUrl.pathname,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${JIRA_PAT}`,
          'Accept': 'application/json',
        },
      });
      res.writeHead(result.statusCode, { 'Content-Type': 'application/json' });
      res.end(result.body);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  // GET /api/config — return non-sensitive config to frontend
  if (req.method === 'GET' && req.url === '/api/config') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      jiraServer: JIRA_SERVER,
      aiModelName: AI_MODEL_NAME,
      aiBaseUrl: OPENAI_BASE_URL,
    }));
    return;
  }

  // GET /.env — serve .env file for config loading
  if (req.method === 'GET' && req.url === '/.env') {
    fs.readFile(path.join(__dirname, '.env'), (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(data);
    });
    return;
  }

  // ======= STATIC FILE SERVING =======
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath);
    let contentType = 'text/plain';

    switch (ext) {
      case '.html': contentType = 'text/html'; break;
      case '.js': contentType = 'text/javascript'; break;
      case '.css': contentType = 'text/css'; break;
      case '.json': contentType = 'application/json'; break;
      case '.png': contentType = 'image/png'; break;
      case '.jpg':
      case '.jpeg': contentType = 'image/jpeg'; break;
      case '.svg': contentType = 'image/svg+xml'; break;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Jira Server: ${JIRA_SERVER}`);
  console.log(`AI Model: ${AI_MODEL_NAME}`);
  console.log(`Press Ctrl+C to stop the server`);
});
