
    <script type="text/babel">
        const { useState, useEffect } = React;

        // Helper: Extract issue key from browse URL or plain key
        const parseIssueKey = (input) => {
            if (!input) return '';
            const trimmed = input.trim();
            const browseMatch = trimmed.match(/\/browse\/([A-Z][A-Z0-9]+-\d+)/i);
            if (browseMatch) return browseMatch[1].toUpperCase();
            const keyMatch = trimmed.match(/^([A-Z][A-Z0-9]+-\d+)$/i);
            if (keyMatch) return keyMatch[1].toUpperCase();
            return trimmed;
        };

        // Helper: Add working days to a date (skip weekends)
        const addWorkingDays = (startDate, days) => {
            const result = new Date(startDate);
            let added = 0;
            while (added < days) {
                result.setDate(result.getDate() + 1);
                const dayOfWeek = result.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    added++;
                }
            }
            return result;
        };

        // Helper: Format date to datetime-local input value
        const formatDateTimeLocal = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}T17:00`;
        };

        // Services
        const jiraService = {
            getCurrentUser: async () => {
                try {
                    const response = await axios.get('/api/jira/myself');
                    return response.data;
                } catch (error) {
                    console.warn('Could not fetch Jira user:', error.message);
                    return null;
                }
            },

            createSubtask: async (parentIssueKey, subtaskData) => {
                try {
                    const projectKey = parentIssueKey.split('-')[0];
                    const response = await axios.post('/api/jira/create-subtask', {
                        payload: {
                            fields: {
                                project: { key: projectKey },
                                parent: { key: parentIssueKey },
                                issuetype: { name: 'Sub-task' },
                                summary: subtaskData.summary,
                                description: subtaskData.description,
                            },
                        },
                    });

                    if (response.data.errors) {
                        throw new Error(Object.values(response.data.errors).join(', '));
                    }
                    if (response.data.errorMessages?.length > 0) {
                        throw new Error(response.data.errorMessages.join(', '));
                    }
                    return response.data;
                } catch (error) {
                    throw new Error(`Failed to create subtask: ${error.response?.data?.errorMessages?.[0] || error.response?.data?.error || error.message}`);
                }
            },
        };

        const aiService = {
            generateSubtask: async (userInput, config) => {
                try {
                    const prompt = `Kamu adalah expert task decomposition untuk Jira project management.

Berdasarkan deskripsi task dari user, generate detail subtask dengan format JSON berikut:

{
  "summary": "Summary singkat dan actionable (max 255 karakter, dalam Bahasa Indonesia)",
  "description": "## Deskripsi\\n[Penjelasan detail apa yang harus dikerjakan]\\n\\n## Latar Belakang\\n[Kenapa task ini perlu dikerjakan]\\n\\n## Langkah Pengerjaan\\n1. [Langkah 1]\\n2. [Langkah 2]\\n3. [Langkah 3]\\n\\n## Acceptance Criteria\\n- [ ] [Kriteria 1]\\n- [ ] [Kriteria 2]\\n- [ ] [Kriteria 3]",
  "bobot": "High|Medium|Low",
  "storyPoint": 5,
  "devDays": 3,
  "qcDays": 1
}

Panduan estimasi:
- storyPoint: 1-2 (sangat simple), 3-5 (medium), 8-13 (complex), 21+ (sangat complex)
- bobot: "Low" (bug fix kecil, UI tweak), "Medium" (fitur standar), "High" (fitur complex/critical)  
- devDays: estimasi hari kerja development (1-2 simple, 3-5 medium, 5-10 complex)
- qcDays: estimasi hari kerja QC/testing (1 simple, 2-3 medium, 3-5 complex)

Deskripsi task dari user:
${userInput}

PENTING: Response HANYA JSON, tanpa markdown code block, tanpa penjelasan tambahan.`;

                    const messages = [
                        {
                            role: 'system',
                            content: 'Kamu adalah assistant yang membantu generate deskripsi task Jira yang terstruktur dan konsisten untuk project software development. Selalu respond dalam format JSON saja.',
                        },
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ];

                    let response;
                    // Try direct call from browser first (in case backend has ETIMEDOUT network issues)
                    if (config?.aiBaseUrl && config?.aiApiKey) {
                        try {
                            response = await axios.post(`${config.aiBaseUrl}/chat/completions`, {
                                model: config.aiModelName || 'vertex_ai/gemini-3-flash-preview',
                                messages: messages,
                                temperature: 0.7,
                                top_p: 0.9,
                                max_tokens: 1000,
                            }, {
                                headers: {
                                    'Authorization': `Bearer ${config.aiApiKey}`,
                                    'Content-Type': 'application/json'
                                }
                            });
                        } catch (directErr) {
                            console.warn("Direct AI call failed, falling back to proxy...", directErr);
                            // Fallback to proxy
                            response = await axios.post('/api/ai/generate', { messages });
                        }
                    } else {
                        // Use proxy if config isn't available
                        response = await axios.post('/api/ai/generate', { messages });
                    }

                    const content = response.data.choices[0].message.content;
                    const jsonMatch = content.match(/\{[\s\S]*\}/);
                    
                    if (jsonMatch) {
                        return JSON.parse(jsonMatch[0]);
                    }
                    
                    return JSON.parse(content); // Try raw parse if no match
                } catch (error) {
                    throw new Error(`AI Error: ${error.message}`);
                }
            },
        };

        // ========== COMPONENTS ==========

        // Step 2: User describes what needs to be done
        function TaskInputForm({ onGenerate, loading }) {
            const [userInput, setUserInput] = useState('');

            const handleSubmit = (e) => {
                e.preventDefault();
                if (userInput.trim()) {
                    onGenerate(userInput);
                }
            };

            return (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="userInput">Deskripsikan task yang perlu dikerjakan *</label>
                        <textarea
                            id="userInput"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Contoh: Buat halaman login dengan validasi email dan password, integrasi dengan API auth..."
                            rows="5"
                            disabled={loading}
                            style={{fontSize: '15px'}}
                        />
                    </div>
                    <button type="submit" className="submit-btn" disabled={!userInput.trim() || loading}>
                        {loading ? (
                            <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                                <span className="spinner" style={{width: '20px', height: '20px', margin: 0, borderWidth: '3px'}}></span>
                                AI sedang generate...
                            </span>
                        ) : '🤖 Generate dengan AI'}
                    </button>
                </form>
            );
        }

                // Step 3: Preview & Review AI-generated results
        function ReviewForm({ formData, onChange, onSubmit, onRegenerate, loading }) {
            const [isEditing, setIsEditing] = useState(false);
            const [errors, setErrors] = useState({});

            const validateForm = () => {
                const newErrors = {};
                if (!formData.summary?.trim()) newErrors.summary = 'Summary is required';
                if (!formData.description?.trim()) newErrors.description = 'Description is required';
                if (!formData.bobot) newErrors.bobot = 'Bobot is required';
                if (!formData.storyPoint) newErrors.storyPoint = 'Story point is required';
                if (!formData.systemAnalyst?.trim()) newErrors.systemAnalyst = 'System analyst is required';
                if (!formData.programmer?.trim()) newErrors.programmer = 'Programmer is required';
                if (!formData.programmerEnd) newErrors.programmerEnd = 'Programmer end date is required';
                if (!formData.qcEnd) newErrors.qcEnd = 'QC end date is required';
                setErrors(newErrors);
                return Object.keys(newErrors).length === 0;
            };

            const handleSubmit = () => {
                if (validateForm()) {
                    onSubmit(formData);
                }
            };

            const handleChange = (e) => {
                const { name, value } = e.target;
                onChange({ ...formData, [name]: value });
                if (errors[name]) {
                    setErrors(prev => ({ ...prev, [name]: '' }));
                }
            };

            const bobotColor = { High: '#e53935', Medium: '#fb8c00', Low: '#43a047' };
            const formatDate = (dt) => {
                if (!dt) return '-';
                const d = new Date(dt);
                return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            };

            // ===== PREVIEW MODE =====
            if (!isEditing) {
                return (
                    <div style={{animation: 'fadeIn 0.3s ease-out'}}>
                        {/* Metrics Cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '12px',
                            marginBottom: '20px',
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
                                borderRadius: '10px',
                                padding: '16px',
                                textAlign: 'center',
                            }}>
                                <div style={{fontSize: '12px', color: '#1565c0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'}}>Story Point</div>
                                <div style={{fontSize: '32px', fontWeight: 700, color: '#0d47a1', marginTop: '4px'}}>{formData.storyPoint || '-'}</div>
                            </div>
                            <div style={{
                                background: `linear-gradient(135deg, ${formData.bobot === 'High' ? '#ffebee, #ffcdd2' : formData.bobot === 'Medium' ? '#fff3e0, #ffe0b2' : '#e8f5e9, #c8e6c9'})`,
                                borderRadius: '10px',
                                padding: '16px',
                                textAlign: 'center',
                            }}>
                                <div style={{fontSize: '12px', color: bobotColor[formData.bobot] || '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'}}>Bobot</div>
                                <div style={{fontSize: '24px', fontWeight: 700, color: bobotColor[formData.bobot] || '#333', marginTop: '4px'}}>{formData.bobot || '-'}</div>
                            </div>
                            <div style={{
                                background: 'linear-gradient(135deg, #f3e5f5, #e1bee7)',
                                borderRadius: '10px',
                                padding: '16px',
                                textAlign: 'center',
                            }}>
                                <div style={{fontSize: '12px', color: '#7b1fa2', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'}}>Assignee</div>
                                <div style={{fontSize: '14px', fontWeight: 600, color: '#4a148c', marginTop: '8px'}}>{formData.programmer || '-'}</div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div style={{
                            background: '#f5f5f5',
                            borderLeft: '4px solid #667eea',
                            borderRadius: '0 8px 8px 0',
                            padding: '16px',
                            marginBottom: '16px',
                        }}>
                            <div style={{fontSize: '12px', color: '#666', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase'}}>Summary</div>
                            <div style={{fontSize: '16px', fontWeight: 600, color: '#333'}}>{formData.summary}</div>
                        </div>

                        {/* Description */}
                        <div style={{
                            background: '#fafafa',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            padding: '16px',
                            marginBottom: '16px',
                        }}>
                            <div style={{fontSize: '12px', color: '#666', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase'}}>Description</div>
                            <pre style={{
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                fontFamily: '-apple-system, sans-serif',
                                fontSize: '14px',
                                color: '#333',
                                lineHeight: '1.6',
                                margin: 0,
                            }}>{formData.description}</pre>
                        </div>

                        {/* Dates */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                            marginBottom: '20px',
                        }}>
                            <div style={{background: '#fff8e1', borderRadius: '8px', padding: '12px'}}>
                                <div style={{fontSize: '12px', color: '#f57f17', fontWeight: 600}}>📅 Dev End Date</div>
                                <div style={{fontSize: '14px', fontWeight: 600, color: '#333', marginTop: '4px'}}>{formatDate(formData.programmerEnd)}</div>
                            </div>
                            <div style={{background: '#e8eaf6', borderRadius: '8px', padding: '12px'}}>
                                <div style={{fontSize: '12px', color: '#283593', fontWeight: 600}}>🧪 QC End Date</div>
                                <div style={{fontSize: '14px', fontWeight: 600, color: '#333', marginTop: '4px'}}>{formatDate(formData.qcEnd)}</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{display: 'flex', gap: '10px'}}>
                            <button
                                className="submit-btn"
                                onClick={handleSubmit}
                                disabled={loading}
                                style={{flex: 1}}
                            >
                                {loading ? 'Creating Subtask...' : '🚀 Create Subtask di Jira'}
                            </button>
                            <button
                                className="submit-btn"
                                onClick={() => setIsEditing(true)}
                                disabled={loading}
                                style={{flex: '0 0 auto', background: 'linear-gradient(135deg, #78909c 0%, #546e7a 100%)', padding: '14px 20px'}}
                            >
                                ✏️ Edit
                            </button>
                            <button
                                className="submit-btn"
                                onClick={onRegenerate}
                                disabled={loading}
                                style={{flex: '0 0 auto', background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', padding: '14px 20px'}}
                            >
                                🔄 Re-generate
                            </button>
                        </div>
                    </div>
                );
            }

            // ===== EDIT MODE =====
            return (
                <form className="subtask-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
                        border: '1px solid #ffcc80',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        marginBottom: '10px',
                        fontSize: '14px',
                        color: '#e65100',
                    }}>
                        ✏️ Mode edit — ubah field yang perlu, lalu klik Save atau Create.
                    </div>

                    <div className="form-group">
                        <label htmlFor="summary">Summary *</label>
                        <input type="text" id="summary" name="summary" value={formData.summary || ''} onChange={handleChange} disabled={loading} />
                        {errors.summary && <span className="error">{errors.summary}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} rows="10" disabled={loading} style={{fontFamily: 'monospace', fontSize: '13px'}} />
                        {errors.description && <span className="error">{errors.description}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="bobot">Bobot Task *</label>
                            <select id="bobot" name="bobot" value={formData.bobot || ''} onChange={handleChange} disabled={loading}>
                                <option value="">-- Select --</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                            {errors.bobot && <span className="error">{errors.bobot}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="storyPoint">Story Point *</label>
                            <input type="number" id="storyPoint" name="storyPoint" value={formData.storyPoint || ''} onChange={handleChange} min="1" disabled={loading} />
                            {errors.storyPoint && <span className="error">{errors.storyPoint}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="systemAnalyst">System Analyst *</label>
                            <input type="text" id="systemAnalyst" name="systemAnalyst" value={formData.systemAnalyst || ''} onChange={handleChange} disabled={loading} />
                            {errors.systemAnalyst && <span className="error">{errors.systemAnalyst}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="programmer">Programmer *</label>
                            <input type="text" id="programmer" name="programmer" value={formData.programmer || ''} onChange={handleChange} disabled={loading} />
                            {errors.programmer && <span className="error">{errors.programmer}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="programmerEnd">Programmer End Date *</label>
                            <input type="datetime-local" id="programmerEnd" name="programmerEnd" value={formData.programmerEnd || ''} onChange={handleChange} disabled={loading} />
                            {errors.programmerEnd && <span className="error">{errors.programmerEnd}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="qcEnd">QC End Date *</label>
                            <input type="datetime-local" id="qcEnd" name="qcEnd" value={formData.qcEnd || ''} onChange={handleChange} disabled={loading} />
                            {errors.qcEnd && <span className="error">{errors.qcEnd}</span>}
                        </div>
                    </div>

                    <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                        <button type="submit" className="submit-btn" disabled={loading} style={{flex: 1}}>
                            {loading ? 'Creating Subtask...' : '🚀 Create Subtask di Jira'}
                        </button>
                        <button
                            type="button"
                            className="submit-btn"
                            onClick={() => setIsEditing(false)}
                            disabled={loading}
                            style={{flex: '0 0 auto', background: 'linear-gradient(135deg, #78909c 0%, #546e7a 100%)', padding: '14px 20px'}}
                        >
                            👁️ Preview
                        </button>
                    </div>
                </form>
            );
        }

        // ========== MAIN COMPONENT ==========
        function SubtaskGenerator() {
            const [parentIssueKey, setParentIssueKey] = useState('');
            const [inputValue, setInputValue] = useState('');
            const [isKeySet, setIsKeySet] = useState(false);
            const [loading, setLoading] = useState(false);
            const [generating, setGenerating] = useState(false);
            const [error, setError] = useState(null);
            const [success, setSuccess] = useState(null);
            const [jiraServer, setJiraServer] = useState('');
            const [aiConfig, setAiConfig] = useState(null);
            const [currentUser, setCurrentUser] = useState(null);
            const [reviewData, setReviewData] = useState(null);
            const [lastUserInput, setLastUserInput] = useState('');

            // Load config & current user on mount
            useEffect(() => {
                axios.get('/api/config').then(res => {
                    setJiraServer(res.data.jiraServer || '');
                    setAiConfig({
                        aiBaseUrl: res.data.aiBaseUrl,
                        aiApiKey: res.data.aiApiKey,
                        aiModelName: res.data.aiModelName
                    });
                }).catch(() => {});

                jiraService.getCurrentUser().then(user => {
                    if (user) {
                        setCurrentUser(user);
                    }
                });
            }, []);

            const handleSetIssue = () => {
                setError(null);
                const key = parseIssueKey(inputValue);
                if (!key || !/^[A-Z][A-Z0-9]+-\d+$/i.test(key)) {
                    setError('Format tidak valid. Gunakan format: PCC-1439 atau https://jira.beacukai.go.id/browse/PCC-1439');
                    return;
                }
                setParentIssueKey(key);
                setIsKeySet(true);
            };

            const handleKeyPress = (e) => {
                if (e.key === 'Enter') {
                    handleSetIssue();
                }
            };

            const handleGenerate = async (userInput) => {
                setGenerating(true);
                setError(null);
                setLastUserInput(userInput);

                try {
                    const aiResponse = await aiService.generateSubtask(userInput, aiConfig);
                    
                    const today = new Date();
                    const devEndDate = addWorkingDays(today, aiResponse.devDays || 3);
                    const qcEndDate = addWorkingDays(devEndDate, aiResponse.qcDays || 1);

                    const userName = currentUser?.displayName || currentUser?.name || '';

                    setReviewData({
                        summary: aiResponse.summary,
                        description: aiResponse.description,
                        bobot: aiResponse.bobot || 'Medium',
                        storyPoint: String(aiResponse.storyPoint || 5),
                        systemAnalyst: userName,
                        programmer: userName,
                        programmerEnd: formatDateTimeLocal(devEndDate),
                        qcEnd: formatDateTimeLocal(qcEndDate),
                    });
                } catch (err) {
                    setError(err.message);
                } finally {
                    setGenerating(false);
                }
            };

            const handleCreate = async (formData) => {
                setLoading(true);
                setError(null);
                setSuccess(null);

                try {
                    const result = await jiraService.createSubtask(parentIssueKey, {
                        summary: formData.summary,
                        description: formData.description,
                    });

                    setSuccess({
                        message: 'Subtask berhasil dibuat!',
                        issueKey: result.key,
                        jiraUrl: jiraServer ? `${jiraServer}/browse/${result.key}` : null,
                    });
                    setReviewData(null);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            const resetAll = () => {
                setIsKeySet(false);
                setParentIssueKey('');
                setInputValue('');
                setError(null);
                setSuccess(null);
                setReviewData(null);
                setLastUserInput('');
            };

            const handleCreateAnother = () => {
                setSuccess(null);
                setError(null);
                setReviewData(null);
                setLastUserInput('');
            };

            return (
                <div className="subtask-generator">
                    <div className="header">
                        <h1>Jira Subtask Generator</h1>
                        <p>Generate dan buat subtask otomatis dengan AI</p>
                        {currentUser && (
                            <p style={{fontSize: '12px', color: '#999', marginTop: '8px'}}>
                                👤 Logged in as: <strong>{currentUser.displayName || currentUser.name}</strong>
                            </p>
                        )}
                    </div>

                    <div className="main-content">
                        {!isKeySet ? (
                            <div className="search-section">
                                <h2>Step 1: Set Parent Issue</h2>
                                <p style={{color: '#666', marginBottom: '15px', fontSize: '14px'}}>
                                    Paste link Jira atau ketik issue key untuk dijadikan parent subtask.
                                </p>
                                <div className="search-input-group">
                                    <input
                                        type="text"
                                        placeholder="Paste URL Jira, e.g. https://jira.beacukai.go.id/browse/PCC-1439"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                    />
                                    <button onClick={handleSetIssue} disabled={!inputValue}>
                                        Set Issue
                                    </button>
                                </div>
                                {error && <div className="error-message">{error}</div>}
                            </div>
                        ) : (
                            <>
                                <div className="issue-summary">
                                    <h2>Parent Issue: {parentIssueKey}</h2>
                                    {jiraServer && (
                                        <p className="issue-title">
                                            <a href={`${jiraServer}/browse/${parentIssueKey}`} target="_blank" rel="noopener noreferrer"
                                               style={{color: 'white', textDecoration: 'underline'}}>
                                                Open in Jira ↗
                                            </a>
                                        </p>
                                    )}
                                    <button className="change-issue-btn" onClick={resetAll}>
                                        Change Issue
                                    </button>
                                </div>

                                {!reviewData && !success && (
                                    <div className="form-section">
                                        <h2>Step 2: Deskripsikan Task</h2>
                                        <TaskInputForm
                                            onGenerate={handleGenerate}
                                            loading={generating}
                                        />
                                    </div>
                                )}

                                {reviewData && !success && (
                                    <div className="form-section" style={{animation: 'fadeIn 0.3s ease-out'}}>
                                        <h2>Step 3: Review & Create</h2>
                                        <ReviewForm
                                            formData={reviewData}
                                            onChange={setReviewData}
                                            onSubmit={handleCreate}
                                            onRegenerate={() => handleGenerate(lastUserInput)}
                                            loading={loading || generating}
                                        />
                                    </div>
                                )}

                                {error && <div className="error-message">{error}</div>}

                                {success && (
                                    <div className="success-message">
                                        <p style={{fontSize: '18px', marginBottom: '10px'}}>🎉 {success.message}</p>
                                        <p>Issue Key: <strong>{success.issueKey}</strong></p>
                                        {success.jiraUrl && (
                                            <p style={{marginTop: '8px'}}>
                                                <a href={success.jiraUrl} target="_blank" rel="noopener noreferrer"
                                                   style={{color: '#015f0e', fontWeight: 600}}>
                                                    View in Jira ↗
                                                </a>
                                            </p>
                                        )}
                                        <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                                            <button className="create-another-btn" onClick={handleCreateAnother}>
                                                + Buat Subtask Lagi (Parent Sama)
                                            </button>
                                            <button className="create-another-btn" onClick={resetAll}
                                                    style={{color: '#667eea'}}>
                                                🔄 Ganti Parent Issue
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            );
        }

        function App() {
            return (
                <div className="app-container">
                    <SubtaskGenerator />
                </div>
            );
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    