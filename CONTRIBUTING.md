# Contributing to Jira Subtask Generator

Terima kasih sudah tertarik untuk berkontribusi! Setiap kontribusi sangat berarti untuk proyek ini.

## Cara Berkontribusi

### 1. Fork Repository
```bash
# Klik tombol "Fork" di GitHub
git clone https://github.com/your-username/task-generator.git
cd task-generator
git remote add upstream https://github.com/VanandaR/task-generator.git
```

### 2. Buat Feature Branch
```bash
git checkout -b feature/your-feature-name
# atau untuk bug fixes:
git checkout -b bugfix/issue-description
```

### 3. Lakukan Perubahan
- Follow existing code style
- Keep commits atomic dan descriptive
- Update dokumentasi jika diperlukan
- Pastikan tidak ada secrets di commit

### 4. Push dan Create PR
```bash
git push origin feature/your-feature-name
```

Buka Pull Request dengan deskripsi yang jelas tentang:
- Apa yang diubah
- Mengapa perlu diubah
- Bagaimana cara testing

## Coding Standards

### JavaScript/React
```javascript
// Use meaningful variable names
const isValidEmail = email.includes('@');

// Keep functions small and focused
function validateForm(data) {
  const errors = {};
  if (!data.name) errors.name = 'Required';
  return errors;
}

// Add comments untuk logic yang kompleks
// Calculate optimal story point based on complexity
const storyPoint = calculateComplexity(task);
```

### CSS
```css
/* Use BEM naming convention */
.subtask-form { }
.subtask-form__input { }
.subtask-form__input--error { }

/* Mobile-first approach */
@media (min-width: 768px) {
  /* tablet and up */
}
```

### File Organization
```
src/
├── components/       # React components
├── services/        # API services
├── styles/          # Global styles
└── utils/           # Helper functions
```

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (no functional changes)
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Build, dependencies

### Contoh
```
feat(generator): add bulk subtask creation

- Add batch form input for multiple subtasks
- Implement progress indicator
- Handle partial failures gracefully

Closes #42
```

## Testing

Sebelum submit PR, test fitur Anda:

### Manual Testing
```bash
npm start
# Test semua scenario di aplikasi
```

### Checklist
- [ ] Form validation works correctly
- [ ] Error handling displays proper messages
- [ ] API calls succeed/fail as expected
- [ ] UI responsive di mobile & desktop
- [ ] Tidak ada console errors/warnings

## Documentation

Jika menambah fitur baru, update dokumentasi:

1. **README.md** - Tambah di features section
2. **GITHUB_DESCRIPTION.md** - Update deskripsi
3. **Code Comments** - Jelaskan logic kompleks
4. **ABOUT.md** - Update use cases jika perlu

## Security Guidelines

### ⚠️ Jangan commit:
- API keys, passwords, tokens
- Database credentials
- Private URLs atau endpoints
- Personal information

### ✅ Gunakan:
- Environment variables
- `.env.example` untuk templates
- GitHub Secrets untuk CI/CD

## Areas yang Perlu Kontribusi

### High Priority
- [ ] Backend API for secure key management
- [ ] User authentication system
- [ ] Unit & integration tests
- [ ] Error boundary components

### Medium Priority
- [ ] Custom field mapping
- [ ] Bulk operations support
- [ ] Dark mode implementation
- [ ] Analytics integration

### Low Priority
- [ ] Multi-language support (i18n)
- [ ] Documentation translations
- [ ] Performance optimizations
- [ ] UI/UX improvements

## Pull Request Process

1. **Buat PR dengan deskripsi lengkap**
   - Problem yang disolve
   - Solusi yang diterapkan
   - Testing yang dilakukan

2. **Tunggu review**
   - Maintainer akan review code
   - Respond terhadap feedback
   - Siap untuk revisions

3. **Merge**
   - PR di-merge ke main
   - Delete feature branch
   - Close related issues

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build untuk production
npm run build

# Run linting (jika ada)
npm run lint
```

## Questions?

- 💬 Open discussion di GitHub Discussions
- 🐛 Report bugs di GitHub Issues
- 📧 Email untuk hal sensitive

## Code of Conduct

- Respectful communication
- No harassment atau discrimination
- Constructive feedback
- Inclusive community

---

Terima kasih sudah berkontribusi! 🎉

Let's build something awesome together!
