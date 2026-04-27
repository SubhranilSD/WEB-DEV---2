# ✦ Memoria — Memory Timeline App

A full-stack MERN application for documenting life events on a beautiful, visual timeline.

## Tech Stack
- **Frontend**: React (Vite), CSS (Glassmorphism), Framer Motion, @hello-pangea/dnd
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Auth**: JWT + bcryptjs
- **Media**: Cloudinary (configurable) or base64 demo mode

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas URI)
- (Optional) Cloudinary account for image hosting

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/memory-timeline
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:5173

# Optional: Cloudinary for production image hosting
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend:
```bash
npm run dev    # development (nodemon)
npm start      # production
```

Backend runs on: http://localhost:5000

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

The Vite dev server proxies `/api` requests to `http://localhost:5000`.

---

## Features

### ✦ Authentication
- Register/Login with JWT
- Secure password hashing with bcryptjs
- Persistent sessions via localStorage

### ✦ Timeline Views
- **Timeline View**: Alternating left/right cards on a vertical timeline with animated dots
- **Grid View**: Masonry-style card grid

### ✦ Memory Events
- Title, description, date, location
- 8 mood types with emoji indicators
- Custom card color
- Tags (comma-separated)
- Photo upload (drag & drop)
- Private toggle

### ✦ Drag & Drop Reorder
- Toggle "Edit Mode" in the sidebar
- Drag cards to reorder your timeline
- Order synced to the database

### ✦ Filtering & Sorting
- Filter by mood (emoji buttons)
- Filter by tag
- Sort by date, custom order, or recently added
- Toggle ascending/descending

### ✦ Story Mode
- Cinematic auto-play through all memories
- Auto-advancing slides with progress bars
- Play/pause control
- Thumbnail strip for quick navigation
- Blurred background image from each event

### ✦ Light & Dark Mode
- Full light and dark theme support
- Glassmorphism cards adapt to both themes
- Preference saved to localStorage

---

## Project Structure

```
memory-timeline/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   └── upload.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx / .css
    │   │   ├── TimelineView.jsx / .css
    │   │   ├── EventCard.jsx / .css
    │   │   ├── EventModal.jsx / .css
    │   │   ├── StoryMode.jsx / .css
    │   │   └── Toast.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── pages/
    │   │   ├── LandingPage.jsx / .css
    │   │   ├── AuthPage.jsx / .css
    │   │   └── TimelinePage.jsx / .css
    │   ├── styles/
    │   │   └── globals.css
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/me | Update profile |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/events | Get all user events |
| POST | /api/events | Create event |
| GET | /api/events/:id | Get single event |
| PUT | /api/events/:id | Update event |
| DELETE | /api/events/:id | Delete event |
| PUT | /api/events/reorder/bulk | Bulk reorder |

### Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/upload | Upload media |

---

## Production Deployment

### Backend (e.g. Railway, Render)
1. Set environment variables
2. `npm start`

### Frontend (e.g. Vercel, Netlify)
1. `npm run build`
2. Deploy the `dist/` folder
3. Set API base URL if not using proxy

### Production API URL
In `frontend/src/utils/api.js`, change:
```js
baseURL: '/api'  →  baseURL: 'https://your-backend.railway.app/api'
```

---

## Cloudinary Setup (Production)

In `backend/routes/upload.js`, uncomment the Cloudinary section:
```js
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

---

## Design System

- **Fonts**: Playfair Display (display/headings) + DM Sans (body)
- **Theme**: Warm cream/amber tones (light) · Deep charcoal/amber (dark)
- **Effects**: Glassmorphism cards, ambient orbs, smooth animations
- **Colors**: Gold `#c4813a`, Rose `#c46080`, Indigo `#5b72c4`, Sage `#6b8f71`
