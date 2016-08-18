require(['jquery', 'client', 'mustache'], function($, client, Mustache) {
   
    var username = $('#username'),
        onlineUsers = $('.online-users'),
        postContent = $('#post-content'),
        frmJoin = $('#frm-join'),
        posts = $('.posts'),
        notLogged = $('#not-logged'),
        logged = $('#logged'),
        userlistTpl = $('#userlist-template').html(),
        postTpl = $('#post-template').html(),
        commentTpl = $('#comment-template').html(),
        lnkComment = $('.lnk-comment');
   
    //Formatador da hora para o mustache
    function formatHour() {
        var today = new Date(this.timestamp);
        return today.getHours() + ':' + today.getMinutes();
    }
   
    /*********DECLARAÇÃO DE EVENTOS**********/
    $('.container')
   
    .on('click', '#btn-entrar', function(ev) {
      var name = username.val();
   
      if(name) {
        client.userLogin(name);
      }
    })
   
    .on('click', '.lnk-comment', function(ev) {
      var postId = $(this).data('post-id');
      $('[data-post-to-comment-id="' + postId + '"]').toggleClass('hidden');
    })
    
    .on('click', '#btn-postar', function(ev) {
      client.makePost(postContent.val());
      postContent.val('');
    })
    
    .on('click', '.btn-commentar', function(ev) {
   
      var commentForm = $(this).parents('.comment-form'),
          postId = commentForm.data('post-to-comment-id'),
          textarea = $('.txt', commentForm),
          commentData = {postId: postId, text: textarea.val()};
   
      client.makeComment(commentData);
      textarea.val('');
      commentForm.addClass('hidden');
    })
   
    .on('click', '.lnk-cancel-comment', function(ev) {
      var commentForm = $(this).parents('.comment-form');
      commentForm.addClass('hidden');
    })
   
    .on('click', '.lnk-like-post', function(ev) {
      var postId = $(this).data('post-id'),
          like = $(this).attr('data-like');
   
      if(like === 'true') {
        like = true;
      } else {
        like = false;
      }
   
      client.likePost({postId: postId, like: like});
      $(this).attr('data-like', !like);
    })
    
    .on('click', '.lnk-like-comment', function(ev) {
      var commentId = $(this).data('comment-id'),
          like = $(this).attr('data-like');
   
      if(like === 'true') {
        like = true;
      } else {
        like = false;
      }
   
      client.likeComment({commentId: commentId, like: like});
      $(this).attr('data-like', !like);
    });
    
    /*********DECLARAÇÃO DOS LISTENERS**********/
    client.events.connect = function(data) {
      frmJoin.removeClass('hidden');
    };
   
    client.events.userlogin = function(data) {
      frmJoin.html(username.val());
   
      notLogged.addClass('hidden');
      logged.removeClass('hidden');
    };
   
    client.events.userlist = function(data) {
      var html = Mustache.render(userlistTpl, {users: data});
      onlineUsers.html(html);
    };
   
    client.events.makepost = function(data) {
      var html = Mustache.render(postTpl, {post: data, hora: formatHour});
      posts.prepend(html);
    };
   
    client.events.makecomment = function(data) {
      var html = Mustache.render(commentTpl, {comment: data, hora: formatHour}),
          postComments = $('.post[data-post-id="' + data.postId + '"] .post-comments');
      postComments.prepend(html);
    };
   
    client.events.likepost = function(data) {
      var lnkLikePost = $('.post[data-post-id="' + data.postId + '"] .lnk-like-post');
      lnkLikePost.html('(' + data.numLikes + ')');
    };
   
    client.events.likecomment = function(data) {
      var lnkLikeComment = $('.comment[data-comment-id="' + data.commentId + '"] .lnk-like-comment');
      lnkLikeComment.html('(' + data.numLikes + ')');
    };
   
  });
