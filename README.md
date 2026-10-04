<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<br />

<div align="center">
  <h1 align="center">🌿 MannMitra</h1>
  <p align="center">
    <strong>A calm, modern, and interactive mental health & community platform.</strong>
    <br />
    <br />
    <a href="#features">Explore Features</a>
    ·
    <a href="#tech-stack">Tech Stack</a>
    ·
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

<hr />

## 📖 About The Project

**MannMitra** (Friend of the Mind) is a digital safe space designed to foster a supportive community and promote mental well-being. It provides users with a clean, distraction-free environment to share their thoughts, engage in community discussions, interact with an AI mental wellness coach, and play relaxing games. 

With privacy and user experience as a priority, the platform supports seamless authentication, real-time posts, and robust community interactions.

## ✨ Key Features

- **🔐 Secure Authentication:** Seamless Email/Password and Google OAuth login powered by Firebase.
- **💬 Community Hub:** A real-time feed where users can create posts, add attachments, and interact with the community.
- **❤️ Interactive Engagement:** Like, comment, and report features built to maintain a healthy community space.
- **🤖 AI Coach:** (Upcoming) An AI-powered mental wellness companion to help users navigate daily stress.
- **🎮 Relaxation Games:** (Upcoming) Mini-games specifically designed to reduce anxiety and promote calmness.
- **🌓 Dark/Light Mode:** A gorgeous, responsive UI that supports native theme toggling for eye comfort.

## 💻 Tech Stack

- **Frontend Framework:** [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS Modules
- **Backend & Database:** [Firebase Firestore](https://firebase.google.com/products/firestore) (NoSQL Database)
- **Authentication:** [Firebase Auth](https://firebase.google.com/products/auth)
- **File Storage:** [Firebase Storage](https://firebase.google.com/products/storage)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have **Node.js** installed on your system.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/your_username/MannMitra.git
   ```
2. **Navigate to the project directory**
   ```sh
   cd MannMitra
   ```
3. **Install NPM packages**
   ```sh
   npm install
   ```

### ⚙️ Environment Variables

For the app to function properly, you need to connect it to your Firebase project. Create a `.env` file in the root directory and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
*(Make sure to enable **Firestore**, **Storage**, and **Authentication (Email & Google)** in your Firebase console).*

### 🏃‍♂️ Run the App

Start the development server:
```sh
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the app!

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
<div align="center">
  Made with ❤️ for Mental Well-being.
</div>
