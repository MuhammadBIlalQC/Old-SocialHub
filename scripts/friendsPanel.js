
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
                <li><FriendLabel user="h1" click={this.props.click} /></li>
                <li><FriendLabel user="pandabear" click={this.props.click} /></li>
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
      marginTop: '0px',
      width: '202px',
      bottom: '0px',
      height: '30px',
      right: (this.props.position+53) + 'px',
      border: '1px solid black',
      paddingLeft: '5px',
      fontSize: '16px',
    }
    this.sendButton = {
      position: 'fixed',
      marginRight: '5px',
      marginTop: '0px',
      width: '50px',
      bottom: '0px',
      height: '30px',
      right: this.props.position + 'px',
      border: '1px solid black',
      backgroundColor: '#00b0ff',
      fontSize: '15px',
    }
    this.labelStyle = {
      position: 'fixed',
      marginRight: '5px',
      marginBottom: '0px',
      width: '251px',
      bottom: '301px',
      right: this.props.position + 'px',
      backgroundColor: '#00b0ff',
      color: 'white',
      height: '30px',
      fontSize: '17px',
      lineHeight: '33px',
      paddingLeft: '10px',
      borderRadius: '15px 15px 0px 0px',
    }
    this.closeBttn = {
      width: '35px',
      float: 'right',
      height: '100%',
      backgroundColor: 'black',
      border: 'black 1px',
    }
    this.messages = {
      padding: '0px',
      display: 'block',
      margin: '0px'
    }
    this.messageEntered = this.messageEntered.bind(this);
  }

  toggleChat(e) {
    this.setState({toggle: !this.state.toggle});
  }
  messageEntered(e) {
    if (e.key == 'Enter')
      this.props.sendText(e);
  }
  render() {
    if (this.state.toggle)
    {
      var Messages;
      if (this.props.messages == null)
        Messages = [];
      else
        {
          const props = this.props;
          Messages = this.props.messages.map(function(message){
                console.log('Messages Retrieved: ' + message);

                const origin = ("" + message.origin) == props.user ? false : true;
                console.log(message.origin);
                return <Message msg={"" + message.content} origin={origin} />
                //return <Message msg={message.content} origin={origin} />
            });
        }
        return (<div style={this.toggledStyle}>
                  <label style={this.labelStyle} onClick={this.toggleChat}>{this.props.user}
                    <button className="glyphicon glyphicon-remove" name={this.props.user} style={this.closeBttn} onClick={this.props.onClose}>
                    </button>
                  </label>
                  <div style={this.toggledTextOutput}>
                    {Messages}
                  </div>
                  <input type="text" id={this.props.user + 'InputChat'} name={this.props.user} style={this.toggledTextInput} placeholder="type message here..." onKeyPress={this.messageEntered}/>
                  <button style={this.sendButton} name={this.props.user} onClick={this.props.sendText} >
                    Send
                  </button>
                </div>)
    }
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
      fontSize: '15px',
    };
    this.messageLeft = {
      backgroundColor: '#474e5d',
      borderRadius: '15px 15px 15px 15px',
      maxWidth: '80%',
      color: 'white',
      padding: '8px',
      float: 'left',
      fontSize: '15px',
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
    console.log(<Chat />)
    this.processMessages = this.processMessages.bind(this);
    this.ws = new WebSocket("ws://localhost:3000/messages");
    let ws = this.ws;
    ws.onopen = function(e) {
      ws.send('&&hello&&');
    };
    ws.onmessage = this.processMessages;

    this.state = {toggle: false, chatHeads: [], chatMessages: {}};
    this.togglePanel = this.togglePanel.bind(this);
    this.openChatHead = this.openChatHead.bind(this);
    this.closeChatHead = this.closeChatHead.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  processMessages(e) {
    const data = JSON.parse(e.data);
    const messages = data.messages;
    if (messages.length != 0)
    {

      const chatMessages = this.state.chatMessages;
      const chatHead = data.dstUser;
        messages.forEach(function(message){
          const msgSrc = chatHead == null ? message.origin : chatHead;
          if (chatMessages[msgSrc] == null)
            chatMessages[msgSrc] = [];
          chatMessages[msgSrc].push(message);
        });
      this.setState({chatMessages: chatMessages});
    }
    let ws = this.ws;
    setTimeout(function(){
      ws.send('&&hello&&');
    }, 1000);
  };

  sendMessage(e) {
    const user = e.target.name;
    const input = document.getElementById(user + 'InputChat');
    const message = input.value;
    input.value = "";

    const chatMessages = this.state.chatMessages;
    if (chatMessages[user] == null)
      chatMessages[user] = [];
    chatMessages[user].push({content: message, origin: ""});
    this.setState({chatMessages: chatMessages});
    const sendMessage = {message: message, dstUser: user};
    this.ws.send(JSON.stringify(sendMessage));
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
      this.ws.send("&&"+e.target.name+"&&");
    }
  }

  closeChatHead(e) {
    var chatHeads = this.state.chatHeads;
    var pos = chatHeads.indexOf(e.target.name);
    chatHeads.splice(pos, 1);
    this.setState({chatHeads: chatHeads});
  }
  render() {
    var pos = 50;
    const closeChatHead = this.closeChatHead;
    const chatMessages = this.state.chatMessages;
    const sendMessage = this.sendMessage;
    var chatHeads = this.state.chatHeads.map(function(head){
      pos += 260;
      if (chatMessages[head] == null)
        chatMessages[head] = [];
      return <Chat position={pos} user={head} onClose={closeChatHead} messages={chatMessages[head]} sendText={sendMessage} />
    });
    return (<div>
              <FriendsButton onButtonClick={this.togglePanel} />
              <FriendsList show={this.state.toggle} click={this.openChatHead}/>
              {chatHeads}
            </div>)
  }
}


ReactDOM.render(<Panel />, document.getElementById('friends-Panel'));

// var ws = new WebSocket("ws://localhost:3000/fetch");
// ws.onopen = function(e) {
//   ws.send('hello server');
// }
// ws.onmessage = function(e) {
//   console.log(e.data);
// }
