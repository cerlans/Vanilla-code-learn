import {about, home, login, topics} from './Views.js'
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
  firebase.initializeApp(firebaseConfig);
 
 /* youtube v3 data API loading */
 const loadClient =() => {
   gapi.client.setApiKey("AIzaSyCFiBdff1JxkTe4F_0auryiuqiYMIJd48g");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
 }
 
(function() {
    gapi.load("client", loadClient);
})()




function logOut(){
  firebase.auth().signOut().then(function() {
    console.log('sign out worked')
}, function(error) {
  console.log(error)
});
}

let routes = {
    '/': home,
    '/About': about,
    '/Topics': topics,
    '/Login': login
}

const router = Router(routes);
router.init(['/'])
