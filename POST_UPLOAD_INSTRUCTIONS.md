# 📝 Post Upload Instructions

Panduan untuk setup GitHub repository setelah upload.

## 🎯 Langkah-langkah Setup Repository

### 1. Update Repository Description

1. Buka https://github.com/VanandaR/task-generator
2. Click **Settings** tab
3. Scroll ke **About** section
4. Click **Edit** (gear icon)
5. Paste deskripsi (dari `GITHUB_SHORT_DESC.txt`):

```
🚀 AI-powered Jira subtask generator that automatically creates subtasks with intelligent descriptions using Gemini 3 Flash. Search parent issues, fill in task details, and generate professional subtasks with one click.

Features: ✨ Smart issue search & AI description generation | 📋 Comprehensive form with mandatory fields (Bobot, Story Point, Dates) | ⚡ One-click creation with real-time feedback | 🎨 Modern UI with smooth animations | ✅ Form validation & error handling

Tech: React 18, Node.js, Jira REST API v3, LiteLLM/Gemini, Axios
```

6. Click **Save**

### 2. Add Topics

1. Scroll ke **Topic** section
2. Add these topics:
   - `jira` - Project management integration
   - `task-generator` - Main topic
   - `subtask` - Functionality
   - `ai` - AI/ML integration
   - `react` - Frontend framework
   - `automation` - Task automation
   - `gemini` - AI model used
   - `project-management` - Use case

3. Click **Save**

### 3. Enable Features

Di **Settings** tab:

1. **Issues**
   - ✅ Enable Issues (untuk bug reports & feature requests)
   
2. **Discussions**
   - ✅ Enable Discussions (untuk general questions)
   
3. **Projects**
   - ✅ Enable Projects (untuk tracking roadmap)

4. **Wiki**
   - ✅ Enable Wiki (untuk community docs)

### 4. Setup Branch Protection

1. Go to **Settings** → **Branches**
2. Click **Add rule**
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require pull request reviews before merging (1 approval)
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators
5. Click **Create**

### 5. Add Issue Templates

Create `.github/ISSUE_TEMPLATE/` folder dengan files:

**bug_report.md:**
```markdown
---
name: Bug Report
about: Create a report to help us improve
title: "[BUG] "
labels: bug
---

## Description
A clear description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected behavior
What should happen instead?

## Screenshots
If applicable, add screenshots.

## Environment
- OS: [e.g. Windows, macOS]
- Browser: [e.g. Chrome, Firefox]
- Node version: [e.g. 18.0.0]

## Additional context
Any other context?
```

**feature_request.md:**
```markdown
---
name: Feature Request
about: Suggest an idea
title: "[FEATURE] "
labels: enhancement
---

## Description
Is your feature request related to a problem?

## Solution
Describe the solution you'd like.

## Alternatives
Any alternative solutions you've considered?

## Additional context
Any other information?
```

### 6. Create Pull Request Template

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Breaking change

## Changes Made
- Bullet point 1
- Bullet point 2

## Testing
Describe how you tested the changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] No secrets in commit
- [ ] Documentation updated
- [ ] Tests pass locally
- [ ] No console errors/warnings

## Screenshots (if applicable)
Attach screenshots here.
```

### 7. Enable GitHub Pages (Optional)

Untuk dokumentasi online:

1. Go to **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: main, /docs folder
4. Click **Save**

Atau custom domain:
1. Add `CNAME` file dengan domain name
2. Setup DNS records di registrar

### 8. Add Badges to README

Edit `README.md` header dan tambahkan:

```markdown
# Jira Subtask Generator

[![GitHub](https://img.shields.io/badge/GitHub-VanandaR%2Ftask--generator-blue?logo=github)](https://github.com/VanandaR/task-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![Open Issues](https://img.shields.io/github/issues/VanandaR/task-generator)](https://github.com/VanandaR/task-generator/issues)
[![Stars](https://img.shields.io/github/stars/VanandaR/task-generator?style=flat)](https://github.com/VanandaR/task-generator/stargazers)
```

### 9. Create Release

Untuk tracking versions:

1. Go to **Releases** tab
2. Click **Create a new release**
3. Tag version: `v1.0.0`
4. Title: `v1.0.0 - Initial Release`
5. Description:
```markdown
## Features
- Smart issue search
- AI description generation
- One-click subtask creation
- Form validation & error handling

## Tech Stack
- React 18
- Node.js server
- Jira REST API v3
- LiteLLM/Gemini integration

## Documentation
- [Setup Guide](https://github.com/VanandaR/task-generator/blob/main/SETUP.md)
- [Deployment Guide](https://github.com/VanandaR/task-generator/blob/main/DEPLOYMENT.md)
- [Contributing Guidelines](https://github.com/VanandaR/task-generator/blob/main/CONTRIBUTING.md)

See [CHANGELOG.md](https://github.com/VanandaR/task-generator/blob/main/CHANGELOG.md) for full details.
```
6. Click **Publish release**

### 10. Setup GitHub Actions (Optional)

Create `.github/workflows/tests.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run tests
      run: npm test
```

### 11. Add Secrets (jika ada CI/CD)

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add secrets yang diperlukan untuk deployment

Contoh:
- `VERCEL_TOKEN`
- `HEROKU_API_KEY`
- `AWS_ACCESS_KEY_ID`

### 12. Configure Security

1. Go to **Settings** → **Code security and analysis**

Enable:
- ✅ Dependabot alerts
- ✅ Dependabot security updates
- ✅ Secret scanning
- ✅ Push protection

### 13. Create CHANGELOG

Create `CHANGELOG.md`:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-08-07

### Added
- Initial release
- Smart issue search
- AI description generation
- One-click subtask creation
- Form validation
- Error handling
- Comprehensive documentation

### Features
- Search Jira issues by key
- Generate descriptions with Gemini AI
- Create subtasks with mandatory fields
- Real-time feedback & notifications
- Responsive UI design
```

## ✅ Final Checklist

Setelah semua setup:

- [ ] Repository description updated
- [ ] Topics added (5-8 relevant)
- [ ] Issues enabled
- [ ] Discussions enabled
- [ ] Branch protection configured
- [ ] Issue templates created
- [ ] PR template created
- [ ] GitHub Pages configured (optional)
- [ ] Badges added to README
- [ ] Release v1.0.0 created
- [ ] GitHub Actions workflow setup (optional)
- [ ] Secrets configured (if needed)
- [ ] Security settings enabled
- [ ] CHANGELOG.md created

## 🚀 Promotion Checklist

Setelah repository siap:

- [ ] Share on LinkedIn
- [ ] Share on Twitter/X
- [ ] Share on Dev.to (write article)
- [ ] Share on HackerNews
- [ ] Add to Awesome Lists
- [ ] Create product hunt post

Sample post:

```
🚀 Launching: Jira Subtask Generator - AI-powered subtask creation

Tired of manually writing subtask descriptions in Jira? This tool uses Gemini AI to automatically generate professional task descriptions and create subtasks with one click.

✨ Features:
- Smart Jira issue search
- AI description generation
- Form validation
- One-click creation

🛠️ Tech: React, Node.js, Jira API, Gemini

📦 Free & Open Source (MIT License)

Check it out: https://github.com/VanandaR/task-generator

#jira #ai #automation #productivity
```

## 📞 Support

Jika ada pertanyaan:
1. Check repository documentation
2. Open GitHub issue
3. Start GitHub discussion

---

**Status**: Repository fully configured and ready! 🎉

Next steps:
1. Implement suggested features
2. Build community
3. Gather feedback
4. Iterate and improve
