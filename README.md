# Airbnb Clone with Firebase Authentication

This project is an Airbnb clone built with React, Material-UI, and Firebase for authentication.

## Features

- Modern UI design inspired by Airbnb
- Firebase authentication (email/password, Google, Facebook)
- Property listings and details
- Booking system
- Wishlist functionality
- User profiles
- Host property listing

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- Firebase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

### Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Add a web app to your project
4. Enable Authentication in the Firebase console:

   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google (configure if needed)
   - Enable Facebook (requires Facebook Developer account setup)

5. Copy your Firebase configuration:

   - Go to Project Settings > General > Your Apps > Firebase SDK snippet
   - Select "Config"
   - Copy the configuration object

6. Update the Firebase configuration in `src/firebase/config.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
     measurementId: "YOUR_MEASUREMENT_ID",
   };
   ```

### Running the Application

Start the development server:

```
npm run dev
```

The application will be available at http://localhost:5173

## Authentication Flow

The application uses Firebase Authentication for user management:

1. **Sign Up**: Users can create an account using email/password or social providers
2. **Login**: Users can log in with their credentials
3. **Profile Management**: Users can view and update their profile information
4. **Authentication State**: The app maintains authentication state across sessions

## Project Structure

- `src/firebase/` - Firebase configuration and services
- `src/hooks/` - Custom hooks including authentication hook
- `src/context/` - Context providers including AuthContext
- `src/components/` - Reusable UI components
- `src/pages/` - Application pages/routes

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Material-UI Documentation](https://mui.com/getting-started/usage/)
