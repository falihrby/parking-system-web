import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAROWgL9Y_KXDG_sEUgf9EtxF7BL-QzPLI",
  authDomain: "parking-system-web.firebaseapp.com",
  projectId: "parking-system-web",
  storageBucket: "parking-system-web.appspot.com",
  messagingSenderId: "526105216530",
  appId: "1:526105216530:web:0308fdd90ee2258f0f3acb",
  measurementId: "G-TTQE0Z5G4V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

export { firestore };
