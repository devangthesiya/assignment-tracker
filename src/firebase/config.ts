import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseCredentials } from './credentials';

const firebaseConfig = firebaseCredentials;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app; 