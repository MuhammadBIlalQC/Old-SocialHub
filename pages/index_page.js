'use strict';

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
      React.createElement('textarea', { ref: 'postData', className: 'post',
        placeholder: 'Post an Anouncement...' }),
      React.createElement('br', null),
      React.createElement('input', { className: 'btn btn-primary post-submit', type: 'button', value: 'Post', onClick: this.postAnnouncement })
    );
  }
});

ReactDOM.render(React.createElement(
  'div',
  null,
  React.createElement(Announcement, null),
  Posts.reverse()
), document.getElementById('post-content'));