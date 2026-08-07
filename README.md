# Jira Subtask Generator

An AI-powered web application for generating and creating Jira subtasks with automatically generated descriptions and summaries.

## Features

- **Search Parent Issue**: Find and select a parent Jira issue by key (e.g., PCC-1439)
- **AI-Generated Description**: Automatically generate task summaries and detailed descriptions using OpenAI
- **Mandatory Fields**: 
  - Task description (user input)
  - Bobot task (High/Medium/Low)
  - Story Point
  - System Analyst
  - Programmer
  - Programmer End Date
  - QC End Date
- **One-Click Subtask Creation**: Create subtasks directly in Jira with all information populated

## Getting Started

### Prerequisites
- Node.js v16+
- Valid Jira PAT (Personal Access Token)
- Valid OpenAI or LiteLLM API key

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/VanandaR/task-generator.git
cd task-generator
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your credentials
# REACT_APP_JIRA_SERVER=your-jira-url
# REACT_APP_JIRA_PAT=your-jira-pat
# REACT_APP_OPENAI_API_KEY=your-api-key
# REACT_APP_OPENAI_BASE_URL=your-api-base-url
# REACT_APP_AI_MODEL_NAME=your-model-name
```

4. **Start the application**
```bash
npm start
```

5. **Open in browser**
Navigate to `http://localhost:3000`

### Configuration

The application requires the following environment variables in `.env` file:

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_JIRA_SERVER` | Your Jira instance URL | `https://jira.company.com` |
| `REACT_APP_JIRA_PAT` | Jira Personal Access Token | `your_pat_token` |
| `REACT_APP_OPENAI_API_KEY` | OpenAI/LiteLLM API key | `sk-...` |
| `REACT_APP_OPENAI_BASE_URL` | API endpoint URL | `https://api.openai.com/v1` |
| `REACT_APP_AI_MODEL_NAME` | AI model to use | `gpt-4-turbo-preview` |

See `.env.example` for a template.

## How to Use

1. **Search for Parent Issue**
   - Enter the issue key (e.g., PCC-1439)
   - Click the "Search" button
   - The issue details will be fetched from Jira

2. **Fill in Subtask Information**
   - **Task Description**: Describe what needs to be done (will be sent to AI to generate formal summary and description)
   - **Bobot Task**: Select priority level (High, Medium, or Low)
   - **Story Point**: Estimate the effort in story points
   - **System Analyst**: Assign the system analyst
   - **Programmer**: Assign the programmer
   - **Programmer End Date**: When should programming be completed
   - **QC End Date**: When should QC be completed

3. **Generate & Create Subtask**
   - Click "Generate & Create Subtask"
   - The AI will generate a professional summary and description
   - The subtask will be created in Jira automatically

## Technical Stack

- **Frontend**: React 18 (via CDN)
- **API Calls**: Axios
- **AI**: OpenAI-compatible API (LiteLLM)
- **Jira Integration**: Jira REST API v3
- **Styling**: Vanilla CSS with modern UI/UX

## File Structure

```
task-generator-2/
├── index.html           # Main application file (all-in-one)
├── README.md           # This file
├── package.json        # NPM configuration (optional, for build setup)
├── .env               # Environment variables
└── src/               # Original modular structure (for reference)
```

## Features

✅ Search and fetch Jira issues
✅ AI-powered task description generation
✅ Form validation
✅ Error handling
✅ Success notifications
✅ Responsive design
✅ Support for multiple subtask creation
✅ Modern, gradient-based UI

## Troubleshooting

### "Failed to fetch issue" error
- Verify the issue key is correct (e.g., PCC-1439)
- Check your internet connection
- Verify Jira PAT token is valid
- Check that the Jira server URL is accessible

### "Failed to create subtask" error
- Ensure all required fields are filled correctly
- Verify the parent issue exists and is accessible
- Check that your Jira PAT has permission to create issues

### "AI Error" message
- Verify your OpenAI API key is valid
- Check the OpenAI base URL is correct
- Ensure the model name is available in your LiteLLM setup

## API Integration

### Jira REST API
- **Endpoint**: `https://jira.beacukai.go.id/rest/api/3`
- **Authentication**: Basic Auth with PAT token
- **Used for**: Fetching and creating issues

### OpenAI-Compatible API
- **Endpoint**: `https://litellm-gateway.customs.go.id/v1`
- **Model**: `vertex_ai/gemini-3-flash-preview`
- **Used for**: Generating task descriptions and summaries

## Security Considerations

⚠️ **Important**: The current implementation includes API keys directly in the frontend code. This is suitable for development/internal use only.

For production use:
1. Move API keys to backend environment variables
2. Create a backend API gateway
3. Implement proper authentication
4. Use secure token storage

## Future Enhancements

- [ ] Backend API for secure key management
- [ ] User authentication
- [ ] Custom field mapping
- [ ] Bulk subtask creation
- [ ] Template support
- [ ] Integration with other project management tools
- [ ] Dark mode
- [ ] Multi-language support

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all configuration values
3. Test API connectivity independently
4. Review browser console for error details

## License

Internal Use Only
