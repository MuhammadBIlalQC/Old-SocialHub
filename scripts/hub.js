class HubLink extends React.Component {
  constructor(props){
    super(props);
    this.whiteColor = {
      color: 'white',
      marginTop: '5px',
      textAlign: 'center',
    };
    this.hoverIn = this.hoverIn.bind(this);
    this.hoverOut = this.hoverOut.bind(this);
    this.glyphStyle = {
      marginRight: '5px',
    };
  }

  hoverIn(e) {
    e.target.style.color = 'black';
  }
  hoverOut(e) {
    e.target.style.color = 'white';
  }
  render() {

    return (
              <a href={this.props.link} className={this.props.classname} style={this.whiteColor} onMouseEnter={this.hoverIn} onMouseLeave={this.hoverOut} >
                <span className={this.props.glyph} style={ this.glyphStyle }></span>
                {this.props.text}
              </a>
          )
  }
}

HubLink.defaultProps = {
  classname: "",
  glyph: "",
  text: "",
  link: "#",
};

class HubPanel extends React.Component {

  constructor(props) {
    super(props);
    this.containerStyle = {
      backgroundColor: '#00b0ff',
      color: 'white',
      fontFamily: "'Josefin Sans', sans-serif",
      fontSize: '20px',
    }

  }

  render() {
    return (
      <nav className="navbar navbar-inverse" style={this.containerStyle}>
        <div classname="container-fluid">
        <div className="navbar-header">
        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
        <HubLink classname="navbar-brand" text="SocialHub" />
      </div>
      <div className="collapse navbar-collapse" id="myNavbar" >
        <ul className="nav navbar-nav">
          <li><HubLink link="" text="Hub" /></li>
          <li><HubLink link="http://localhost:3000/index" text="Newsfeed" /> </li>
          <li><HubLink link="http://localhost:3000/friends" text="Friends" /></li>
          <li><HubLink link="" text="Message Board" /></li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li><HubLink link="" text="Account" glyph="glyphicon glyphicon-user" /></li>
          <li><HubLink link="http://localhost:3000/signout" text="Sign Out" glyph="glyphicon glyphicon-log-in" /></li>
        </ul>
      </div>
    </div>
  </nav>
)
  }
}

ReactDOM.render(<HubPanel />, document.getElementById('hub'));
console.log('logged');
