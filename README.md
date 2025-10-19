# 🎬 Movie Ticket Booking System

A modern full-stack application for booking movie tickets online, built with MERN stack (MongoDB, Express.js, React, Node.js).

## ✨ Features

- 🎥 Real-time movie data from TMDB API
- 🎟️ Interactive seat selection
- 💳 Secure payment integration
- 🔐 User authentication and authorization
- 📱 Responsive design for all devices
- 🎞️ Movie trailers integration
- 📅 Show scheduling and management
- 🎫 E-ticket generation
- 👤 User profile management
- 🔥 Real-time seat availability updates

## 🚀 Tech Stack

### Frontend

- React with Vite
- TailwindCSS for styling
- Redux Toolkit for state management
- React Router for navigation
- Lucide React for icons
- Axios for API requests

### Backend

- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- TMDB API integration
- Inngest for event handling

## 🛠️ Installation & Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd Ticketbooking
```

2. Install dependencies:

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables:

Create `.env` in server directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
TMDB_API_KEY=your_tmdb_api_key
JWT_SECRET=your_jwt_secret
```

Create `.env` in client directory:

```env
VITE_API_URL=http://localhost:5000
```

4. Start the application:

```bash
# Start backend server
cd server
npm run dev

# Start frontend application
cd ../client
npm run dev
```

## 📝 API Documentation

### Movies Endpoints

- `GET /api/movies/now-playing` - Get currently playing movies
- `GET /api/movies/:id` - Get movie details
- `GET /api/movies/:id/shows` - Get movie showtimes

### Shows Endpoints

- `POST /api/shows` - Create new show
- `GET /api/shows` - Get all shows
- `GET /api/shows/:id` - Get show details
- `PATCH /api/shows/:id/trailers` - Update movie trailers

### Bookings Endpoints

- `POST /api/bookings` - Create new booking
- `GET /api/bookings/user` - Get user bookings
- `GET /api/bookings/:id` - Get booking details

## 🎯 Future Enhancements

- [ ] Multiple payment gateway integration
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Social media sharing
- [ ] Reviews and ratings system
- [ ] Mobile app development

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
