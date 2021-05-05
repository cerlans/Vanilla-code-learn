/* these shared view panes will replace the contents off .informationView class in the html whenever the route is changed */
import {listTopics} from './List.js'


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
                  `)
                 
                }).join('')
              
                 view.innerHTML = videoResults
              },
              function(err) { console.error("Execute error", err); });
  }

  let singleVideoExecution = (videoParam,innerView)=>{
     return gapi.client.youtube.videos
      .list({
        part: ["snippet,contentDetails,statistics"],
        id: videoParam,
      })
      .then(
        function (response) {
         let video = response.result.items[0].snippet
        
         console.log(video.description)
         let text = `<div id = 'videoPlayer'>
        <div class='videoTitle'>
          <h1>${video.title}</h1>
          <p>${video.channelTitle}</p>	
        </div>
          <iframe id="player" type="text/html"
            src="http://www.youtube.com/embed/${videoParam}"
            frameborder="0">
          </iframe>
          <p>${video.description}</p>
        </div>
      `
      innerView.innerHTML = text
    
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

//home page in the router
export let home = () =>{
  firebase.auth().onAuthStateChanged(function(user) {
      const view = document.getElementById('informationView')
      let verify = user ? `
            <div class='parent'>
                    <div class='photo'>
                    <img src='https://i.vgy.me/sTK7Wi.png'>
                  </div>
                  <div class='sign-in'>
                    <h1> welcome ${user.displayName}</h1>
                    <p>Your data will be saved</p>
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
        const view = document.getElementById('informationView')
        // in reality all i really need to change here is the span, but im re-writing the entire html tree
          let verify = user ? (`<div class='topicsHeading'> 
                                <h1>What do you want to learn?</h1>
                                <p>You are signed in</p>
                                </div>
                                ${listTopics}
          `): (` 
                <div class='topicsHeading'> 
                <h1 >What do you want to learn?</h1>
                <a href='#/Login'>
                <p >Sign up for an account to add tutorials to your subscriptions and take notes!</p>
                </a>
                </div>
                ${listTopics}
          `)
          view.innerHTML = verify
  })
}

export let results = ()=>{
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

export let random = ()=>{
  const view = document.getElementById('informationView')
  const videoPath = window.location.hash.split('/')
  //sets the third part off the url, which will always be the video id
  const videoId = videoPath[3];
  singleVideoExecution(videoId,view)
}

/* 
    <iframe id="player" type="text/html"
    src="http://www.youtube.com/embed/${videoId}"
    frameborder="0">
    </iframe>
*/