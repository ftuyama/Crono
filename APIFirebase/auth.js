var firebase = require("firebase");

firebase.initializeApp({
    databaseURL: 'https://crono-b0853.firebaseio.com/',
    serviceAccount: 'APIFirebase/Crono.json',
});

module.exports = firebase;