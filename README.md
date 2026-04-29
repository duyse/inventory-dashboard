# 📦 Inventory Dashboard

A modern, fast React + TypeScript inventory dashboard. It uses a mock backend for development and testing, allowing for a seamless frontend development experience.

## 🛠️ Tech Stack
* **Framework:** React + Vite
* **Language:** TypeScript (Strict Mode)
* **Data Fetching & State:** TanStack Query
* **Styling:** Tailwind CSS
* **Testing:** Jest + `ts-jest`
* **API Mocking:** Express (Backend) + MSW (Browser)

---

## 🚀 Getting Started

### Prerequisites
* Node.js 20 or higher
* A modern web browser

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
Start the app with hot-module reloading. API requests will be automatically intercepted and mocked by MSW.
```bash
npm run dev
```
*Vite will provide a local URL (usually `http://localhost:5174`). Open it in your browser.*

### 3. Build for Production
Type-check the project and generate a production-ready build in the `dist/` folder:
```bash
npm run build
```
To preview this production build locally:
```bash
npm run build && npm run preview
```

### 4. Run Tests & Linting
We use Jest for testing the API client, mock server, and utilities.
```bash
# Run all tests
npm test

# Run a specific test file
npm test -- tests/api.test.ts

# Run the linter
npm run lint
```

---

## 📁 Project Structure

* **`src/App.tsx`** – The root React component.
* **`src/components/`** – UI components.
* **`src/api.ts`** – Strongly-typed API client.
* **`src/server.ts`** – Express mock backend.
* **`src/mocks/`** – MSW handlers for intercepting browser requests.
* **`tests/`** – Jest test suites.
* **`system-design.md`** – Notes on the system architecture.
* **`build.md`** – Notes on the build process and data models.

---

## 🤖 AI Collaboration Methodology

This project was built in close collaboration with Gemini 3.1 Pro. To ensure the final codebase remained high-quality and production-ready, I treated the AI as a fast but literal assistant, requiring strict human oversight. 

Here is how I managed the workflow:

### 1. Guiding the AI
* **Design first, code second:** I had the AI map out our data models, components, and API routes in a `build.md` file before writing any actual code. Having a clear plan upfront meant we didn't have to guess how things fit together later.
* **Build one feature at a time:** I made the AI build complete features from start to finish-handling the database mock, the UI component, and the tests all at once. This kept the code updates small and easy to review.
* **Set clear rules early:** Every prompt included strict requirements (like sticking to strict TypeScript, avoiding `any` types, and using Tailwind). Setting these boundaries upfront stopped the AI from going off track.
* **Show, don't tell:** Instead of just explaining what I wanted, I fed the AI existing code snippets. It follows real examples way better than vague instructions.

### 2. Verifying the Output
I never blindly trusted the AI-generated code. My review process was:
* **Read every line:** I looked at all the code changes, not just the summaries, to catch any weird or random edits.
* **Test how it actually works:** I ran builds and tests after every single update. Because code can compile fine but still break in practice, I also manually clicked around the app to check edge cases like loading screens and error states.
* **Keep it simple:** If the AI added unnecessary features or made the code overly complicated, I rejected it and asked for the most straightforward fix.
* **Fresh eyes for AI reviews:** For tricky logic (like sorting or filtering), I opened a brand-new chat without the previous context and asked the AI to review its own work. This helped spot mistakes it had confidently made in the original chat.

### 3. Enforcing Quality
* **Strict typing:** The API types are locked down in `src/types.ts` and shared across the whole app. If the front-end and back-end don't match up, the app simply won't build.
* **Focused testing:** I only wrote tests for the parts most likely to break (like API clients, server routes, and utility functions) instead of wasting time on easily breakable UI tests.
* **No useless code:** I deleted any "just in case" code the AI threw in, like unused variables or comments explaining *what* the code was doing. We only kept comments if they explained *why* a specific technical choice was made.