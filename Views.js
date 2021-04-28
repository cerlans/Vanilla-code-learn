/* these shared view panes will replace the contents off .informationView class in the html whenever the route is changed */
import {listTopics} from './List.js'

 let execution = (hashSearchString,view)=> {
    return gapi.client.youtube.search.list({
      "part": [
        "snippet"
      ],
      "maxResults": 10,
      "q": hashSearchString,
      "type": [
        "video"
      ],
      "videoDuration": "medium"
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                let videoResults = response.result.items.map((value)=>{
                  return (`
                      <div class='video'>
                        <div class='thumbnail'>
                          <img src=${value.snippet.thumbnails.medium.url} alt='a youtube video'>
                        </div>
                        <div class='videoTitle'>
                        <p>${value.snippet.title}</p>
                        <h4> ${value.snippet.channelTitle}</h4>
                        </div>
                      </div>
                  `)
                 
                }).join('')
                 view.innerHTML = videoResults
              },
              function(err) { console.error("Execute error", err); });
  }
  // about page in the router
export let about =()=>{
  
    const view = document.getElementById('informationView')
    let text = `<div class="about">
      <div class='spread'>
      <h1>About</h1>
      <p>I created this application out of a desire to further increase my skills in reactJS, and programming in general. When im on youtube, i mostly watch programming videos, and there's been times in which i didn't feel like fully opening up EverNote, i'd have to sign in, create a shared pane with the video im watching on desktop.</p>
      <p>Code and Learn solves that problem, users can create an account, save videos to watch later, while also having the ability to take notes within the same window. Users have the ability to either sign up, or use the application anonymously through Google's proprietary firebase authentication API  </p>
      <p>Work in progress, and i am still adding features.</p>
      </div>
    </div>`
    view.innerHTML = text

}

//home page in the router
export let home = () =>{
  firebase.auth().onAuthStateChanged(function(user) {
      const view = document.getElementById('informationView')
      let verify = user ? `<div class='photo'>
               <img src='https://i.vgy.me/sTK7Wi.png'>
            </div>
            <div class='sign-in'>
               <h1> welcome ${user.displayName}</h1>
               <p>Your data will be saved</p>
            </div>`:`<div class='photo'>
               <img src='https://i.vgy.me/sTK7Wi.png'>
            </div>
            <div class='sign-in'>
               <h1>Learn to code with curated video tutorials</h1>
               <a href='#/Login'><button>Create An Account</button></a>
            </div>`
    view.innerHTML = verify
});

}
//topics page in the router
export let topics =()=>{
  firebase.auth().onAuthStateChanged(function(user) {
        const view = document.getElementById('informationView')
        // in reality all i really need to change here is the span, but im re-writing the entire html tree
          let verify = user ? (` <h1>What do you want to learn?</h1>
                                <p>You are signed in</p>
                                ${listTopics}
          `): (` <h1>What do you want to learn?</h1>
                <p>Sign up for an account to add tutorials to your subscriptions and take notes!</p>
                ${listTopics}
          `)
          view.innerHTML = verify
  })
}

export let results = ()=>{
      const hashSearchString = window.location.hash.slice(9);
      const view = document.getElementById('informationView')
      execution(hashSearchString,view)
}

export let login = () => {
   let uiConfig = {
         signInFlow: 'redirect',
        signInSuccessUrl: '/#/',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        tosUrl: '<your-tos-url>',
        // Privacy policy url/callback.
        privacyPolicyUrl: function() {
          window.location.assign('<your-privacy-policy-url>');
        }
      };
    const view = document.getElementById('informationView')
    let text = `<div id="firebaseui-auth-container">
    </div>`;
    view.innerHTML = text
      // Initialize the FirebaseUI Widget using Firebase.
      // watches for an existing instance, if one exists, retrieves the instance otherwise it creates a new one
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth())     
     // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', uiConfig);
}

