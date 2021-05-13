 // creating a seperate file for firebase initi allows the same instance to be used by all files
 const firebaseConfig = {
    apiKey: "AIzaSyCjSYyCaUAoeOhwa5xYNbxpJ668xLpRND0",
    authDomain: "restart-1ad32.firebaseapp.com",
    projectId: "restart-1ad32",
    storageBucket: "restart-1ad32.appspot.com",
    messagingSenderId: "786954108275",
    appId: "1:786954108275:web:b34f795a9a4a4018cb5906",
    measurementId: "G-0M9VW8FHW3"
  };
  // Initialize Firebase
 export let fireBase  = firebase.initializeApp(firebaseConfig);