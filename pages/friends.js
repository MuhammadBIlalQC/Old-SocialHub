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

var allUsers = [];
var User = React.createClass({
  displayName: 'User',


  getDefaultProps: function getDefaultProps() {
    return { imgsrc: "placeholder.png", name: "Some Random User" };
  },

  getButton: function getButton() {
    if (this.props.friend) return React.createElement(
      'h3',
      { className: 'friend-bttn', name: this.props.name },
      'Friends!'
    );
    if (this.props.request && this.props.sent) return React.createElement(
      'h3',
      { className: 'friend-bttn', name: this.props.name },
      ' Added! ',
      React.createElement('span', { className: 'glyphicon glyphicon-ok' })
    );
    if (this.props.request) return React.createElement(
      'div',
      { className: 'inline' },
      React.createElement(
        'a',
        { className: 'btn btn-default friend-bttn', name: this.props.name, onClick: this.props.click },
        'Reject'
      ),
      ';',
      React.createElement(
        'a',
        { className: 'btn btn-success friend-bttn', name: this.props.name, onClick: this.props.click },
        'Add Friend'
      ),
      ';'
    );
    if (!this.props.sent) return React.createElement(
      'a',
      { className: 'btn btn-primary friend-bttn', name: this.props.name, onClick: this.props.click },
      'Add User'
    );else return React.createElement(
      'h3',
      { className: 'friend-bttn', name: this.props.name },
      'Sent ',
      React.createElement('span', { className: 'glyphicon glyphicon-ok' })
    );
  },

  testing: function testing(e) {
    e.preventDefault();
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'friends' },
      React.createElement('img', { src: this.props.imgsrc, className: 'friend-img' }),
      React.createElement(
        'label',
        { className: 'friend-name' },
        this.props.name
      ),
      this.getButton()
    );
  }
});
var UserList = React.createClass({
  displayName: 'UserList',

  getDefaultProps: function getDefaultProps() {
    return { users: [], request: false };
  },
  setUsers: function setUsers() {
    this.setState({ users: this.props.users });
  },

  addFriend: function addFriend(e) {
    var Users = this.state.users;
    var friend = e.target.name;
    for (var i = 0; i < Users.length; i++) {
      if (friend == Users[i].name) {
        Users[i] = { name: Users[i].name, imgsrc: Users[i].imgsrc, sent: true };
        getJSON('friends/add?add=' + friend, function (err, data) {
          if (err) console.log('error sending request');else console.log(data);
        });
        this.setState({ users: Users });
        break;
      }
    }
  },
  acceptFriend: function acceptFriend(e) {
    var Users = this.state.users;
    var friend = e.target.name;
    for (var i = 0; i < Users.length; i++) {
      if (friend == Users[i].name) {
        Users[i] = { name: Users[i].name, imgsrc: Users[i].imgsrc, sent: true };
        getJSON('friends/acceptrequest?friend=' + friend, function (err, data) {
          if (err) console.log('error sending request');else console.log(data);
        });
        this.setState({ users: Users });
        break;
      }
    }
  },

  getUsers: function getUsers() {
    if (!this.state) return this.props.users;
    return this.state.users;
  },
  render: function render() {
    this.addFriend = this.addFriend.bind(this);
    this.acceptFriend = this.acceptFriend.bind(this);
    var self = this;
    var nonFriendsList = this.getUsers().map(function (friend) {
      var friendBttn = friend.acceptType ? self.acceptFriend : self.addFriend;
      return React.createElement(
        'li',
        { className: 'inline' },
        React.createElement(User, { name: friend.name,
          click: friendBttn, imgsrc: 'http://localhost:3000/' + friend.imgsrc,
          request: friend.request, sent: friend.sent, acceptType: friend.accept, friend: friend.friend }),
        ' '
      );
    });
    return React.createElement(
      'div',
      { onLoad: this.setUsers },
      React.createElement(
        'h2',
        null,
        this.props.heading
      ),
      React.createElement(
        'ul',
        null,
        nonFriendsList
      ),
      React.createElement('hr', null)
    );
  }
});

getJSON('/friends/allfriends', function (err, data) {
  if (err) console.log('error');else {
    if (data.length != 0) ReactDOM.render(React.createElement(UserList, { heading: 'Your Friends', id: 'friendsList', users: data }), document.getElementById('friends-list'));else ReactDOM.render(React.createElement(
      'div',
      null,
      React.createElement(
        'h1',
        null,
        'Your Friends'
      ),
      React.createElement(
        'h3',
        { className: 'gray' },
        'Uh oh. Looks like you have no friends yet. Please add friends below! '
      )
    ), document.getElementById('friends-list'));
  }
});

getJSON('/allusers', function (err, data) {
  if (err) console.log('error');else if (data.length != 0) ReactDOM.render(React.createElement(UserList, { heading: 'Add Friends', id: 'nonFriendsList', users: data }), document.getElementById('nonFriends-list'));
});
getJSON('/friends/sentrequests', function (err, data) {
  if (err) console.log('error');else if (data.length != 0) ReactDOM.render(React.createElement(UserList, { heading: 'Sent Requests', id: 'requestSent-list', users: data }), document.getElementById('requestSent-list'));
});
getJSON('/friends/requests', function (err, data) {
  if (err) console.log('error');else if (data.length != 0) ReactDOM.render(React.createElement(UserList, { heading: 'Friend Requests', id: 'nonFriendsList', users: data }), document.getElementById('requests'));
});

/*fetch("http://localhost:3000/allusers").then(function(res){
   return res.json(); 
}).then(function(data){
    ReactDOM.render(<NonFriendsList id="nonFriendsList" users={data} />, document.getElementById('friends-list'));
});
*/