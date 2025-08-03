# Contributing to OpenAuditLabs Web Dashboard

Welcome to the OpenAuditLabs Web Dashboard project! We're excited to have you contribute to this open-source audit data visualization platform. This document provides guidelines for contributing to our Next.js-based dashboard application.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Contributing Guidelines](#contributing-guidelines)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Issue Reporting](#issue-reporting)
- [Community and Support](#community-and-support)

## Code of Conduct

Please review and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.18 or later)
- **pnpm** (comes with Node.js) or **yarn**
- **Git** for version control
- A modern code editor (VS Code recommended)

### Development Environment

1. **Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub to create your own copy
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/web.git
   cd web
   ```

3. **Set Up Remote**
   ```bash
   git remote add upstream https://github.com/OpenAuditLabs/web.git
   ```

4. **Install Dependencies**
   ```bash
   pnpm install
   # or
   yarn install
   ```

5. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration values
   ```

6. **Start Development Server**
   ```bash
   pnpm run dev
   # or
   yarn dev
   ```

   The dashboard will be available at `http://localhost:3000`

## Project Structure

```
web/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Reusable React components
│   │   ├── ui/             # Basic UI components
│   │   ├── charts/         # Chart and visualization components
│   │   └── dashboard/      # Dashboard-specific components
│   ├── lib/                # Utility functions and configurations
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Global styles and Tailwind config
├── public/                 # Static assets
├── docs/                   # Documentation files
└── tests/                  # Test files
```

## Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- **Bug fixes** - Help us resolve issues in the dashboard
- **Feature enhancements** - Add new functionality to improve user experience
- **Documentation** - Improve our guides, API docs, and code comments
- **Performance optimizations** - Make the dashboard faster and more efficient
- **Accessibility improvements** - Ensure the dashboard is accessible to all users
- **Testing** - Add or improve test coverage
- **Design improvements** - Enhance the user interface and user experience

### Before You Start

1. **Check existing issues** - Browse our [GitHub issues](https://github.com/OpenAuditLabs/web/issues) to avoid duplicate work
2. **Create an issue** - For new features or significant changes, create an issue first to discuss the approach
3. **Look for good first issues** - New contributors should look for issues labeled `good first issue`

### Development Workflow

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Changes**
   - Write clean, readable code
   - Follow our code style guidelines
   - Include appropriate tests
   - Update documentation if needed

3. **Test Your Changes**
   ```bash
   # Run the development server
   pnpm run dev
   
   # Run tests
   pnpm test
   
   # Run linting
   pnpm run lint
   
   # Run type checking
   pnpm run type-check
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new dashboard widget component"
   ```

## Code Style Guidelines

### JavaScript/TypeScript

We follow industry-standard practices for clean, maintainable code:

- **Use TypeScript** for type safety
- **Function naming**: Use camelCase (`getUserData`)
- **Component naming**: Use PascalCase (`DashboardWidget`)
- **File naming**: Use kebab-case (`user-dashboard.tsx`)
- **Indentation**: Use 2 spaces
- **Quotes**: Use single quotes for strings
- **Semicolons**: Always use semicolons

### React Components

```typescript
// Good component structure
interface DashboardWidgetProps {
  title: string;
  data: ChartData;
  isLoading?: boolean;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  data,
  isLoading = false,
}) => {
  // Component logic here
  return (
    <div className="dashboard-widget">
      <h3>{title}</h3>
      {isLoading ? <LoadingSpinner /> : <Chart data={data} />}
    </div>
  );
};
```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat: add new user authentication system`
- `fix: resolve dashboard loading issue`
- `docs: update API documentation`
- `style: format code according to style guide`
- `refactor: restructure dashboard component hierarchy`
- `test: add unit tests for chart components`
- `chore: update dependencies`

### CSS/Styling

We use Tailwind CSS for styling:

- **Prefer utility classes** over custom CSS
- **Use semantic class names** when custom CSS is needed
- **Responsive design** - ensure mobile compatibility
- **Dark mode support** - consider both light and dark themes

## Testing

### Testing Framework

We use the following testing tools:

- **Jest** - JavaScript testing framework
- **React Testing Library** - Testing utilities for React components
- **Cypress** - End-to-end testing (when applicable)

### Writing Tests

1. **Unit Tests** - Test individual components and functions
   ```typescript
   // components/__tests__/DashboardWidget.test.tsx
   import { render, screen } from '@testing-library/react';
   import { DashboardWidget } from '../DashboardWidget';
   
   describe('DashboardWidget', () => {
     it('renders widget title correctly', () => {
       render(<DashboardWidget title="Test Widget" data={mockData} />);
       expect(screen.getByText('Test Widget')).toBeInTheDocument();
     });
   });
   ```

2. **Integration Tests** - Test component interactions
3. **Test Coverage** - Aim for at least 80% test coverage

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:coverage
```

## Submitting Changes

### Pull Request Process

1. **Update your branch** with the latest changes from upstream
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Push your changes**
   ```bash
   git push origin your-branch
   ```

3. **Create a Pull Request**
   - Use a clear, descriptive title
   - Include a detailed description of changes
   - Reference any related issues (`Fixes #123`)
   - Include screenshots for UI changes
   - Ensure all checks pass

### Pull Request Template

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Include screenshots of UI changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Process

1. **Automated checks** must pass (linting, tests, type checking)
2. **Code review** by at least one maintainer
3. **Testing** on different devices/browsers if UI changes
4. **Documentation** review if applicable

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

- **Clear title** and description
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Environment details** (browser, OS, Node.js version)
- **Screenshots** or error messages
- **Additional context** that might be helpful

### Feature Requests

For new features, please provide:

- **Clear description** of the proposed feature
- **Use case** - why is this feature needed?
- **Acceptance criteria** - what defines success?
- **Mockups or wireframes** if applicable

### Issue Labels

We use labels to organize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or improvement
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `documentation` - Improvements to docs
- `question` - Further information requested

## Community and Support

### Communication Channels

- **GitHub Issues** - Primary discussion platform
- **GitHub Discussions** - Community conversations
- **Email** - Contact maintainers at support@openauditlabs.org

### Getting Help

- **Documentation** - Check our [README](README.md) and docs
- **Existing Issues** - Search for similar problems
- **Community** - Ask questions in GitHub Discussions
- **Maintainers** - Reach out if you need guidance

### Recognition

We appreciate all contributions! Contributors will be:

- **Acknowledged** in release notes
- **Listed** in our contributors section
- **Invited** to join our community calls (when applicable)

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Conventional Commits](https://www.conventionalcommits.org/)

## License

By contributing to OpenAuditLabs Web Dashboard, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to OpenAuditLabs! Your efforts help make audit data more accessible and actionable for everyone. 🚀

For questions about this contributing guide, please [open an issue](https://github.com/OpenAuditLabs/web/issues/new) or contact the maintainers.
