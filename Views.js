/* these shared view panes will replace the contents off .informationView class in the html whenever the route is changed */
import {listTopics} from './List.js'
import {fireBase} from './fireBase.js'
import {gapiLoader} from './script.js'

  let db = firebase.firestore();
  console.log(db)

//youtube api function returns 10 search results relating to user query
 let execution = (hashSearchString,view,)=> {
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
                
                  <a href='#/Topics/${hashSearchString}/${value.id.videoId}'>
                      <div class='video'>
                        <div class='thumbnail'>
                          <img src=${value.snippet.thumbnails.medium.url} alt='a youtube video'>
                        </div>
                        <div class='videoTitle'>
                        <p>${value.snippet.title}</p>
                        <h4> ${value.snippet.channelTitle}</h4>
                        </div>
                      </div>
                    </a>
                    </div>
                  `)
                 
                }).join('')
              
                 view.innerHTML = videoResults
              },
              function(err) { console.error("Execute error", err); });
  }
  //verifies whether user is logged or not and returns conditional text
  const verify = (user,text,text2) =>{
    return ( user ? `<div id='trueButton' class='trueButton'>${text}</div>`:`<a href='#/Login' style='text-align:center;'><div id='falseButton'>${text2}</div></a>`)
  }
let random = (auth,movie,videoId)=>{
const informationView = document.getElementById('informationView')
informationView.addEventListener('click',(event)=>{
  if(event.target.className === 'trueButton'){
    console.log(auth.uid)
    console.log(movie)
    addVideo(auth.uid,movie,videoId)
    event.target.innerText = 'video added!'
  }
})
}
  let singleVideoExecution = (videoParam,innerView)=>{
     return gapi.client.youtube.videos
      .list({
        part: ["snippet,contentDetails,statistics"],
        id: videoParam,
      })
      .then(
        function (response) {
          console.log(response)
        firebase.auth().onAuthStateChanged(function(user) {
         let videoId = response.result.items[0].id
         let video = response.result.items[0].snippet
         let text = `
         <div id = 'videoPlayer'>	
            <div class='iframePanel'>
              <h1>${video.title}</h1>
              <p>${video.channelTitle}</p>
              <iframe id="player" type="text/html"
              src="http://www.youtube.com/embed/${videoParam}"
              frameborder="0">
              </iframe>
             ${verify(user,'Add Course','Sign in to save Courses')}
              
            </div>
            <div class='videoDescription'>
            <p>${video.description.replaceAll('\n', '<br>')}</p>
            </div>
         </div>
      `
      random(user,video,videoId)
      innerView.innerHTML = text
       })
        },
        function (err) {
          console.error("Execute error", err);
        }
      );
  }
  
  // about page in the router
export let about =()=>{
  
    const view = document.getElementById('informationView')
    let text = `<div class="about">
      <div class='spread'>
      <h1>About</h1>
      <p>I created this application out of a desire to further increase my skills in JavaScript. When im on youtube, i mostly watch programming videos, and there's been times in which i didn't feel like fully opening up EverNote, i'd have to sign in, create a shared pane with the video im watching on desktop.</p>
      <p>Code and Learn solves that problem, users can create an account, save videos to watch later, while also having the ability to take notes within the same window. Users have the ability to either sign up, or use the application anonymously through Google's proprietary firebase authentication API  </p>
      <p>Work in progress, and i am still adding features.</p>
      </div>
    </div>`
    view.innerHTML = text

}

let verifyAnon = (anon,standard) =>{
return (anon ?` <h1>Anonymous user detected</h1>
	     <p>any saved courses/data will be lost upon signing out or refreshing the page</p>`
	: `<h1>Welcome ${standard.displayName}</h1>
   <p>Your data will be saved</p>`)
}

//home page in the router
export let home = () =>{
  firebase.auth().onAuthStateChanged(function(user) {
    // i have to verify against the user being anonymous as -well, anon users can't save there progress and must be warned
      const view = document.getElementById('informationView')
      let verify = user ? `
            <div class='parent'>
                    <div class='photo'>
                    <img src='https://i.vgy.me/sTK7Wi.png'>
                  </div>
                  <div class='sign-in'>
                   ${verifyAnon(user.isAnonymous,user)}
                  </div>
            </div>
            `:`
            <div class='parent'>
                <div class='photo'>
                  <img src='https://i.vgy.me/sTK7Wi.png'>
                </div>
                <div class='sign-in'>
                  <h1>Learn to code with curated video tutorials</h1>
                  <a href='#/Login'><button>Create An Account</button></a>
                </div>
          </div>
            `
    view.innerHTML = verify
});
}

//topics page in the router
export let topics =()=>{
  firebase.auth().onAuthStateChanged(function(user) {
       
        let text = `
            <div class='topicsMaster'>
                 <div class='topicsHeading'>
                  <h1>What do you want to learn?</h1>
                   ${verify(user,'You are signed in', 'You must be signed in to save courses')}
                 </div>
                 ${listTopics}
            </div>
        `
          view.innerHTML = text
          
  })
}

export let results = () => {
const view = document.getElementById('informationView')
      let isLoading = true
      if(isLoading) {
        view.innerHTML =  `
        <div class='align'>
        <div class="loader"></div>
        </div> `
      }
      const hashSearchString = window.location.hash.slice(9);
       execution(hashSearchString,view,isLoading)
}

/* 
 const view = document.getElementById('informationView')
      let isLoading = true
      if(isLoading) {
        view.innerHTML =  `
        <div class='align'>
        <div class="loader"></div>
        </div> `
      }
      const hashSearchString = window.location.hash.slice(9);
       execution(hashSearchString,view,isLoading)
*/
//adds video to the users collection
//userId param is only fillable with firebase Auth
function addVideo(userToken,movie,videoId){
  db.collection(`Users/${userToken}/SavedVideos`)
                      .add({
                        channelTitle: movie.channelTitle,
                        videoTitle: movie.title,
                        videoDescription: movie.description,
                        videoId: videoId,
                        videoThumbnail: movie.thumbnails.medium.url,
                      })
                      .then(() => {
                        console.log("Document successfully written!");
                      })
                      .catch((error) => {
                        console.error("Error writing document: ", error);
                      });
}
export let videoPlayer = ()=>{
  const view = document.getElementById('informationView')
  const videoPath = window.location.hash.split('/')
  //sets the third part off the url, which will always be the video id
  const videoId = videoPath[3];
  singleVideoExecution(videoId,view)
}

export let savedCourses = () => {
    const view = document.getElementById('informationView')
    firebase.auth().onAuthStateChanged((user)=>{
    })
    view.innerHTML = 'Saved Courses will go here'
    /*
    db.collection("Users").get().then(function(querySnapshot) {      
    console.log(querySnapshot.size); 
});
*/
//will verify against the number of courses the user contains in his/her collection, boolean will be used to verify whether to display an empty page with an idicator to add course or show the collection off saved videos.
}

