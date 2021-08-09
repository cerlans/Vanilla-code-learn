import {about, home, topics,results,videoPlayer,savedCourses} from './Views.js'
import {login} from './Login.js'
import {tutorialView} from './tutorialContainer.js'
import {fireBase} from './fireBase.js'

  //cloud firestore
  let db = firebase.firestore();

 /* youtube v3 data API loading */
 const loadClient =() => {
   gapi.client.setApiKey("AIzaSyCFiBdff1JxkTe4F_0auryiuqiYMIJd48g");
   //why is this returned?
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
 }
 
(() => {
  gapiLoader()
})()
export function gapiLoader (){
   const load = new Promise((resolve,reject)=>{
          gapi.load("client",resolve);
        })
        load.then((data)=>{
          
           gapi.client.setApiKey("AIzaSyCFiBdff1JxkTe4F_0auryiuqiYMIJd48g");
           return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        }).then(()=>{
          console.log('GAPI client loaded for API')
          window.loadInstance = true
          
          })
         
}

// routes for the components that are imported from .Views.js
let routes = {
    '/': home,
    '/About': about,
    '/Topics': topics,
    '/Topics/:topicsId' : results,
    '/Topics/:topicsId/:youtubeId' : videoPlayer,
    '/Login': login,
    '/savedCourses':savedCourses,
    '/savedCourses/:youtubeId': tutorialView
}

const router = Router(routes);

router.init(['/'])




// sets conditional styles if user is logged in or logged out
firebase.auth().onAuthStateChanged(function(user) {
  /*
  db.collection("Users").get().then(function(querySnapshot) {      
    console.log(querySnapshot.size); 
});
*/
  const signOutButton= document.getElementById('logOut')
  const logInButton = document.getElementById('logIn')
  const savedCourses = document.getElementById('savedCourses')
  if (user) {
    //adds the userid and additional information to the firestore database
    // if a returning user re-logs in this function runs but doesn't add anything to firestore DB
    //my current rule allows this function to create a document based on the user id, if the user auth is not equal to false (hence not logged in)
    // in this case, if a user is true (logged in) firebase will write this document for each user due to being allowed in firebase rules
    db.collection("Users").doc(user.uid).set({
          userName: user.displayName,
          anonymousLogin: user.isAnonymous,
          userId: user.uid,
          email: user.email,
        });

   signOutButton.style.display='block'
   logInButton.style.display='none'
   savedCourses.style.display='block'
  } else {
    // No user is signed in.
    signOutButton.style.display='none'
    logInButton.style.display='block'
    savedCourses.style.display='none'
  }
});


//event listener for logout button
(function() {
const signOutButton= document.getElementById('logOut')
signOutButton.addEventListener('click',()=>{
  firebase.auth().signOut().then(function() {
    console.log('sign out worked')
}, function(error) {
  console.log(error)
});
})
})()
//testing,remove later
/*
let sideBar = document.getElementById('sideBar');
console.log(sideBar)
sideBar.addEventListener('click',(event)=>{
  if (event.target.className === 'nav'){
     event.target.classList.add('nav-active');
     console.log(event.target)
  }
})
*/