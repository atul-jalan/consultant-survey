import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDPnUmnTNsmFbsIELwV8ILe3OtY1291Zuk",
    authDomain: "consultant-survey.firebaseapp.com",
    projectId: "consultant-survey",
    storageBucket: "consultant-survey.appspot.com",
    messagingSenderId: "353884121225",
    appId: "1:353884121225:web:a829c1a5f8406a5e05fe58"
};

try {
  firebase.initializeApp(firebaseConfig);

} catch(err){
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)}
}

const fire = firebase;
export default fire;