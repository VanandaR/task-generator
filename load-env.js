/**
 * Load .env variables and set to localStorage
 * Run this once before starting the app
 */

const fs = require('fs');
const path = require('path');

// Read .env file
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse env variables
const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

// Output for browser usage
const config = {
    JIRA_SERVER: envVars.REACT_APP_JIRA_SERVER,
    JIRA_PAT: envVars.REACT_APP_JIRA_PAT,
    OPENAI_API_KEY: envVars.REACT_APP_OPENAI_API_KEY,
    OPENAI_BASE_URL: envVars.REACT_APP_OPENAI_BASE_URL,
    AI_MODEL_NAME: envVars.REACT_APP_AI_MODEL_NAME,
};

console.log('Environment variables loaded successfully!');
console.log('Add this to your browser console to set localStorage:');
console.log('');
console.log(`
localStorage.setItem('JIRA_SERVER', '${config.JIRA_SERVER}');
localStorage.setItem('JIRA_PAT', '${config.JIRA_PAT}');
localStorage.setItem('OPENAI_API_KEY', '${config.OPENAI_API_KEY}');
localStorage.setItem('OPENAI_BASE_URL', '${config.OPENAI_BASE_URL}');
localStorage.setItem('AI_MODEL_NAME', '${config.AI_MODEL_NAME}');
`);

// Or write to JSON file for reference
fs.writeFileSync(
    path.join(__dirname, '.env.local.json'),
    JSON.stringify(config, null, 2)
);

console.log('\nOr copy this to use in your app:');
console.log('window.CONFIG =', JSON.stringify(config, null, 2));
