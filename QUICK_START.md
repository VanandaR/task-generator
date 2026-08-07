# 🚀 Quick Start Guide

Panduan singkat untuk mulai menggunakan Jira Subtask Generator.

## Prerequisites ✓

✅ Node.js v16+ installed  
✅ Credentials sudah ada (.env file)

## 3 Simple Steps

### Step 1: Start Server
```bash
npm start
```

Output akan terlihat seperti ini:
```
Server running at http://localhost:3000/
Press Ctrl+C to stop the server
```

### Step 2: Setup Credentials

**Option A: Interactive UI (Recommended)**
1. Buka browser: http://localhost:3000/setup-credentials.html
2. Masukkan credentials Anda:
   - Jira Server: `https://your-jira.com`
   - Jira PAT: `your_jira_pat_token`
   - OpenAI API Key: `your_openai_key`
   - OpenAI Base URL: `https://api.openai.com/v1` (or LiteLLM gateway)
   - AI Model: `gpt-4-turbo-preview` (or your model)
3. Click "Save Credentials"

**Option B: Console Commands**
1. Buka browser console (F12)
2. Paste dan edit dengan credentials Anda:
```javascript
localStorage.setItem('JIRA_SERVER', 'https://your-jira.com');
localStorage.setItem('JIRA_PAT', 'your_jira_pat_token');
localStorage.setItem('OPENAI_API_KEY', 'your_openai_key');
localStorage.setItem('OPENAI_BASE_URL', 'https://api.openai.com/v1');
localStorage.setItem('AI_MODEL_NAME', 'gpt-4-turbo-preview');
```
3. Press Enter

### Step 3: Use the App!
1. Buka: http://localhost:3000
2. Masukkan Jira issue key (e.g., `PCC-1439`)
3. Click "Search"
4. Fill form dengan task details
5. Click "Generate & Create Subtask"

## 📝 Example Workflow

```
Input Issue: PCC-1439
   ↓
Task Description: "Implement login with email validation"
   ↓
Bobot: High
Story Point: 5
System Analyst: Your Name
Programmer: Dev Name
Dates: Set accordingly
   ↓
Click Generate & Create
   ↓
AI generates professional description
   ↓
✅ Subtask created in Jira!
```

## 🆘 Troubleshooting

### "Failed to fetch issue"
✓ Check issue key spelling  
✓ Verify internet connection  
✓ Check Jira credentials in setup

### "AI Error"
✓ Verify OpenAI API key valid  
✓ Check API is accessible

### Server not starting
✓ Check port 3000 not used  
✓ Run: `npm install`

### Credentials not working
Option A: Clear localStorage
```javascript
localStorage.clear();
```
Then setup again.

Option B: Check values
```javascript
console.log(localStorage.getItem('JIRA_SERVER'));
// Should show: https://jira.beacukai.go.id
```

## 📚 Full Documentation

- **Setup Details**: See [SETUP.md](SETUP.md)
- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Features**: See [README.md](README.md)
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)

## ⚡ Available Commands

```bash
# Start application
npm start

# Load env and show config
npm run load-env

# Build for production
npm run build
```

## 🎯 Next Steps

After first successful subtask creation:

1. ✅ Bookmark the app URL
2. ✅ Explore different task types
3. ✅ Try bulk creation (future feature)
4. ✅ Share feedback via GitHub Issues

---

**Questions?** Open an issue on GitHub!

Happy task generating! 🎉
