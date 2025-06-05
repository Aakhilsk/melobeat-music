# Melobeat Music Player 🎵

A modern, responsive music player web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features 🚀

- 🎧 Music playback with controls (play, pause, next, previous)
- 📱 Responsive design for all devices
- 👤 User authentication (login/register)
- 🎵 Create and manage playlists
- 🖼️ Profile image upload
- 👑 Admin panel for song management
- 🎨 Modern UI with animations
- 🔒 Protected routes
- 🎯 Progress bar with seek functionality
- 🔊 Volume control
- 🔄 Auto-play next song

## Tech Stack 💻

### Frontend
- React.js
- Redux Toolkit for state management
- Tailwind CSS for styling
- Framer Motion for animations
- Axios for API calls
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image storage
- Multer for file uploads

## Prerequisites 📋

- Node.js (v18.18.2 or higher)
- npm (v10.2.3 or higher)
- MongoDB
- Cloudinary account

## Installation 🛠️

1. Clone the repository:
   ```bash
   git clone https://github.com/Aakhilsk/melobeat-music.git
   cd melobeat-music
   ```

2. Install server dependencies:
   ```bash
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd client
   npm install
   ```

4. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment 🚀

The application is deployed using:
- Backend: Railway
- Frontend: Netlify
- Database: MongoDB Atlas
- Image Storage: Cloudinary

## Project Structure 📁

```
melobeat-music/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   └── src/               # React source files
│       ├── components/    # Reusable components
│       ├── pages/         # Page components
│       ├── redux/         # Redux store and slices
│       └── App.js         # Main App component
├── server/                # Backend Node.js application
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   └── server.js         # Main server file
├── .env                  # Environment variables
├── package.json          # Project dependencies
└── README.md            # Project documentation
```

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📝

This project is licensed under the ISC License.

## Author 👤

**Aakhilsk**
- GitHub: [@Aakhilsk](https://github.com/Aakhilsk)

## Acknowledgments 🙏

- Icons by [Remix Icon](https://remixicon.com/)
- UI Design inspired by modern music streaming platforms 