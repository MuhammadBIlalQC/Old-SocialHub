
/*fetch("http://localhost:3000/add").then(function(res){
   return res.json(); 
}).then(function(data){
    console.log(data);
});*/

var allUsers = [{
    "name": "cfox",
    "imgsrc": "placeholder.png"
  },
  {
    "name": "cfox1",
    "imgsrc": "placeholder.png"
  },
  {
    "name": "cfox2",
    "imgsrc": "placeholder.png"
  }];
var Friend = React.createClass({

  getDefaultProps: function() {
    return {imgsrc: "placeholder.png", name: "Some Random User"};
  },
  render: function() { 
    return (
        <div className="friends">
            <img src={this.props.imgsrc} className="friend-img" />
            <div>{this.props.name}</div>
            <a className="btn btn-primary friend-bttn">Add User</a>
         </div>
      )
  }
});

var FriendsList = React.createClass({
    getInitialState: function getDefaultState() {
    return { users: allUsers };
  },
  componentDidMount: function(){
        this.setState({users: allUsers});
    },
  render: function() {
    var friendsList = this.state.users.map(function(friend){
      return <Friend name={friend.name} imgsrc={'http://localhost:3000/' + friend.imgsrc}/>
    });
    return (
      <div>
        {friendsList}
      </div>
      )
  }
});

ReactDOM.render(<FriendsList />, document.getElementById('friends-list'));