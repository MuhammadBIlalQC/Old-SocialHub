var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
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

  getDefaultProps: function() {
    return {imgsrc: "placeholder.png", name: "Some Random User"};
  },
  
  getButton: function(){
    if (this.props.friend)
      return <h3 className="friend-bttn" name={this.props.name}>Friends!</h3>;
    if (this.props.request && this.props.sent)
      return <h3 className="friend-bttn" name={this.props.name}> Added! <span className="glyphicon glyphicon-ok"></span></h3>;
    if (this.props.request)
      return (
        <div className="inline">
          <a className="btn btn-default friend-bttn" name={this.props.name} onClick={this.props.click}>Reject</a>;
          <a className="btn btn-success friend-bttn" name={this.props.name} onClick={this.props.click}>Add Friend</a>;
        </div>
        )
    if (!this.props.sent)
      return <a className="btn btn-primary friend-bttn" name={this.props.name} onClick={this.props.click}>Add User</a>;
    else
      return <h3 className="friend-bttn" name={this.props.name}>Sent <span className="glyphicon glyphicon-ok"></span></h3>;
  },
  
  testing: function(e){
    e.preventDefault();
  },
  
  render: function() {
    return (
        <div className="friends">
            <img src={this.props.imgsrc} className="friend-img" />
            <label className="friend-name" >{this.props.name}</label>
            {this.getButton()}
         </div>
      )
  }
});
var UserList = React.createClass({
  getDefaultProps: function() {
    return {users : [], request: false};
  },
  setUsers: function(){
    this.setState({users: this.props.users});
  },

 addFriend: function(e){
   var Users = this.state.users;
   var friend = e.target.name;
   for (var i = 0; i < Users.length; i++)
   {
     if (friend == Users[i].name)
      {
        Users[i] = {name: Users[i].name, imgsrc: Users[i].imgsrc, sent: true};
        getJSON('friends/add?add=' + friend, function(err,data){
          if(err)
            console.log('error sending request');
          else
            console.log(data);
        });
        this.setState({users: Users});
        break;
      }
   }
 },
  acceptFriend: function(e){
    var Users = this.state.users;
   var friend = e.target.name;
   for (var i = 0; i < Users.length; i++)
   {
     if (friend == Users[i].name)
      {
        Users[i] = {name: Users[i].name, imgsrc: Users[i].imgsrc, sent: true};
        getJSON('friends/acceptrequest?friend=' + friend, function(err,data){
          if(err)
            console.log('error sending request');
          else
            console.log(data);
        });
        this.setState({users: Users});
        break;
      }
   }
  },
  
  getUsers: function(){
   if (!this.state)
    return this.props.users;
   return this.state.users;
 },
  render: function() {
    this.addFriend = this.addFriend.bind(this);
    this.acceptFriend = this.acceptFriend.bind(this);
    let self = this;
    var nonFriendsList = this.getUsers().map(function(friend){
      let friendBttn = friend.acceptType ? self.acceptFriend : self.addFriend;
      return (<li className="inline" ><User name={friend.name} 
                click={friendBttn} imgsrc={'http://localhost:3000/' + friend.imgsrc} 
                request={friend.request} sent={friend.sent} acceptType={friend.accept} friend={friend.friend} /> </li>)
    });
    return (
      <div onLoad={this.setUsers}>
        <h2>{this.props.heading}</h2>
        <ul>
          {nonFriendsList}
        </ul>
        <hr />
      </div>
      )
  }
});



getJSON('/friends/allfriends', function(err,data){
   if (err)
       console.log('error');
    else
    {
      if(data.length != 0)
        ReactDOM.render(<UserList heading="Your Friends" id="friendsList" users={data} />, document.getElementById('friends-list'));
      else 
        ReactDOM.render((
            <div>
              <h1>Your Friends</h1>
              <h3 className="gray" >Uh oh. Looks like you have no friends yet. Please add friends below! </h3>
            </div>
          ), document.getElementById('friends-list'));

    }
});


getJSON('/allusers', function(err,data){
   if (err)
       console.log('error');
    else
      if(data.length != 0)
        ReactDOM.render(<UserList heading="Add Friends" id="nonFriendsList" users={data} />, document.getElementById('nonFriends-list'));
});
getJSON('/friends/sentrequests', function(err,data){
   if (err)
       console.log('error');
    else
      if(data.length != 0)
        ReactDOM.render(<UserList heading="Sent Requests" id="requestSent-list" users={data} />, document.getElementById('requestSent-list'));
});
getJSON('/friends/requests', function(err,data){
   if (err)
       console.log('error');
    else
        if(data.length != 0)
          ReactDOM.render(<UserList heading="Friend Requests" id="nonFriendsList" users={data} />, document.getElementById('requests'));
});

/*fetch("http://localhost:3000/allusers").then(function(res){
   return res.json(); 
}).then(function(data){
    ReactDOM.render(<NonFriendsList id="nonFriendsList" users={data} />, document.getElementById('friends-list'));
});
*/