$.getJSON("/data/firebase.json", function(data) {
    firebase.initializeApp(data);
    storage = firebase.storage();
    storageRef = storage.ref("/");
});
var storage, storageRef;