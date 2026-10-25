# Contributing to TrackLet

Thank you for your interest in contributing to TrackLet.

TrackLet is an open-source personal account and credit usage tracker designed to be clean, fast, and accessible. Whether you are fixing a bug, proposing a new feature, improving documentation, or optimizing performance, all contributions are welcome.

---

## Support the Project

If you find TrackLet helpful or want to support its ongoing development, please consider starring the repository on GitHub.

Starring the repository helps increase its visibility, encourages more developers to contribute, and lets us know that TrackLet is useful to you.

---

## Free to Fork, Clone, and Use

TrackLet is licensed under the [MIT License](LICENSE). You are free to:
- Fork the repository and customize it for your personal workflows.
- Clone it locally and self-host on platforms like Netlify, Vercel, or custom servers.
- Submit Pull Requests to improve the project for everyone.

---

## Getting Started

### 1. Fork and Clone
1. Fork the repository to your own GitHub account on GitHub: https://github.com/Naren1520/TrackLet
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/TrackLet.git
   cd TrackLet
   ```

### 2. Install Dependencies
Ensure you have Node.js 22+ and `pnpm` installed:
```bash
pnpm install
```

### 3. Environment Configuration
Create your local environment file:
```bash
cp .env.example .env.local
```
Update `.env.local` with your MongoDB connection string and credentials.
> Note: Never commit `.env.local` to git.

### 4. Run Development Server
```bash
pnpm run dev
```
Open http://localhost:3000 to view the application.

---

## Contribution Workflow

1. **Create a Branch**:
   Create a descriptive branch name from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Make Your Changes**:
   - Write clean, readable, and typed code (TypeScript strict mode).
   - Follow the existing design aesthetics: high-density tabular Inter typography, minimal clean borders, and restrained styling.
   - Respect project conventions (App Router, Route Handlers, Zod schema validation).

3. **Verify Code Quality**:
   Before submitting your PR, ensure the build and type checking pass:
   ```bash
   # Type check
   pnpm exec tsc --noEmit

   # Production build test
   pnpm run build
   ```

4. **Commit Your Changes**:
   Write clear, concise commit messages:
   ```bash
   git commit -m "feat: add export feature for spreadsheet"
   ```

5. **Push and Open a Pull Request**:
   Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
   Then open a Pull Request on GitHub against the `main` branch. Provide a brief explanation of what was changed and screenshots if UI changes were made.

---

## Ideas for Contributions

Looking for inspiration? Here are some areas where community contributions are appreciated:
- Export dashboard spreadsheet to CSV or Excel (.xlsx) format.
- Keyboard shortcuts for rapid cell navigation in the spreadsheet grid.
- Multi-year comparative trends and analytics.
- Webhook or notification integration when monthly credits are close to expiring.
- Additional localized language support.

---

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
