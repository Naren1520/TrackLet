# TrackLet - Personal Account & Credit Usage Tracker

A sleek, Excel-style monthly credit tracker built for single-user management of Gmail and GitHub account pairs across all 12 months.

---

## Support and Open Source Community

If you find TrackLet useful:
- **Star this repository** to show your support and help others discover it.
- **Fork it** to create your own customized version.
- **Clone and Self-Host** freely for your personal or team workflow.
- **Contribute** - Pull Requests, bug reports, and feature proposals are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## Features

- **Excel-Style Spreadsheet Grid**: 12-month calendar (Jan-Dec) with dual sub-columns (`Gmail` and `GitHub`) for 24 distinct monthly credit slots per account pair.
- **Sticky Column Layout**: Sticky email column on the left with horizontal and vertical scrolling optimized for widescreen and compact views.
- **Instant MongoDB Atlas Persistence**: Optimistic toggles that save directly to MongoDB Atlas with compound unique indexing.
- **Yearly Tracking**: Switch between years (2024, 2025, 2026, 2027, etc.) with independent monthly usage records.
- **Analytics Dashboard**: 4 real-time Recharts visualizations:
  - Monthly Usage Distribution (Stacked Bar Chart)
  - Annual Capacity Donut
  - Account Completion Rankings
  - Full Cross-Reference Monthly Matrix
- **Clean Restrained Aesthetics**: High-contrast canvas, solid elevated white cards, Inter typography, and zero neon/gradients.
- **Production Ready**: Full-stack Next.js 16 with Route Handlers, Zod validation, `jose` session cookies, and Netlify/Vercel support.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB Atlas (Official `mongodb` driver)
- **Styling**: Tailwind CSS v4 and Inter Typography
- **Charts**: Recharts
- **Icons**: Lucide React
- **Authentication**: `jose` encrypted JWT session cookies and `bcryptjs` password verification

---

## Getting Started

### 1. Prerequisites
- Node.js 20+ installed
- `pnpm` package manager (`npm install -g pnpm`)
- Free MongoDB Atlas cluster or local MongoDB instance

### 2. Installation
```bash
git clone https://github.com/Naren1520/TrackLet.git
cd TrackLet
pnpm install
```

### 3. Environment Configuration
Copy the template to create your `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your database connection and credentials in `.env.local`:
```env
APP_USERNAME="admin"
APP_PASSWORD_HASH="\$2a\$10\$..."
SESSION_SECRET="your-secure-random-session-secret-at-least-32-chars-long"
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority"
MONGODB_DB_NAME="tracklet"
```

> Note: To generate a bcrypt hash for your password:
> ```bash
> node -e "console.log(require('bcryptjs').hashSync('YourPassword', 10))"
> ```

### 4. Run Locally
```bash
pnpm run dev
```
Open http://localhost:3000 in your browser.

---

## Deploying to Netlify

TrackLet includes pre-configured [`netlify.toml`](netlify.toml) and [`.gitignore`](.gitignore) files:

1. Push your fork to GitHub.
2. In [Netlify Dashboard](https://app.netlify.com/), click **Add new site** -> **Import an existing project**.
3. Choose your GitHub repository. Netlify will auto-detect Next.js runtime.
4. Add your 5 environment variables under **Site configuration** -> **Environment variables**:
   - `APP_USERNAME`
   - `APP_PASSWORD_HASH`
   - `SESSION_SECRET`
   - `MONGODB_URI`
   - `MONGODB_DB_NAME`
5. Click **Deploy site**.

---

## Contributing

We welcome community contributions. Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/YourFeature`)
3. Commit your Changes (`git commit -m 'feat: add feature'`)
4. Push to the Branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## Security

For security vulnerability disclosure, please review [SECURITY.md](SECURITY.md). Never commit real credentials or database connection strings to public repositories.

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## Author

Developed by **Naren**.
For questions or feedback, feel free to open an issue or pull request.
