// public/shared.js
window.appConfig = {
  stripe: {
    successUrl: '/success.html',
    cancelUrl: '/cancel.html'
  },
  socialMedia: {
    facebook: 'https://facebook.com/yourpage',
    youtube: 'https://youtube.com/yourchannel',
    whatsapp: 'https://wa.me/211926006202'
  }
};

// Session storage for cross-page communication
function setSessionData(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

function getSessionData(key) {
  return JSON.parse(sessionStorage.getItem(key));
}
