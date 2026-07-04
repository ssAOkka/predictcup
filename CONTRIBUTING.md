# Contributing to PredictCup

Thank you for your interest in contributing to PredictCup! We welcome contributions from everyone.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Make your changes
5. Write/update tests as needed
6. Commit with clear messages: `git commit -m 'feat: Add your feature'`
7. Push to your fork: `git push origin feature/your-feature`
8. Submit a Pull Request

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow ESLint configurations
- Format code with Prettier
- Use meaningful variable and function names
- Add comments for complex logic

### Commit Messages

Follow the Conventional Commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions/updates
- `chore`: Build process, dependencies, etc.

Example:
```
feat(auth): Add JWT refresh token rotation

- Implement refresh token rotation on each login
- Add token expiration validation
- Add tests for token rotation

Closes #123
```

### Testing

- Write unit tests for services and utilities
- Write integration tests for API endpoints
- Aim for >80% code coverage
- Run tests before submitting PR: `npm run test`

### Documentation

- Update README if adding new features
- Document complex functions
- Update API documentation
- Add comments for non-obvious code

## Pull Request Process

1. Update README.md with details of changes if applicable
2. Ensure all tests pass: `npm run test`
3. Ensure code is properly formatted: `npm run format`
4. Add/update tests as needed
5. Fill in the PR template completely
6. Request review from maintainers

## Code Review

PRs will be reviewed based on:
- Code quality and consistency
- Test coverage
- Documentation
- Performance implications
- Security considerations
- Architectural alignment

## Reporting Issues

- Use GitHub Issues for bug reports
- Include steps to reproduce
- Include expected vs actual behavior
- Include environment details
- Add relevant labels

## Architecture Decisions

When making architectural decisions:
- Follow Clean Architecture principles
- Maintain SOLID principles
- Keep services decoupled
- Use dependency injection
- Document major decisions

## Questions?

- Open a discussion on GitHub
- Check existing issues and PRs
- Review the documentation

Thank you for contributing!
