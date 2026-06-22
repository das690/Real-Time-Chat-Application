```markdown
# 💬 Real-Time MERN Chat Application

!(https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
!(https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
!(https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
!(https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
!(https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A full-stack, real-time messaging application built with the MERN stack. Featuring a sleek, modern Glassmorphism UI, this app supports live one-on-one conversations, dynamic group chats, and secure image sharing.

**[🚀 FRONTEND LIVE ]([INSERT_YOUR_LIVE_NETLIFY_LINK_HERE])**

**[🚀 BACKEND LIVE ]([INSERT_YOUR_LIVE_NETLIFY_LINK_HERE])**

*Note: The backend is hosted on a free Render tier. It may take 30-50 seconds to wake up upon initial load. Guest credentials are provided on the login screen for quick access.*

---

## ✨ Key Features

- **Real-Time Communication:** Instant messaging with typing indicators and live notifications powered by Socket.io.
- **Secure Authentication:** JWT-based user login and registration with encrypted passwords.
- **Group Chats:** Create groups, add/remove users, and update group names (Admin controls enforced).
- **Media Uploads:** Users can upload custom profile pictures and send images in chats, processed and hosted securely via Cloudinary.
- **Modern UI/UX:** Fully responsive design utilizing a frosted glass aesthetic (Glassmorphism) with fluid animations.
- **Search Functionality:** Quickly find and start chats with registered users.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- React Router DOM
- Axios
- Tailwind CSS (Glassmorphism UI)

**Backend:**
- Node.js & Express.js
- MongoDB Atlas (Mongoose)
- Socket.io (WebSockets)
- JSON Web Tokens (JWT) & Bcrypt

**Deployment & Services:**
- Frontend: Netlify
- Backend: Render
- Media Storage: Cloudinary

---

## 🚀 Run Locally

### 1. Clone the repository
```bash
git clone [INSERT_YOUR_GITHUB_REPO_LINK_HERE]
cd [INSERT_YOUR_REPO_NAME_HERE]

```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
npm install

```

Create a `.env` file in the backend root directory with the following variables:

```env
PORT=5000
MONGO_URI=[INSERT_YOUR_MONGODB_URI_HERE]
JWT_SECRET=[INSERT_YOUR_JWT_SECRET_HERE]

```

Start the backend server:

```bash
npm start

```

### 3. Frontend Setup

Open a new terminal window and navigate to the frontend folder:

```bash
cd frontend
npm install

```

Create a `.env` file inside the `frontend` folder with the following variables:

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=[INSERT_YOUR_CLOUDINARY_CLOUD_NAME_HERE]
VITE_CLOUDINARY_UPLOAD_PRESET=[INSERT_YOUR_CLOUDINARY_UNSIGNED_PRESET_HERE]

```

Start the frontend development server:

```bash
npm run dev

```

---

## 👨‍💻 Author

**[INSERT_YOUR_NAME_HERE]**

* GitHub: [[INSERT_YOUR_GITHUB_PROFILE_LINK_HERE]]
* LinkedIn: [[INSERT_YOUR_LINKEDIN_PROFILE_LINK_HERE]]

```

```