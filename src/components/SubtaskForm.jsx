import React, { useState } from 'react';
import './SubtaskForm.css';

function SubtaskForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    userInput: '',
    bobot: '',
    storyPoint: '',
    systemAnalyst: '',
    programmer: '',
    programmerEnd: '',
    qcEnd: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userInput.trim()) {
      newErrors.userInput = 'Task description is required';
    }
    if (!formData.bobot) {
      newErrors.bobot = 'Bobot task is required';
    }
    if (!formData.storyPoint) {
      newErrors.storyPoint = 'Story point is required';
    }
    if (!formData.systemAnalyst) {
      newErrors.systemAnalyst = 'System analyst is required';
    }
    if (!formData.programmer) {
      newErrors.programmer = 'Programmer is required';
    }
    if (!formData.programmerEnd) {
      newErrors.programmerEnd = 'Programmer end date is required';
    }
    if (!formData.qcEnd) {
      newErrors.qcEnd = 'QC end date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form className="subtask-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="userInput">Task Description *</label>
        <textarea
          id="userInput"
          name="userInput"
          value={formData.userInput}
          onChange={handleChange}
          placeholder="Describe what needs to be done..."
          rows="4"
          disabled={loading}
        />
        {errors.userInput && <span className="error">{errors.userInput}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="bobot">Bobot Task *</label>
          <select
            id="bobot"
            name="bobot"
            value={formData.bobot}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">-- Select --</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          {errors.bobot && <span className="error">{errors.bobot}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="storyPoint">Story Point *</label>
          <input
            type="number"
            id="storyPoint"
            name="storyPoint"
            value={formData.storyPoint}
            onChange={handleChange}
            placeholder="e.g., 5"
            min="0"
            disabled={loading}
          />
          {errors.storyPoint && <span className="error">{errors.storyPoint}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="systemAnalyst">System Analyst *</label>
          <input
            type="text"
            id="systemAnalyst"
            name="systemAnalyst"
            value={formData.systemAnalyst}
            onChange={handleChange}
            placeholder="Your name or assignee"
            disabled={loading}
          />
          {errors.systemAnalyst && <span className="error">{errors.systemAnalyst}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="programmer">Programmer *</label>
          <input
            type="text"
            id="programmer"
            name="programmer"
            value={formData.programmer}
            onChange={handleChange}
            placeholder="Programmer name"
            disabled={loading}
          />
          {errors.programmer && <span className="error">{errors.programmer}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="programmerEnd">Programmer End Date *</label>
          <input
            type="datetime-local"
            id="programmerEnd"
            name="programmerEnd"
            value={formData.programmerEnd}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.programmerEnd && <span className="error">{errors.programmerEnd}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="qcEnd">QC End Date *</label>
          <input
            type="datetime-local"
            id="qcEnd"
            name="qcEnd"
            value={formData.qcEnd}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.qcEnd && <span className="error">{errors.qcEnd}</span>}
        </div>
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={loading}
      >
        {loading ? 'Creating Subtask...' : 'Generate & Create Subtask'}
      </button>
    </form>
  );
}

export default SubtaskForm;
