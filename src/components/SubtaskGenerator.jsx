import React, { useState } from 'react';
import { createSubtask, getIssue } from '../services/jiraService';
import { generateSubtaskDescription } from '../services/aiService';
import SubtaskForm from './SubtaskForm';
import './SubtaskGenerator.css';

function SubtaskGenerator() {
  const [parentIssue, setParentIssue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [parentIssueKey, setParentIssueKey] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearchIssue = async (issueKey) => {
    setSearchLoading(true);
    setError(null);
    try {
      const issue = await getIssue(issueKey);
      setParentIssue(issue);
      setParentIssueKey(issueKey);
    } catch (err) {
      setError(`Failed to fetch issue: ${err.message}`);
      setParentIssue(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleGenerateAndCreate = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Generate description using AI
      const aiResponse = await generateSubtaskDescription(
        parentIssue.fields.description || 'No description available',
        formData.userInput
      );

      // Create subtask
      const subtaskPayload = {
        summary: aiResponse.summary,
        description: aiResponse.description,
        bobot: formData.bobot,
        storyPoint: formData.storyPoint,
        systemAnalyst: formData.systemAnalyst,
        programmer: formData.programmer,
        programmerEnd: formData.programmerEnd,
        qcEnd: formData.qcEnd,
      };

      const result = await createSubtask(parentIssueKey, subtaskPayload);
      setSuccess({
        message: 'Subtask created successfully!',
        issueKey: result.key,
      });
    } catch (err) {
      setError(`Failed to create subtask: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subtask-generator">
      <div className="header">
        <h1>Jira Subtask Generator</h1>
        <p>Generate and create subtasks with AI assistance</p>
      </div>

      <div className="main-content">
        {!parentIssue ? (
          <div className="search-section">
            <h2>Step 1: Search Parent Issue</h2>
            <div className="search-input-group">
              <input
                type="text"
                placeholder="e.g., PCC-1439"
                value={parentIssueKey}
                onChange={(e) => setParentIssueKey(e.target.value)}
                disabled={searchLoading}
              />
              <button
                onClick={() => handleSearchIssue(parentIssueKey)}
                disabled={!parentIssueKey || searchLoading}
              >
                {searchLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
        ) : (
          <>
            <div className="issue-summary">
              <h2>Parent Issue: {parentIssue.key}</h2>
              <p className="issue-title">{parentIssue.fields.summary}</p>
              <button
                className="change-issue-btn"
                onClick={() => {
                  setParentIssue(null);
                  setParentIssueKey('');
                  setError(null);
                }}
              >
                Change Issue
              </button>
            </div>

            <div className="form-section">
              <h2>Step 2: Generate Subtask</h2>
              <SubtaskForm
                onSubmit={handleGenerateAndCreate}
                loading={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && (
              <div className="success-message">
                <p>{success.message}</p>
                <p>Issue Key: <strong>{success.issueKey}</strong></p>
                <button
                  className="create-another-btn"
                  onClick={() => {
                    setSuccess(null);
                    setError(null);
                  }}
                >
                  Create Another Subtask
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SubtaskGenerator;
