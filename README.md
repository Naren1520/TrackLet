# TrackLet — Personal Account Usage Tracker

A personal tool to record your Gmail and GitHub account pairs, track which months you've used each account throughout the year, and monitor completed vs. pending usage.

---

## What is This?

- **Account Groups**: Keeps track of each Gmail address paired with its corresponding GitHub username.
- **Monthly Usage Checklist**: 12-month grid (Jan–Dec) where you click to toggle an account as **Used** or **Pending** for each month.
- **Yearly Tracking**: Track usage per year (e.g. 2024, 2025, 2026, 2027) with independent records.
- **Summary Strip & Analytics**: Instant counts of total accounts, completed months, pending months, completion rate %, plus 4 real charts (monthly distribution, capacity donut, completion ranking, and full 12-month matrix).
- **Single-User Access**: Protected by login session with your credentials.

--

---

## How to Run

### 1. Configure Database in `.env.local`
Open `.env.local` in your root folder and paste your MongoDB Atlas connection string into `MONGODB_URI`:

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Start Development Server
```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port 3000 is occupied).

---

## How to Test It

1. **Log In**:
   - Go to [http://localhost:3001/login](http://localhost:3001/login).
   - Enter the credentials configured in your `.env.local`.
   - Test the eye toggle to show/hide the password, then click **Sign In**.

2. **Add an Account Group**:
   - On the Dashboard, click **Add Account**.
   - Enter Gmail (e.g., `developer@gmail.com`), GitHub username (e.g., `naren-dev`), and an optional display name.
   - Click **Create Account Group**.

3. **Toggle Monthly Usage**:
   - In your account's card, click on any month button (e.g., `Jan`, `Feb`, `Mar`).
   - The button instantly turns green with a checkmark (**Used**), and the completion rate updates.
   - Click it again to toggle back to **Pending**.

4. **Switch Tracking Years**:
   - Use the year dropdown at the top right to switch between `2024`, `2025`, `2026`, `2027`, etc.
   - Each year maintains its own independent checklist records.

5. **View Analytics**:
   - Click **Analytics** in the top navigation bar ([http://localhost:3001/analytics](http://localhost:3001/analytics)).
   - See the 4 real data-driven views:
     - Monthly Usage Distribution (stacked bar chart)
     - Overall Capacity Donut
     - Account Completion Ranking table
     - Monthly Account Matrix (cross-reference table)

6. **Manage Accounts**:
   - Click **Accounts** in the top navigation ([http://localhost:3001/accounts](http://localhost:3001/accounts)).
   - Search accounts by Gmail or GitHub username, edit details, or delete an account group with confirmation.

7. **Verify Production Build**:
   ```bash
   pnpm run build
   ```
   Builds the production bundle with Next.js Turbopack and verifies TypeScript strict types.
