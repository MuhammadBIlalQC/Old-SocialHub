"use strict";

/*fetch("http://localhost:3000/add").then(function(res){
   return res.json(); 
}).then(function(data){
    console.log(data);
});*/

var allUsers = [{
  "name": "cfox",
  "imgsrc": "placeholder.png"
}, {
  "name": "cfox1",
  "imgsrc": "placeholder.png"
}, {
  "name": "cfox2",
  "imgsrc": "placeholder.png"
}];
var Friend = React.createClass({
  displayName: "Friend",


  getDefaultProps: function getDefaultProps() {
    return { imgsrc: "placeholder.png", name: "Some Random User" };
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "friends" },
      React.createElement("img", { src: this.props.imgsrc, className: "friend-img" }),
      React.createElement(
        "div",
        null,
        this.props.name
      ),
      React.createElement(
        "a",
        { className: "btn btn-primary friend-bttn" },
        "Add User"
      )
    );
  }
});

var FriendsList = React.createClass({
  displayName: "FriendsList",

  getInitialState: function getDefaultState() {
    return { users: allUsers };
  },
  componentDidMount: function componentDidMount() {
    this.setState({ users: allUsers });
  },
  render: function render() {
    var friendsList = this.state.users.map(function (friend) {
      return React.createElement(Friend, { name: friend.name, imgsrc: 'http://localhost:3000/' + friend.imgsrc });
    });
    return React.createElement(
      "div",
      null,
      friendsList
    );
  }
});

ReactDOM.render(React.createElement(FriendsList, null), document.getElementById('friends-list'));