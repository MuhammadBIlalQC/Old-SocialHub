var Post = React.createClass({
  getDefaultProps: function(){
    return {msg: 'This is a test message. I did not know what to put so I am babeling about anything'};
  },
   render: function(){
       var size = document.body.clientWidth > 700 ? 'normal' : 'small';
       return (<div className="announcement">
                  <h3 className="prompter"><i>Some-User (11/13/2020 9:32pm): </i></h3>
                  <p className="prompter-msg">{this.props.msg}</p>
                </div>)
   } 
});

var Posts = [<Post />,
              <Post />, <Post />, <Post />, <Post />, <Post />,<Post />];

var Announcement = React.createClass({
  postAnnouncement: function() {
    Posts.push(<Post msg={this.refs.postData.value} />);
    this.refs.postData.value = "";
    ReactDOM.render(<div><Announcement />{Posts.reverse()}</div>, 
                  document.getElementById('post-content'));
  },
  render: function(){
    return (
      <div>
       <textarea ref="postData" className="post"
          placeholder="Post an Anouncement..."></textarea><br/>
        <input className="btn btn-primary post-submit" type="button" value="Post" onClick={this.postAnnouncement} />
      </div>
      )
  }
});





ReactDOM.render(<div><Announcement />{Posts.reverse()}</div>, 
                  document.getElementById('post-content'));