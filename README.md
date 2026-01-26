# ProConnect – Social Networking Platform

ProConnect is a full-stack social media web application , built completely from scratch. The platform allows users to create profiles, connect with other users, and interact through a secure and scalable system.
this app allows you to post with images and let others comment on your post  

## 🚀 Features

- User authentication (Signup/Login) built **from scratch**
- Secure password hashing using **bcrypt**
- User profile creation and management
- Connection request system (send, accept, reject)
- Protected routes and API access
- File uploads using **Multer**
- PDF generation for user-related data
- Responsive UI with dashboard-style layout

## 🛠 Tech Stack

### Frontend
- Next.js
- React
- Redux Toolkit
- Bootstrap
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- MVC Architecture

### Security & Utilities
- Custom Authentication Logic
- bcrypt (password hashing)
- dotenv (environment variables)
- CORS
- Multer (file uploads)
- PDFKit (PDF generation)

## 📂 Project Structure

```

backend/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
└── server.js

frontend/
├── pages/
├── components/
├── redux/
├── services/
└── styles/

````

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/satyamkumar052/Social_Media.git
````

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file and add:

```
MONGOURL=your_mongodb_connection_string
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 📌 Learning Outcomes

* Building authentication systems without third-party frameworks
* Implementing MVC architecture in real-world applications
* Designing RESTful APIs and secure backend services
* Managing global state with Redux
* Integrating frontend and backend efficiently
* Handling file uploads and PDF generation
