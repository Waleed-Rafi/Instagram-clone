import firebase from 'firebase'
var firebaseConfig = {
    apiKey: "AIzaSyAykQHEJbiGG6Cq65meKLyst4uBJQcDUao",
    authDomain: "react-my-burger-ec8a6.firebaseapp.com",
    databaseURL: "https://react-my-burger-ec8a6.firebaseio.com",
    projectId: "react-my-burger-ec8a6",
    storageBucket: "react-my-burger-ec8a6.appspot.com",
    messagingSenderId: "331061967524",
    appId: "1:331061967524:web:a4b8dacd64c63417440431"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;