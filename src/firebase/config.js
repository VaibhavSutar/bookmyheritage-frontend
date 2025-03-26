// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOQgwIBbvmnzKwSYB8FYMAjtruTyWEvWQ",
  authDomain: "bookmyheri.firebaseapp.com",
  projectId: "bookmyheri",
  storageBucket: "bookmyheri.appspot.com", // Fix storageBucket (remove .app)
  messagingSenderId: "267908745267",
  appId: "1:267908745267:web:345f9fbc6f6351d42a7b46",
  measurementId: "G-PCDJS3F6BQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app);

// Export the services
export { auth, db, storage };
