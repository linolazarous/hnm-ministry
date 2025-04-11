export function loadFacebookSDK(appId) {
  return new Promise((resolve) => {
    window.fbAsyncInit = function() {
      FB.init({
        appId,
        cookie: true,
        xfbml: true,
        version: 'v18.0',
        status: true
      });
      resolve(FB);
    };

    // Load SDK asynchronously
    const script = document.createElement('script');
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);
  });
}