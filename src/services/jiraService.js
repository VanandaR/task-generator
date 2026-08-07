import axios from 'axios';

const JIRA_SERVER = process.env.REACT_APP_JIRA_SERVER;
const JIRA_PAT = process.env.REACT_APP_JIRA_PAT;

const jiraAPI = axios.create({
  baseURL: `${JIRA_SERVER}/rest/api/2`,
  auth: {
    username: 'api_token',
    password: JIRA_PAT,
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const createSubtask = async (parentIssueKey, subtaskData) => {
  try {
    const response = await jiraAPI.post('/issue', {
      fields: {
        project: { key: parentIssueKey.split('-')[0] },
        parent: { key: parentIssueKey },
        issuetype: { name: 'Sub-task' },
        summary: subtaskData.summary,
        description: {
          version: 3,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: subtaskData.description,
                },
              ],
            },
          ],
        },
        customfield_10000: subtaskData.bobot, // Bobot Task
        customfield_10001: subtaskData.storyPoint, // Story Point
        customfield_10002: subtaskData.systemAnalyst, // System Analyst
        customfield_10003: subtaskData.programmer, // Programmer
        customfield_10004: subtaskData.programmerEnd, // Programmer End
        customfield_10005: subtaskData.qcEnd, // QC End
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating subtask:', error);
    throw error;
  }
};

export const getIssue = async (issueKey) => {
  try {
    const response = await jiraAPI.get(`/issue/${issueKey}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching issue:', error);
    throw error;
  }
};
