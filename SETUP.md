# Setup Guide - Jira Subtask Generator

Panduan lengkap untuk setup dan menjalankan aplikasi Jira Subtask Generator.

## 📋 Prerequisites

Pastikan Anda memiliki:
- **Node.js** v16 atau lebih tinggi ([Download](https://nodejs.org/))
- **npm** (biasanya bundled dengan Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Jira Account** dengan akses create issues
- **OpenAI API Key** atau LiteLLM Gateway access

## 🚀 Installation Steps

### 1. Clone Repository

```bash
# Clone dari GitHub
git clone https://github.com/VanandaR/task-generator.git
cd task-generator

# Atau jika Anda sudah punya fork:
git clone https://github.com/your-username/task-generator.git
cd task-generator
```

### 2. Install Dependencies

```bash
npm install
```

Proses ini akan menginstall semua packages yang diperlukan:
- React 18
- Axios untuk HTTP requests
- Build tools

**Waktu:** ~30 detik - 2 menit (tergantung internet)

### 3. Configure Credentials

#### Step 3a: Generate Jira PAT

1. Login ke Jira Anda
2. Buka **Settings** → **Personal Access Tokens**
3. Click **Create token**
4. Berikan nama: `task-generator`
5. Click **Generate**
6. **Copy token** (Anda hanya bisa lihat sekali!)

#### Step 3b: Get OpenAI API Key

**Option 1: OpenAI**
1. Visit https://platform.openai.com/api-keys
2. Login dengan akun OpenAI
3. Click **Create new secret key**
4. Copy the key

**Option 2: LiteLLM Gateway**
```
Contact your LiteLLM admin untuk API key
```

#### Step 3c: Create .env File

```bash
# Copy template
cp .env.example .env

# Edit dengan credentials Anda
nano .env
# atau gunakan editor favorit Anda
```

Fill in the values:
```bash
# Jira Configuration
REACT_APP_JIRA_SERVER=https://your-jira-instance.com
REACT_APP_JIRA_PAT=your_jira_token_here

# OpenAI Configuration (pilih salah satu)
REACT_APP_OPENAI_API_KEY=sk-...your-key...
REACT_APP_OPENAI_BASE_URL=https://api.openai.com/v1
REACT_APP_AI_MODEL_NAME=gpt-4-turbo-preview

# ATAU untuk LiteLLM Gateway:
# REACT_APP_OPENAI_BASE_URL=https://your-gateway.com/v1
# REACT_APP_AI_MODEL_NAME=vertex_ai/gemini-3-flash-preview
```

### 4. Update Configuration in Code

Edit `index.html` line ~351:

```javascript
// Load configuration from environment or localStorage
const CONFIG = {
    JIRA_SERVER: process.env.REACT_APP_JIRA_SERVER || 'https://your-jira.com',
    JIRA_PAT: process.env.REACT_APP_JIRA_PAT || '',
    OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY || '',
    OPENAI_BASE_URL: process.env.REACT_APP_OPENAI_BASE_URL || '',
    AI_MODEL_NAME: process.env.REACT_APP_AI_MODEL_NAME || '',
};
```

Atau set di localStorage:
```javascript
// Di browser console
localStorage.setItem('JIRA_SERVER', 'https://your-jira.com');
localStorage.setItem('JIRA_PAT', 'your_token');
localStorage.setItem('OPENAI_API_KEY', 'your_key');
localStorage.setItem('OPENAI_BASE_URL', 'https://api.openai.com/v1');
localStorage.setItem('AI_MODEL_NAME', 'gpt-4-turbo-preview');
```

### 5. Start the Application

```bash
# Start development server
npm start

# Server akan running di http://localhost:3000
```

Output yang diharapkan:
```
> task-generator@1.0.0 start
> node server.js

Server running at http://localhost:3000/
Press Ctrl+C to stop the server
```

### 6. Open in Browser

1. Buka browser
2. Navigate ke `http://localhost:3000`
3. Aplikasi siap digunakan!

## ✅ Verify Installation

### Checklist
- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install` complete)
- [ ] .env file created with credentials
- [ ] Server running (`npm start` shows "Server running")
- [ ] Browser accessible at localhost:3000
- [ ] Page loads tanpa white screen
- [ ] Search input visible

### Test the Application

1. **Search for Issue**
   - Input: `PCC-1439` (atau issue key lain yang Anda miliki)
   - Click Search
   - Should fetch issue details

2. **Fill Form**
   - Task Description: "Test subtask"
   - Bobot: "High"
   - Story Point: "5"
   - System Analyst: "Your Name"
   - Programmer: "Developer Name"
   - Set dates

3. **Create Subtask**
   - Click "Generate & Create Subtask"
   - Should see success message dengan issue key
   - Check Jira untuk confirm subtask dibuat

## 🐛 Troubleshooting

### Error: "Cannot find module"
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Error: "Failed to fetch issue"
- ✓ Verify JIRA_SERVER URL correct
- ✓ Verify JIRA_PAT token valid
- ✓ Check internet connection
- ✓ Verify issue key exists

### Error: "Port 3000 already in use"
```bash
# Kill process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :3000
kill -9 <PID>
```

### Error: "AI Error"
- ✓ Verify OPENAI_API_KEY valid
- ✓ Check account has credits
- ✓ Verify model name correct
- ✓ Check API base URL

### Configuration Not Loading
- ✓ Check .env file exists
- ✓ Verify file is readable
- ✓ Restart server after changing .env
- ✓ Check localStorage values: `localStorage.getItem('JIRA_SERVER')`

## 📁 Project Structure

```
task-generator/
├── index.html              # Main app (standalone)
├── server.js              # Node.js server
├── package.json           # Dependencies
├── .env                   # Your credentials (not in git)
├── .env.example           # Template
├── README.md              # Full documentation
├── SETUP.md              # This file
├── CONTRIBUTING.md        # Contribution guide
├── LICENSE               # MIT License
│
├── src/                   # React components (optional)
│   ├── App.jsx
│   ├── components/
│   │   ├── SubtaskGenerator.jsx
│   │   └── SubtaskForm.jsx
│   └── services/
│       ├── jiraService.js
│       └── aiService.js
│
├── public/
│   └── index.html        # Public HTML template
│
└── webpack.config.js      # Build configuration
```

## 🔧 Available Commands

```bash
# Start development server
npm start

# Build for production (jika menggunakan webpack)
npm run build

# Stop server
Ctrl+C

# Clear node_modules
npm clean-install
```

## 🚀 Deployment

### Deploy ke Vercel

1. Push repository ke GitHub
2. Visit https://vercel.com
3. Click "New Project"
4. Import GitHub repository
5. Set environment variables di Vercel dashboard
6. Click Deploy

### Deploy ke Heroku

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set REACT_APP_JIRA_SERVER=https://...
heroku config:set REACT_APP_JIRA_PAT=...
# dst

# Deploy
git push heroku main
```

### Deploy ke Server Lokal

```bash
# Copy folder ke server
scp -r task-generator/ user@server:/home/app/

# SSH ke server
ssh user@server

# Install dan run
cd /home/app/task-generator
npm install
npm start
```

## 🔐 Security Best Practices

1. **Jangan commit credentials**
   - .env file adalah .gitignore
   - Selalu gunakan .env.example sebagai template

2. **Rotate tokens regularly**
   - Jira PAT: Every 3-6 months
   - OpenAI API key: When compromised

3. **Use strong passwords**
   - Jira account: Strong & unique
   - OpenAI account: Strong & 2FA enabled

4. **Monitor usage**
   - Check OpenAI usage regularly
   - Monitor Jira API calls

## 📞 Getting Help

1. **Check README.md** - General documentation
2. **Check TROUBLESHOOTING** - Common issues
3. **GitHub Issues** - Report bugs
4. **GitHub Discussions** - Ask questions

## 🎓 Next Steps

Setelah setup:
1. Read [README.md](README.md) untuk full documentation
2. Check [ABOUT.md](ABOUT.md) untuk use cases
3. Review [CONTRIBUTING.md](CONTRIBUTING.md) untuk contribute
4. Start creating subtasks! 🚀

---

**Questions?** Open an issue di GitHub! 📝

**Happy subtask generating!** 🎉
