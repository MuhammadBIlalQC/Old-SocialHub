const friends = ['Riven', 'Jax', 'Nasus', 'Darius', 'Talon']; //example friends

class FriendsButton extends React.Component {
  constructor(props){
    super(props);
    this.buttonStyle = {
      position: 'fixed',
      bottom: '0px',
      right: '0px',
      width: '200px',
      height: '50px',
      backgroundColor: '#00b0ff',
      color: 'white',
      borderTopLeftRadius: '30px',
    };

  }
  render() {
    return <button style={this.buttonStyle} onClick={this.props.onButtonClick} >Friends</button>;
  }
}
class FriendLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hover: false};
    this.friendStyle = {
      width: '197px' ,
      height: '35px',
      //backgroundColor: '#e9ebee',
      color: '#00b0ff',
      textAlign: 'right',
      paddingRight: '40px',
      margin: '0px',
      fontSize: '18px',
    };
  }

  toggleHighlight(e) {
    e.target.style.backgroundColor = 'white';
  }

  render() {
    return <a  className="btn btn-default" style={this.friendStyle} name={this.props.user} onClick={this.props.click} onMouseEnter={this.toggleHighlight} > {this.props.user} </a>

  }
}
class FriendsList extends React.Component {
  constructor(props){
    super(props);
    this.listStyle = {
      position: 'fixed',
      bottom: '50px',
      right: '0px',
      margin: '0px',
      padding: '0px',
      border: '1px solid',
    };
  }

  render() {
    if (this.props.show == true)
      return (<ul style={this.listStyle}>
                <li><FriendLabel user="FriendA" click={this.props.click} /></li>
                <li><FriendLabel user="FriendB" click={this.props.click} /></li>
                <li><FriendLabel user="FriendC" click={this.props.click} /></li>
              </ul>)
    else
      return <div></div>;
  }
}

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.unToggledStyle = {
      marginRight: '5px',
      width: '150px',
      height: '40px',
      position: 'fixed',
      right: this.props.position + 'px',
      bottom: '0px',
      backgroundColor: '#00b0ff',
      color: 'white',
      borderRadius: '15px 15px 0px 0px',
    }
  }

  render() {
    return <button style={this.unToggledStyle} > {this.props.user} </button>
  }
}


class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {toggle: false, chatHeads: []};
    this.togglePanel = this.togglePanel.bind(this);
    this.openChatHead = this.openChatHead.bind(this);
  }

  togglePanel(e) {
    const toggle = !this.state.toggle;
    this.setState({toggle: toggle});
    if (toggle)
      e.target.style.borderTopLeftRadius = '0px';
    else
      e.target.style.borderTopLeftRadius = '30px';

  }

  openChatHead(e) {
    var chatHeads = this.state.chatHeads;
    if (chatHeads == null)
      chatHeads = [];
    var found = chatHeads.find(function(chat){
      if (chat == e.target.name)
        return true;
    });
    if (found == null) // if not found
    {
      chatHeads.push(e.target.name);
      this.setState({chatHeads: chatHeads});
    }
  }

  render() {
    var pos = 50;
    var chatHeads = this.state.chatHeads.map(function(head){
      pos += 150;
      return <Chat position={pos} user={head}/>
    });
    return (<div>
              <FriendsButton onButtonClick={this.togglePanel} />
              <FriendsList show={this.state.toggle} click={this.openChatHead}/>
              {chatHeads}
            </div>)
  }
}


ReactDOM.render(<Panel />, document.getElementById('friends-Panel'));
