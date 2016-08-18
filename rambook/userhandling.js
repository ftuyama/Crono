var UserHandling = module.exports = function(io) {
  // Mantem controle dos "likes" para cada post
  this.posts = {};
 
  this.io = io;
  this.loggedUsers = {};
  this.init();
};

UserHandling.prototype = {
 
  init: function() {
    var that = this;
    this.io.on('connection', function(socket) {
      console.log('Event connection: connected.');
      socket.on('disconnect', function() {
        console.log('Event disconnect: disconnected.');
        that.onDisconnect(socket);
      });
 
      that.bindEvents(socket);
      that.onUserList(socket);
    });
  },
 
  bindEvents: function(socket) {
    var that = this;
 
    socket.on('userlogin', function(data) {
      that.onUserLogin(socket, data);
    });
 
    socket.on('userlist', function(data) {
      that.onUserList(socket, data);
    });
 
    socket.on('makepost', function(data) {
      that.onMakePost(socket, data);
    });
 
    socket.on('makecomment', function(data) {
      that.onMakeComment(socket, data);
    });
 
    socket.on('likepost', function(data) {
      that.onLikePost(socket, data);
    });
 
    socket.on('likecomment', function(data) {
      that.onLikeComment(socket, data);
    });
 
  },
 
  onDisconnect: function(socket) {
    delete this.loggedUsers[socket.id];
    this.onUserList(socket);
  },
 
  sendMessage: function(socket, msg) {
    socket.emit('msg', {text: msg, type: 'info'});
  },
 
  onUserLogin: function(socket, data) {
    var that = this;
    if(data.username) {
      socket.handshake.username = data.username;
      that.loggedUsers[socket.id] = socket;
      socket.emit('userlogin');
      that.onUserList(socket);
    } else {
      this.sendMessage(socket, 'vc precisa escolher um nome');
    }
  },
 
  onUserList: function(socket, data) {
    var that = this,
        keys = Object.keys(this.loggedUsers),
        userList = new Array(keys.length),
        i = 0;
 
    keys.forEach(function(k) {
      userList[i++] = {
        id: k,
        username: that.loggedUsers[k].handshake.username
      };
    });
 
    socket.emit('userlist', userList);
    socket.broadcast.emit('userlist', userList);
  },
 
  onMakePost: function(socket, data) {
    var id = Date.now(),
        postData = {
          author: socket.handshake.username,
          authorId: socket.id,
          timestamp: id,
          id: id,
          text: data
        };
 
    //cadastra o post no controle de likes
    this.posts[id+''] = 0;
 
    socket.emit('makepost', postData);
    socket.broadcast.emit('makepost', postData);
  },
 
  onMakeComment: function(socket, data) {
    var id = Date.now(),
        commentData = {
          author: socket.handshake.username,
          authorId: socket.id,
          timestamp: Date.now(),
          text: data.text,
          postId: data.postId,
          id: id
        };
 
    //cadastra o post no controle de likes
    this.posts[id+''] = 0;
 
    socket.emit('makecomment', commentData);
    socket.broadcast.emit('makecomment', commentData);
    console.log(commentData);
  },
 
  onLikePost: function(socket, data) {
    var likeCount = this.posts[data.postId+''];
 
    if(data.like) {
      likeCount += 1;
    } else {
      likeCount -= 1;
    }
 
    this.posts[data.postId+''] = likeCount;
 
    socket.emit('likepost', {postId: data.postId, numLikes: likeCount});
    socket.broadcast.emit('likepost', {postId: data.postId, numLikes: likeCount});
  },
 
  onLikeComment: function(socket, data) {
    var likeCount = this.posts[data.commentId+''];
 
    if(data.like) {
      likeCount += 1;
    } else {
      likeCount -= 1;
    }
 
    this.posts[data.commentId+''] = likeCount;
 
    socket.emit('likecomment', {commentId: data.commentId, numLikes: likeCount});
    socket.broadcast.emit('likecomment', {commentId: data.commentId, numLikes: likeCount});
  }
};
