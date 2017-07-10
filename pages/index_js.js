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
var user = "Error gettign user";

getJSON('friends/getusername', function (err, data) {
  if (err) console.log(err);else user = data;
});

var Post = React.createClass({
  displayName: 'Post',

  getDefaultProps: function getDefaultProps() {
    return { msg: 'This is a test message. I did not know what to put so I am babeling about anything', user: 'Error getting User' };
  },
  render: function render() {
    console.log('what the fuck');
    return React.createElement(
      'div',
      { className: 'announcement' },
      React.createElement(
        'h3',
        { className: 'prompter' },
        React.createElement(
          'i',
          null,
          this.props.user,
          ' ',
          React.createElement(
            'span',
            { className: 'date' },
            ' (11/13/2020 9:32pm):'
          ),
          ' '
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

var Announcement = React.createClass({
  displayName: 'Announcement',

  postAnnouncement: function postAnnouncement() {

    document.getElementById('serverPost').value = "";
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement('textarea', { name: 'serverPost', id: 'serverPost', ref: 'postData', className: 'post',
        placeholder: 'Post an Anouncement...' }),
      React.createElement('br', null),
      React.createElement('input', { className: 'btn btn-primary post-submit', type: 'button', value: 'Post', onClick: this.props.click })
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
  postAnnouncement: function postAnnouncement() {
    getJSON('announcements/post?content=' + document.getElementById('serverPost').value, function (err, data) {
      if (err) console.log('error');
      console.log(data);
    });
    var Posts = this.state.Posts;
    Posts.unshift({ user: user, content: document.getElementById('serverPost').value });
    this.setState({ Posts: Posts });
  },
  render: function render() {
    this.postAnnouncement = this.postAnnouncement.bind(this);
    var Posts = this.state.Posts.map(function (post) {
      return React.createElement(Post, { msg: post.content, user: post.user });
    });
    return React.createElement(
      'div',
      null,
      React.createElement(Announcement, { click: this.postAnnouncement }),
      Posts
    );
  }
});

function updatePosts() {
  console.log('updated?');
  getJSON('announcements/get', function (err, data) {
    if (err) console.log(err);else {
      console.log();
      ReactDOM.render(React.createElement(Content, { posts: data }), document.getElementById('post-content'));
    }
  });
};

updatePosts();
