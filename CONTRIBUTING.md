# Contributing to FlowPay

Thank you for your interest in contributing to FlowPay! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Aptos CLI installed
- Git for version control
- Basic knowledge of TypeScript, React, and Move

### Development Setup

1. **Fork and clone the repository:**
```bash
git clone https://github.com/yourusername/flowpay.git
cd flowpay
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment:**
```bash
cp .env.example .env.local
# Update .env.local with your configuration
```

4. **Start development server:**
```bash
npm run dev
```

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages
Follow the conventional commit format:
```
type(scope): description

feat(payments): add multi-currency support
fix(wallet): resolve balance display issue
docs(readme): update installation instructions
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run type checking
npm run type-check

# Run linting
npm run lint
```

### Writing Tests
- Write unit tests for utility functions
- Add integration tests for API endpoints
- Test React components with user interactions
- Ensure Move contracts have comprehensive tests

## 📝 Pull Request Process

1. **Create a feature branch:**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes:**
- Write clean, well-documented code
- Add tests for new functionality
- Update documentation as needed

3. **Test your changes:**
```bash
npm run lint
npm run type-check
npm test
npm run build
```

4. **Commit and push:**
```bash
git add .
git commit -m "feat(scope): description"
git push origin feature/your-feature-name
```

5. **Create a Pull Request:**
- Use a clear, descriptive title
- Provide detailed description of changes
- Link related issues
- Add screenshots for UI changes

## 🏗️ Project Structure

```
flowpay/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   ├── lib/                 # Utility functions
│   ├── contexts/            # React contexts
│   └── types/               # TypeScript type definitions
├── sources/                 # Move smart contracts
├── scripts/                 # Deployment and utility scripts
├── public/                  # Static assets
└── docs/                    # Documentation
```

## 🔧 Smart Contract Development

### Move Guidelines
- Follow Move best practices and conventions
- Use proper error handling with meaningful error codes
- Add comprehensive documentation
- Write thorough tests for all functions
- Consider gas optimization

### Testing Contracts
```bash
# Compile contracts
aptos move compile --named-addresses flowpay=default

# Run contract tests
aptos move test --named-addresses flowpay=default

# Deploy to testnet
aptos move publish --named-addresses flowpay=default
```

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, Node.js version)
- Screenshots or error messages
- Relevant code snippets

## 💡 Feature Requests

For feature requests, please provide:
- Clear description of the feature
- Use case and business value
- Proposed implementation approach
- Any relevant mockups or designs

## 📚 Documentation

### Writing Documentation
- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Keep documentation up to date with code changes

### Documentation Types
- API documentation in code comments
- User guides in `/docs` folder
- README updates for new features
- Inline code comments for complex logic

## 🔒 Security

### Security Guidelines
- Never commit sensitive information (private keys, API keys)
- Follow secure coding practices
- Report security vulnerabilities privately
- Use environment variables for configuration

### Reporting Security Issues
Please report security vulnerabilities to: security@flowpay.finance

## 🎯 Areas for Contribution

### High Priority
- Smart contract optimizations
- Frontend performance improvements
- Additional payment methods
- Mobile responsiveness
- Accessibility improvements

### Medium Priority
- Additional language support
- Enhanced analytics
- Integration with more wallets
- Advanced treasury features

### Documentation
- API documentation
- User guides
- Video tutorials
- Code examples

## 🏆 Recognition

Contributors will be recognized in:
- README contributors section
- Release notes
- Community highlights
- Potential token rewards (future)

## 📞 Getting Help

- **Discord**: [FlowPay Community](https://discord.gg/flowpay)
- **GitHub Issues**: For bugs and feature requests
- **Email**: dev@flowpay.finance
- **Twitter**: [@FlowPayFinance](https://twitter.com/FlowPayFinance)

## 📄 License

By contributing to FlowPay, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to FlowPay! Together, we're building the future of global payments. 🚀