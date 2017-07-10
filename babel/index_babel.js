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
var user = "Error gettign user";

getJSON('friends/getusername', function(err,data){
    if (err)
     console.log(err);
   else
      user=data;
  });

var Post = React.createClass({
  getDefaultProps: function(){
    return {msg: 'This is a test message. I did not know what to put so I am babeling about anything', user: 'Error getting User'};
  },
   render: function(){
     console.log('what the fuck');
       return (<div className="announcement">
                  <h3 className="prompter"><i>{this.props.user} <span className="date"> (11/13/2020 9:32pm):</span> </i></h3>
                  <p className="prompter-msg">{this.props.msg}</p>
                </div>)
   }
});


var Announcement = React.createClass({
    postAnnouncement: function() {

     document.getElementById('serverPost').value = "";
  },
  render: function(){
    return (
      <div>
       <textarea name="serverPost" id="serverPost" ref="postData" className="post"
          placeholder="Post an Anouncement..."></textarea><br/>
        <input className="btn btn-primary post-submit" type="button" value="Post" onClick={this.props.click} />
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
  postAnnouncement: function(){
     getJSON('announcements/post?content=' + document.getElementById('serverPost').value, function(err,data){
       if (err)
         console.log('error');
       console.log(data);
     });
    var Posts = this.state.Posts;
    Posts.unshift({user: user, content: document.getElementById('serverPost').value});
    this.setState({Posts: Posts})
  },
  render: function(){
    this.postAnnouncement = this.postAnnouncement.bind(this);
    var Posts = this.state.Posts.map(function(post){
      return <Post msg={post.content} user={post.user} />
    });
    return (<div><Announcement click={this.postAnnouncement} />{Posts}</div>)
  }
});



function updatePosts(){
  console.log('updated?')
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
};

updatePosts();
