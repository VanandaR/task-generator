# Jira Subtask Generator

🚀 AI-powered web application for automatically generating and creating Jira subtasks with intelligent descriptions.

## Overview

Tired of manually creating subtasks in Jira? This application uses AI to generate professional task descriptions and summaries, then automatically creates them in Jira with a single click. Perfect for agile teams that need to break down parent tasks into manageable subtasks quickly.

## ✨ Features

- **🔍 Smart Issue Search** - Find parent Jira issues by key and fetch their details
- **🤖 AI-Generated Content** - Automatic generation of task summaries and descriptions using Gemini 3 Flash
- **📋 Comprehensive Form** - Mandatory fields for proper task management:
  - Task description (user input for AI generation)
  - Bobot/Weight (High/Medium/Low priority)
  - Story Point estimation
  - System Analyst assignment
  - Programmer assignment
  - Programmer End Date
  - QC End Date
- **⚡ One-Click Creation** - Generate AI content and create subtask simultaneously
- **🎨 Modern UI** - Beautiful gradient design with smooth animations and responsive layout
- **✅ Validation & Error Handling** - Comprehensive form validation and error messages
- **🔔 Real-time Feedback** - Success/error notifications with issue key display

## 🎯 How It Works

```
1. Enter Jira Issue Key (e.g., PCC-1439)
           ↓
2. System fetches parent issue details
           ↓
3. Fill in task requirements and dates
           ↓
4. Click "Generate & Create Subtask"
           ↓
5. AI generates professional summary and description
           ↓
6. Subtask automatically created in Jira
           ↓
7. View success notification with issue key
```

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 (via CDN) |
| **API Calls** | Axios |
| **UI Styling** | Vanilla CSS with modern gradients |
| **AI Integration** | OpenAI-compatible API (LiteLLM) |
| **Jira Integration** | Jira REST API v3 |
| **Runtime** | Node.js (server) |

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ installed
- Valid Jira PAT (Personal Access Token)
- Valid OpenAI/LiteLLM API key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/jira-subtask-generator.git
cd jira-subtask-generator

# Install dependencies
npm install

# Start the application
npm start
```

The application will be available at `http://localhost:3000`

## ⚙️ Configuration

1. Copy `.env.example` to `.env`
2. Fill in your credentials:

```bash
REACT_APP_JIRA_SERVER=https://your-jira-instance.com
REACT_APP_JIRA_PAT=your_jira_personal_access_token
REACT_APP_OPENAI_API_KEY=your_openai_api_key
REACT_APP_OPENAI_BASE_URL=https://api.openai.com/v1
REACT_APP_AI_MODEL_NAME=gpt-4-turbo-preview
```

Then update the `CONFIG` object in `index.html` to read from environment:

## 📁 Project Structure

```
jira-subtask-generator/
├── index.html                 # Main all-in-one application
├── server.js                  # Simple Node.js server
├── package.json              # Project dependencies
├── README.md                 # Full documentation
├── src/                      # Modular component structure
│   ├── components/
│   │   ├── SubtaskGenerator.jsx
│   │   └── SubtaskForm.jsx
│   ├── services/
│   │   ├── jiraService.js
│   │   └── aiService.js
│   ├── App.jsx
│   └── index.js
└── webpack.config.js         # Build configuration
```

## 📖 Usage Guide

### Step 1: Search for Parent Issue
- Enter the Jira issue key (e.g., `PCC-1439`)
- Click the "Search" button
- The issue details will be fetched from Jira

### Step 2: Fill in Task Details
Complete the form with:
- **Task Description**: What needs to be done (sent to AI for generation)
- **Bobot Task**: Priority level (High/Medium/Low)
- **Story Point**: Effort estimation
- **System Analyst**: Responsible analyst
- **Programmer**: Developer assignment
- **Programmer End Date**: Expected completion date
- **QC End Date**: QA testing deadline

### Step 3: Generate & Create
- Click "Generate & Create Subtask"
- AI generates professional summary and description
- Subtask automatically created in Jira
- Success message displays with issue key

## 🔌 API Integration

### Jira REST API v3
- **Endpoint**: `https://jira.beacukai.go.id/rest/api/3`
- **Authentication**: Basic Auth with PAT
- **Operations**: Fetch issues, Create subtasks

### OpenAI-Compatible API (LiteLLM)
- **Endpoint**: `https://litellm-gateway.customs.go.id/v1`
- **Model**: `vertex_ai/gemini-3-flash-preview`
- **Operation**: Generate task descriptions and summaries

## ⚠️ Security Considerations

**Current Implementation**: API keys are stored in frontend (suitable for internal use only)

**For Production**:
1. ✅ Move API keys to backend environment variables
2. ✅ Create secure API gateway
3. ✅ Implement proper authentication & authorization
4. ✅ Use secure token storage/refresh mechanisms
5. ✅ Add rate limiting and request validation
6. ✅ Enable HTTPS and CORS policies

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Issue: "Failed to fetch issue"
- ✓ Verify issue key is correct (e.g., `PCC-1439`)
- ✓ Check internet connection
- ✓ Validate Jira PAT token
- ✓ Ensure Jira server URL is accessible

### Issue: "Failed to create subtask"
- ✓ Ensure all form fields are filled
- ✓ Verify parent issue exists and is accessible
- ✓ Check Jira PAT has create issue permission

### Issue: "AI Error"
- ✓ Verify OpenAI API key is valid
- ✓ Check API endpoint URL
- ✓ Ensure model is available in LiteLLM setup

## 🚧 Roadmap

- [ ] Backend API for secure key management
- [ ] User authentication and authorization
- [ ] Custom field mapping
- [ ] Bulk subtask creation
- [ ] Task templates library
- [ ] Integration with other project management tools
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Analytics and reporting
- [ ] Webhook support for automated workflows

## 📊 Performance Metrics

| Metric | Target |
|--------|--------|
| Initial Load | < 2s |
| Issue Search | < 1s |
| Subtask Creation | < 3s |
| Form Validation | < 100ms |

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created by [Your Name/Team]

## 📧 Support

For issues, questions, or suggestions:
1. Open an GitHub issue
2. Check existing documentation in README.md
3. Review troubleshooting section above

## 🙏 Acknowledgments

- Jira for comprehensive REST API
- OpenAI/Google for AI capabilities via LiteLLM
- React community for excellent framework
- All contributors and users

---

**Made with ❤️ to streamline Jira workflow automation**

## Screenshots

### Search Issue
![Search Interface](docs/screenshots/search.png)

### Task Form
![Task Creation Form](docs/screenshots/form.png)

### Success Notification
![Success Message](docs/screenshots/success.png)

## FAQ

**Q: Can I use this with cloud-hosted Jira?**
A: Yes! This works with any Jira instance that supports REST API v3 and PAT authentication.

**Q: What AI models are supported?**
A: Any model available through LiteLLM gateway. Currently configured for `vertex_ai/gemini-3-flash-preview`.

**Q: Is there a rate limit?**
A: Rate limits depend on your Jira and OpenAI API plans.

**Q: Can I customize the form fields?**
A: Yes! Modify the `SubtaskForm.jsx` component to add/remove fields as needed.

**Q: Does it support custom Jira fields?**
A: Yes, update the `customfield_XXXXX` mappings in `jiraService.js`.

---

**Last Updated**: August 2026 | **Version**: 1.0.0
