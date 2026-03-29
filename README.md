

# FlowAlgo: CPU Scheduling and Data Structure Visualizer


FlowAlgo is a comprehensive web application that provides interactive visualizations and simulations for CPU scheduling algorithms and data structures. Built with modern web technologies, it offers an intuitive interface for learning and understanding complex algorithms through visual representations.

## 🚀 Live Demo

Experience FlowAlgo live: **[https://cpu-scheduler-taupe.vercel.app/](https://cpu-scheduler-taupe.vercel.app/)**

_Note: The live demo uses a cloud database and may have authentication features enabled._

## 🌟 Features

### CPU Scheduling Simulator

- **Multiple Algorithms**: Support for First-Come-First-Served (FCFS), Shortest Job First (SJF), Priority Scheduling, Round Robin (RR), Multi-Level Queue (MLQ), and Multi-Level Feedback Queue (MLFQ)
- **Interactive Process Management**: Add, edit, and remove processes with customizable arrival times, burst times, and priorities
- **Real-time Visualization**: Gantt chart visualization with timeline and process execution details
- **Performance Metrics**: Calculate and display waiting time, turnaround time, and completion time for each process
- **Simulation Controls**: Play, pause, step-through, and reset simulation capabilities

### Data Structure Visualizer

- **Comprehensive Coverage**: Visualize Arrays, Linked Lists, Stacks, Queues, Trees, Heaps, Graphs, and Dynamic Programming concepts
- **Sorting Algorithms**: Interactive visualizations for Bubble Sort, Selection Sort, Quick Sort, and Merge Sort
- **Animation Controls**: Step-by-step execution with customizable speed and array sizes
- **Educational Insights**: Display time and space complexity for each algorithm

### User Authentication

- **Google OAuth Integration**: Secure login using Google accounts
- **Protected Routes**: Access control for simulation features
- **User Sessions**: JWT-based authentication with session management

### Modern UI/UX

- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark Theme**: Sleek zinc-based color scheme with animated backgrounds
- **Smooth Animations**: Framer Motion-powered transitions and interactions
- **Intuitive Navigation**: Easy switching between CPU scheduling and DSA visualization modes

## 🛠️ Tech Stack

### Frontend

- **React 19.2.0** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Framer Motion 12.34.0** - Animation library for React
- **D3.js 7.9.0** - Data visualization library
- **React Router DOM 7.13.0** - Declarative routing for React
- **Zustand 5.0.11** - Small, fast state management
- **Axios 1.13.5** - HTTP client for API requests
- **Lucide React** - Beautiful icon library

### Backend

- **Node.js** - JavaScript runtime
- **Express 5.2.1** - Web application framework
- **MongoDB 9.2.1** with Mongoose - NoSQL database and ODM
- **JWT 9.0.3** - JSON Web Tokens for authentication
- **bcryptjs 2.4.3** - Password hashing
- **Google Auth Library 10.5.0** - Google OAuth integration
- **CORS 2.8.6** - Cross-origin resource sharing

### Development Tools

- **ESLint** - Code linting
- **Vite Plugin React** - React integration for Vite
- **Nodemon** - Automatic server restart during development

## 🚀 Installation

### Prerequisites

- Node.js 18 or higher
- MongoDB database (local or cloud instance)
- Google OAuth credentials (for authentication)

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd flowAlgo
   ```

2. **Install client dependencies**

   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Install server dependencies**

   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Configuration**

   Create a `.env` file in the `server` directory with the following variables:

   ```env
   PORT=5000
   MONGO_URI=your_mongo_uri
   JWT_SECRET=your-jwt-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

5. **Start MongoDB**
   Ensure MongoDB is running on your system or update `MONGO_URI` for cloud database.

6. **Start the development servers**

   **Terminal 1 - Backend:**

   ```bash
   cd server
   npm start
   ```

   **Terminal 2 - Frontend:**

   ```bash
   cd client
   npm run dev
   ```

7. **Access the application**
   Open your browser and navigate to `http://localhost:5173` (Vite default port)

## 📖 Usage

### Getting Started

1. **Landing Page**: Choose between CPU Scheduling Simulator or Data Structure Visualizer
2. **Authentication**: Sign in with Google to access simulation features
3. **Navigation**: Use the intuitive interface to switch between different modules

### CPU Scheduling Simulator

1. **Add Processes**: Use the process input form to add processes with ID, arrival time, burst time, and priority
2. **Select Algorithm**: Choose from available scheduling algorithms
3. **Run Simulation**: Click play to visualize the scheduling process
4. **View Results**: Examine the Gantt chart and performance metrics

### Data Structure Visualizer

1. **Select Data Structure**: Choose from Arrays, Linked Lists, Stacks, Queues, Trees, Heaps, or Graphs
2. **Configure Parameters**: Set array size, input values, or graph configurations
3. **Run Algorithms**: Execute sorting or other operations with step-by-step visualization
4. **Control Animation**: Use play/pause and speed controls for detailed analysis

## 🔌 API Documentation

### Authentication Endpoints

- `POST /api/auth/google` - Google OAuth authentication
- `GET /api/auth/me` - Get current user information
- `POST /api/auth/logout` - Logout user

### CPU Scheduling Endpoints

- `POST /simulate` - Run CPU scheduling simulation
  - **Body**: `{ algorithm: string, processes: array }`
  - **Response**: `{ processes: array, timeline: array }`

### Health Check

- `GET /health` - Server health status

## 📁 Project Structure

```
flowAlgo/
├── client/                          # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── CPUScheduler/        # CPU scheduling components
│   │   │   ├── DSAVisualizer/       # Data structure visualizer
│   │   │   │   ├── modules/         # Individual DS modules
│   │   │   │   │   ├── Arrays/
│   │   │   │   │   ├── Sorting/
│   │   │   │   │   │   └── algorithms/  # Sorting implementations
│   │   │   │   │   └── ...
│   │   │   │   ├── store/           # Zustand state management
│   │   │   │   └── hooks/           # Custom React hooks
│   │   │   ├── AuthModal.jsx        # Authentication modal
│   │   │   ├── LandingPage.jsx      # Main landing page
│   │   │   └── ...
│   │   ├── context/                 # React context providers
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # App entry point
│   ├── package.json
│   └── vite.config.js
├── server/                          # Node.js backend
│   ├── algorithms/                  # CPU scheduling algorithms
│   │   ├── fcfs.js
│   │   ├── sjf.js
│   │   ├── priority.js
│   │   ├── rr.js
│   │   ├── mlq.js
│   │   └── mlfq.js
│   ├── controllers/                 # Route controllers
│   │   └── cpuController.js
│   ├── middleware/                  # Express middleware
│   │   └── auth.js
│   ├── models/                      # Mongoose models
│   │   ├── User.js
│   │   └── Process.js
│   ├── routes/                      # API routes
│   │   └── auth.js
│   ├── index.js                     # Server entry point
│   ├── loadEnv.js                   # Environment loader
│   └── package.json
└── README.md                        # This file
```

## 🤝 Contributing

We welcome contributions to FlowAlgo! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** and ensure they follow the existing code style
4. **Test your changes** thoroughly
5. **Commit your changes**: `git commit -m 'Add some feature'`
6. **Push to the branch**: `git push origin feature/your-feature-name`
7. **Open a Pull Request**

### Development Guidelines

- Follow ESLint configuration for code style
- Write clear, concise commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design for all new components


## 🙏 Acknowledgments

- Built with modern web technologies for educational purposes
- Inspired by the need for interactive algorithm visualization tools
- Special thanks to the open-source community for the amazing libraries used


**Happy Learning!** 🎓 Explore the fascinating world of algorithms and data structures with FlowAlgo.
