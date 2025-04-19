# SkillSwap
![Skillswap0](https://github.com/user-attachments/assets/bb39bdef-b4f8-45fd-ad7b-a35ea2f2886e)

![SkillSwap Logo](./public/logo.png)![SkillSwap](https://github.com/user-attachments/assets/789c9bcb-476c-4613-80bb-2c8207d635f3)


## 📚 Overview

SkillSwap is a dynamic web application that connects people based on their skills and learning interests. The platform enables users to showcase expertise, discover complementary skills, and facilitate knowledge exchange in a user-friendly environment.

## ✨ Features

- **🔐 User Authentication**
  - Secure signup, login, and logout functionality
  - JWT-based authentication system

- **👤 Profile Management**
  - Create and customize detailed user profiles
  - Upload profile pictures
  - Manage personal information

- **🔄 Skill Exchange**
  - List skills you can teach others (with proficiency levels)
  - Specify skills you want to learn
  - Find users with complementary skill sets

- **📱 Responsive Design**
  - Fully responsive across devices
  - Mobile-friendly interface with adaptive navigation

- **📊 Dashboard**
  - Personal activity overview
  - Recent skill exchanges
  - Recommended connections

- **⚙️ User Settings**
  - Account preferences
  - Privacy controls
  - Notification settings

## 🛠️ Tech Stack

### Frontend
- **React.js** - Component-based UI library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Navigation and routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database

### Authentication
- **JWT** (JSON Web Tokens)

## 🚀 Installation

### Prerequisites

Ensure you have the following installed:
- Node.js (>=16.x)
- npm or yarn
- MongoDB (if running locally)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/aghdoube/skillswap-frontend.git
   cd skillswap-frontend 
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Create a `.env` file in the root directory
   - Add the following variables:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. **Start the frontend development server**
   ```bash
   npm run dev
   ```

5. **Set up the backend (assuming it's a separate service)**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

6. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
/skillswap-frontend
│
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx      # Navigation bar component
│   │   ├── Footer.jsx      # Footer component
│   │   └── ProfileCard.jsx # User profile card component
│   │
│   ├── pages/              # Page components
│   │   ├── Home.jsx        # Landing page
│   │   ├── Dashboard.jsx   # User dashboard
│   │   ├── UserProfile.jsx # Profile view page
│   │   ├── ProfileEdit.jsx # Profile editing page
│   │   ├── Settings.jsx    # User settings
│   │   ├── LoginForm.jsx   # Login page
│   │   └── SignupForm.jsx  # Registration page
│   │
│   ├── assets/             # Static assets (images, icons)
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API service functions
│   ├── utils/              # Utility functions
│   │
│   ├── App.jsx             # Main application component
│   └── main.jsx           # Application entry point
│
├── public/                 # Public assets
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # Project documentation
```

## 🔌 API Endpoints

| Method | Endpoint            | Description                     | Authentication Required |
|--------|--------------------|----------------------------------|------------------------|
| GET    | `/api/auth/profile` | Fetch user profile              | Yes                    |
| POST   | `/api/auth/signup`  | Register a new user             | No                     |
| POST   | `/api/auth/login`   | Authenticate user               | No                     |
| PUT    | `/api/auth/profile` | Update user profile             | Yes                    |
| GET    | `/api/users`        | Browse available skill teachers | Yes                    |
| POST   | `/api/messages`     | Send a message                  | Yes                    |
| GET    | `/api/messages`     | Get user messages               | Yes                    |

## 👥 Contributing

We welcome contributions to SkillSwap! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature-name`)
3. **Commit** your changes (`git commit -m 'feat: Add new feature'`)
4. **Push** to your branch (`git push origin feature-name`)
5. **Open** a pull request

Please ensure your code follows our style guidelines and includes appropriate tests.

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 📞 Contact



---

Built with ❤️ by the SkillSwap Team
