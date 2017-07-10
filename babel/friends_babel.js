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

var Post = React.createClass({
  getDefaultProps: function(){
    return {msg: 'This is a test message. I did not know what to put so I am babeling about anything'};
  },
   render: function(){
       return (<div className="announcement">
                  <h3 className="prompter"><i>Some-User (11/13/2020 9:32pm): </i></h3>
                  <p className="prompter-msg">{this.props.msg}</p>
                </div>)
   }
});


var Announcement = React.createClass({
  postAnnouncement: function() {
    getJSON('announcements/post?content=' + this.refs.postData.value, function(err,data){
      if (err)
        console.log('error');
      console.log(data);
    });
    Posts.push(<Post msg={this.refs.postData.value} />);
    this.refs.postData.value = "";
    ReactDOM.render(<div><Announcement />{Posts}</div>,
                  document.getElementById('post-content'));
  },
  render: function(){
    return (
      <div>
       <textarea name="serverPost" id="serverPost" ref="postData" className="post"
          placeholder="Post an Anouncement..."></textarea><br/>
        <input className="btn btn-primary post-submit" type="button" value="Post" onClick={this.postAnnouncement} />
      </div>
      )
  }
});

var Content = React.createClass({
  getDefaultProps: function(){
    return {posts: []};
  },
  getInitialState: function(){
    return {Posts: this.props.posts}
  },
  render: function(){
    var Posts = this.state.Posts.map(function(post){
      return <Post msg={post.content} />
    });
    console.log(Posts);
    return (<div><Announcement />{Posts}</div>)
  }
});




getJSON('announcements/get', function(err,data){
  if (err)
    console.log(err);
  else
  {
    console.log()
    ReactDOM.render(<Content posts={data} />,
                  document.getElementById('post-content'));
  }
});
