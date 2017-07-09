'use strict';

var getJSON = function getJSON(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    var status = xhr.status;
    if (status == 200) {
      callback(null, xhr.response);
    } else {
      callback(status);
    }
  };
  xhr.send();
};

var Post = React.createClass({
  displayName: 'Post',

  getDefaultProps: function getDefaultProps() {
    return { msg: 'This is a test message. I did not know what to put so I am babeling about anything' };
  },
  render: function render() {
    var size = document.body.clientWidth > 700 ? 'normal' : 'small';
    return React.createElement(
      'div',
      { className: 'announcement' },
      React.createElement(
        'h3',
        { className: 'prompter' },
        React.createElement(
          'i',
          null,
          'Some-User (11/13/2020 9:32pm): '
        )
      ),
      React.createElement(
        'p',
        { className: 'prompter-msg' },
        this.props.msg
      )
    );
  }
});

var Posts = [React.createElement(Post, null), React.createElement(Post, null), React.createElement(Post, null), React.createElement(Post, null), React.createElement(Post, null), React.createElement(Post, null), React.createElement(Post, null)];

var Announcement = React.createClass({
  displayName: 'Announcement',

  postAnnouncement: function postAnnouncement() {
    getJSON('announcements/post?content=' + this.refs.postData.value, function (err, data) {
      if (err) console.log('error');
      console.log(data);
    });
    Posts.push(React.createElement(Post, { msg: this.refs.postData.value }));
    this.refs.postData.value = "";
    ReactDOM.render(React.createElement(
      'div',
      null,
      React.createElement(Announcement, null),
      Posts.reverse()
    ), document.getElementById('post-content'));
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement('textarea', { name: 'serverPost', id: 'serverPost', ref: 'postData', className: 'post',
        placeholder: 'Post an Anouncement...' }),
      React.createElement('br', null),
      React.createElement('input', { className: 'btn btn-primary post-submit', type: 'button', value: 'Post', onClick: this.postAnnouncement })
    );
  }
});

var Content = React.createClass({
  displayName: 'Content',

  getDefaultProps: function getDefaultProps() {
    return { posts: [] };
  },
  getInitialState: function getInitialState() {
    return { Posts: this.props.posts };
  },
  render: function render() {
    var Posts = this.state.Posts.map(function (post) {
      return React.createElement(Post, { msg: post.content });
    });
    console.log(Posts);
    return React.createElement(
      'div',
      null,
      React.createElement(Announcement, null),
      Posts
    );
  }
});

getJSON('announcements/get', function (err, data) {
  if (err) console.log(err);else {
    console.log();
    ReactDOM.render(React.createElement(Content, { posts: data }), document.getElementById('post-content'));
  }
});
