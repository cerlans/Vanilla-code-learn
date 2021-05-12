

export let tutorialView = ()=>{
    const view = document.getElementById('informationView')
    const videoPath = window.location.hash.split('/')
    console.log(videoPath[2])
   
  //the video player will also go here, but it will have added feautrues that will be given to them by this function
  view.innerHTML = `
     <div class='iframePanel'>
              <h1></h1>
              <p></p>
              <iframe id="player" type="text/html"
              src="http://www.youtube.com/embed/${videoPath[2]}"
              frameborder="0">
              </iframe>
            </div>
            `
}