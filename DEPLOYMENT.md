# Deployment Guide

Panduan untuk deploy Jira Subtask Generator ke berbagai platform.

## 📦 Build Untuk Production

### Menggunakan Webpack

```bash
npm run build
```

Output akan ada di folder `dist/`

### Menggunakan Simple Server (Current)

Server sudah ready for production, cukup set environment variables yang benar.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel adalah platform terbaik untuk host aplikasi React dengan deployment otomatis.

**Step-by-Step:**

1. **Push ke GitHub**
   ```bash
   git push origin main
   ```

2. **Login ke Vercel**
   - Visit https://vercel.com
   - Sign in dengan GitHub account

3. **Import Project**
   - Click "New Project"
   - Select `task-generator` repository
   - Click "Import"

4. **Configure Environment**
   - Go to **Settings** → **Environment Variables**
   - Add:
     ```
     REACT_APP_JIRA_SERVER=https://your-jira.com
     REACT_APP_JIRA_PAT=your_token
     REACT_APP_OPENAI_API_KEY=your_key
     REACT_APP_OPENAI_BASE_URL=https://api.openai.com/v1
     REACT_APP_AI_MODEL_NAME=gpt-4-turbo-preview
     ```
   - ⚠️ **Mark as Sensitive** untuk API keys

5. **Deploy**
   - Click "Deploy"
   - Done! URL akan ditampilkan

**Benefits:**
- ✅ Auto-deploy saat push
- ✅ Free SSL/HTTPS
- ✅ Global CDN
- ✅ Analytics built-in
- ✅ Serverless functions (optional)

### Option 2: Heroku

Legacy platform tapi masih popular untuk backend.

**Step-by-Step:**

1. **Install Heroku CLI**
   ```bash
   # Windows (chocolatey)
   choco install heroku-cli
   
   # Windows (direct)
   # https://cli-assets.heroku.com/branches/stable/heroku-windows-amd64.exe
   
   # Mac
   brew tap heroku/brew && brew install heroku
   
   # Linux
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login ke Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create task-generator-app
   # atau dengan custom URL:
   heroku apps:create task-generator --region us
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set REACT_APP_JIRA_SERVER=https://your-jira.com
   heroku config:set REACT_APP_JIRA_PAT=your_token
   heroku config:set REACT_APP_OPENAI_API_KEY=your_key
   heroku config:set REACT_APP_OPENAI_BASE_URL=https://api.openai.com/v1
   heroku config:set REACT_APP_AI_MODEL_NAME=gpt-4-turbo-preview
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Open App**
   ```bash
   heroku open
   ```

**Troubleshooting:**
```bash
# View logs
heroku logs --tail

# View config
heroku config

# Restart app
heroku restart
```

### Option 3: AWS EC2

Untuk full control dan scalability.

**Step-by-Step:**

1. **Create EC2 Instance**
   - AMI: Ubuntu 22.04 LTS
   - Type: t3.micro (free tier)
   - Security Group: Allow HTTP (80), HTTPS (443), SSH (22)

2. **Connect via SSH**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm git nginx
   ```

4. **Clone Repository**
   ```bash
   cd /home/ubuntu
   git clone https://github.com/VanandaR/task-generator.git
   cd task-generator
   npm install
   ```

5. **Create .env File**
   ```bash
   nano .env
   # Add your credentials
   ```

6. **Setup Nginx**
   ```bash
   # Create config
   sudo nano /etc/nginx/sites-available/default
   ```

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo systemctl restart nginx
   ```

7. **Run Application**
   ```bash
   npm start
   ```

8. **Setup PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name "task-generator"
   pm2 startup
   pm2 save
   ```

### Option 4: Docker

Containerize untuk consistency across environments.

**Step-by-Step:**

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm install
   
   COPY . .
   
   EXPOSE 3000
   
   CMD ["npm", "start"]
   ```

2. **Create .dockerignore**
   ```
   node_modules
   .git
   .gitignore
   .env
   npm-debug.log
   ```

3. **Build Image**
   ```bash
   docker build -t task-generator:latest .
   ```

4. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e REACT_APP_JIRA_SERVER=https://your-jira.com \
     -e REACT_APP_JIRA_PAT=your_token \
     -e REACT_APP_OPENAI_API_KEY=your_key \
     task-generator:latest
   ```

5. **Push ke Docker Hub (Optional)**
   ```bash
   docker tag task-generator:latest username/task-generator:latest
   docker push username/task-generator:latest
   ```

### Option 5: Your Own Server

Self-hosted dengan full control.

**Requirements:**
- Server dengan Node.js installed
- Domain name (optional)
- SSL certificate (recommended)

**Setup:**

```bash
# Connect to server
ssh user@server-ip

# Clone repo
git clone https://github.com/VanandaR/task-generator.git
cd task-generator

# Install dependencies
npm install

# Create .env
nano .env
# Add credentials

# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start server.js --name "task-generator"
pm2 startup
pm2 save

# Setup domain (optional)
# Edit your DNS provider to point domain to server IP
```

## 🔒 Security Considerations

### Before Deploying

1. **Environment Variables**
   - ✅ Never commit .env file
   - ✅ Use platform's secret management
   - ✅ Rotate credentials regularly

2. **HTTPS/SSL**
   - ✅ Always use HTTPS in production
   - ✅ Get free certificate from Let's Encrypt

3. **Authentication**
   - ✅ Consider adding user authentication
   - ✅ Implement rate limiting
   - ✅ Add CORS policy

4. **Monitoring**
   - ✅ Set up error tracking (Sentry)
   - ✅ Monitor API usage
   - ✅ Setup uptime monitoring

## 📊 Deployment Comparison

| Platform | Cost | Ease | Scale | SSL | Setup Time |
|----------|------|------|-------|-----|-----------|
| Vercel | Free | ⭐⭐⭐⭐⭐ | Auto | ✅ | 5 min |
| Heroku | $7/mo | ⭐⭐⭐⭐ | Limited | ✅ | 10 min |
| AWS EC2 | Free tier | ⭐⭐⭐ | ⭐⭐⭐ | ❌ | 30 min |
| Docker | Self | ⭐⭐⭐ | ⭐⭐⭐ | ⭐ | 20 min |
| Own Server | Self | ⭐⭐ | ⭐⭐ | ❌ | 45 min |

## 🚀 CI/CD Pipeline

### GitHub Actions (Automated Deployment)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 📈 Monitoring & Maintenance

### Health Checks

```bash
# Check server status
curl http://localhost:3000

# Monitor logs
pm2 logs task-generator

# Check resource usage
pm2 monit
```

### Backup Strategy

```bash
# Daily backup
0 2 * * * cd /path/to/app && git pull origin main

# Database backup (if applicable)
0 3 * * * mongodump --out /backups/$(date +\%Y-\%m-\%d)
```

### Update Process

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Restart application
pm2 restart task-generator
```

## 🆘 Troubleshooting

### Application not starting
```bash
# Check logs
npm start

# or with PM2
pm2 logs task-generator
```

### Port already in use
```bash
# Change port in server.js
# Or kill existing process
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Environment variables not loading
```bash
# Verify .env exists
ls -la .env

# Check values
source .env
echo $REACT_APP_JIRA_SERVER
```

---

**Need help?** Check [SETUP.md](SETUP.md) atau buka issue di GitHub!
