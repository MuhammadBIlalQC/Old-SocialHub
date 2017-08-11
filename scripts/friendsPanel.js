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
    this.state = {toggle: false};
    this.toggleChat = this.toggleChat.bind(this);
    this.unToggledStyle = {
      marginRight: '5px',
      width: '250px',
      height: '40px',
      position: 'fixed',
      right: this.props.position + 'px',
      bottom: '0px',
      backgroundColor: '#00b0ff',
      color: 'white',
      borderRadius: '15px 15px 0px 0px',
    }

    this.toggledTextOutput = {
      position: 'fixed',
      marginRight: '5px',
      marginTop: '0px',
      width: '250px',
      bottom: '30px',
      height: '270px',
      right: this.props.position + 'px',
      border: '1px solid black',
      borderTop: '2px',
      overflowY: 'scroll',
      padding: '5px',
    }
    this.toggledTextInput = {
      position: 'fixed',
      marginRight: '5px',
      marginTop: '0px',
      width: '250px',
      bottom: '0px',
      height: '30px',
      right: this.props.position + 'px',
      border: '1px solid black',
      paddingLeft: '5px',
    }
    this.labelStyle = {
      position: 'fixed',
      marginRight: '5px',
      marginBottom: '0px',
      width: '250px',
      bottom: '301px',
      right: this.props.position + 'px',
      backgroundColor: '#00b0ff',
      color: 'white',
      height: '30px',
      fontSize: '17px',
      paddingLeft: '10px',
      paddingTop: '5px',
      paddingBottom: '5px',
    }
    this.closeBttn = {
      padding: '0px',
      float: 'right',
      height: '100%',
      backgroundColor: 'black',
    }
    this.messages = {
      padding: '0px',
      display: 'block',
      margin: '0px'
    }
  }

  toggleChat(e) {
    this.setState({toggle: !this.state.toggle});
  }

  close(e) {
    console.log('closing');
  }
  render() {
    if (this.state.toggle)
      return (<div style={this.toggledStyle}>
                <label style={this.labelStyle} onClick={this.toggleChat} >{this.props.user} <button className="glyphicon glyphicon-remove" name={this.props.user} style={this.closeBttn} onClick={this.props.onClose}></button></label>
                <div style={this.toggledTextOutput}>
                  <Message msg="hello world! what is going on with u nowadays? i am not doing much" origin={true}/>
                  <Message msg="hello world!" origin={false} />
                  <Message msg="what's going in?" origin={false} />
                </div>
                <input type="text" style={this.toggledTextInput} placeholder="type message here..." />
              </div>)
    else
      return <button style={this.unToggledStyle} onClick={this.toggleChat}> {this.props.user} </button>
  }
}

class Message extends React.Component {
  constructor(props){
    super(props);
    this.messageRight = {
      backgroundColor: '#00b0ff',
      borderRadius: '15px 15px 15px 15px',
      maxWidth: '80%',
      color: 'white',
      padding: '8px',
      float: 'right',
    };
    this.messageLeft = {
      backgroundColor: '#474e5d',
      borderRadius: '15px 15px 15px 15px',
      maxWidth: '80%',
      color: 'white',
      padding: '8px',
      float: 'left',
    }
    this.messageHolder = {
      width: '100%',
    }
  }

  render() {
    if (this.props.origin)
      return (<div style={this.messageHolder}>
                <p style={this.messageRight}> {this.props.msg} </p>
              </div>)
    else
      return (<div style={this.messageHolder}>
                <p style={this.messageLeft}> {this.props.msg} </p>
              </div>)
  }
}


class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {toggle: false, chatHeads: []};
    this.togglePanel = this.togglePanel.bind(this);
    this.openChatHead = this.openChatHead.bind(this);
    this.closeChatHead = this.closeChatHead.bind(this);
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

  closeChatHead(e) {
    var chatHeads = this.state.chatHeads;
    var pos = chatHeads.indexOf(e.target.name);
    chatHeads.splice(pos, 1);
    console.log(chatHeads);
    this.setState({chatHeads: chatHeads});
  }
  render() {
    var pos = 50;
    var closeChatHead = this.closeChatHead;
    var chatHeads = this.state.chatHeads.map(function(head){
      pos += 260;
      return <Chat position={pos} user={head} onClose={closeChatHead} />
    });
    return (<div>
              <FriendsButton onButtonClick={this.togglePanel} />
              <FriendsList show={this.state.toggle} click={this.openChatHead}/>
              {chatHeads}
            </div>)
  }
}


ReactDOM.render(<Panel />, document.getElementById('friends-Panel'));
