# 📦 Stock Control Management

This is a **MERN stack** application with separate **Frontend** and **Backend** folders. The frontend is built using **React (with TypeScript)**, and the backend is powered by **Node.js**, **Express**, and **MongoDB**.

---

## 🗂️ Project Structure

```text
project-root/
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── dtos/
│   │   ├── handlers/         // Controllers
│   │   ├── invoices/
│   │   ├── middleware/
│   │   ├── models/          // Database Modals
│   │   ├── routes/          // All routing
│   │   └── utils/
│   └── index.js
│
├── Frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/      // Resuable Components
│   │   ├── layout/          // Protected , Common Layouts
│   │   ├── pages/           // All Pages
│   │   ├── services/        // All Services Calling Database
│   │   ├── store/           // state Management
│   │   ├── types/
│   │   └── app.tsx          // All Imports with Lazy Loading
│   │   └── main.tsx         // Starting Point


```

---

### Prerequisites

Check Version of Node.js and Npm package

- Node.js 20+ version
- npm 9+ version

```bash
node -v
npm -v
```

### Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd project-root

# Open in First Terminal
# Install Backend dependencies
cd Backend
npm install
npm run dev

# Open in Second Terminal
# Install Frontend dependencies
cd Frontend
npm install
npm run dev

```
