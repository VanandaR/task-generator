import axios from 'axios';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.REACT_APP_OPENAI_BASE_URL;
const AI_MODEL_NAME = process.env.REACT_APP_AI_MODEL_NAME;

const aiAPI = axios.create({
  baseURL: OPENAI_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
  },
});

export const generateSubtaskDescription = async (parentDescription, userInput) => {
  try {
    const prompt = `
You are a task decomposition expert for a Jira project management system.

Given a parent task and a user request, generate a clear and concise task summary and description.

Parent Task Description:
${parentDescription}

User Request:
${userInput}

Generate a JSON response with the following structure:
{
  "summary": "A clear, concise summary (max 255 characters)",
  "description": "A detailed description of the subtask with clear objectives and acceptance criteria"
}

Make sure the summary is specific and actionable, and the description includes:
- What needs to be done
- Why it needs to be done
- Acceptance criteria or success metrics
`;

    const response = await aiAPI.post('/chat/completions', {
      model: AI_MODEL_NAME,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates clear, detailed task descriptions for software development projects.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 1000,
    });

    const content = response.data.choices[0].message.content;
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('Error generating description:', error);
    throw error;
  }
};
