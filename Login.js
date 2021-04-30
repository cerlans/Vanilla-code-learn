//Login component, uses firebase auth drop in solution
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

