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

  class AnnouncementPost extends React.Component {

    constructor(props) {
      super(props);
    } // end of constructor()

    render() {
      return (
        <div>
         <textarea id="AnnouncementPost" className="post"
            placeholder="Post an Anouncement..."></textarea><br/>
          <input className="btn btn-primary post-submit" type="button" value="Post" onClick={this.props.click} />
        </div>
            )
    } //end of render()

  } //end of class

  class Announcement extends React.Component {
    constructor(props) {
      super(props);
      this.getDate = this.getDate.bind(this);
      this.state = {date: this.getDate()};
    } // end of constructor

    getDate() {
      if (!this.props.date)
        return 'error getting date';
      const date = this.props.date;
      return  '' + date.Month + '/' + date.Day + '/' + date.Year + ' ' + date.Hour + ':' + (date.Minutes < 10 ? '0' : '') + date.Minutes  +' am/pm';

    } //end of getDate();

    render() {
      return (
        <div className="announcement">
          <h3 className="prompter"><i>{this.props.user} ({this.getDate()}): </i></h3>
          <p className="prompter-msg">{this.props.msg}</p>
        </div>
      )
    } //end of render()
  } //end of class

  class Content extends React.Component {

    constructor(props){
      super(props);
      this.state = {Announcements: [], users: ''};
      const self = this;
      getJSON('announcements/get', function(err,data){
        if (err)
          console.log(err);
        else
        {
          var posts = data.map(function(post){
            return <Announcement user={post.user} date={post.date} msg={post.content} />
          });
          self.setState({Announcements: posts});
        }

      });

      getJSON('friends/getusername', function(err,data){
        if (err)
          console.log('could not fetch username');
        else
        {
          self.setState({user: data.user});
        }
      });

      this.postAnnouncement = this.postAnnouncement.bind(this);
    } //end of constructor

    postAnnouncement() {
      const AnnouncementPost = document.getElementById('AnnouncementPost');
      const userMessage = document.getElementById('AnnouncementPost').value;
      AnnouncementPost.value = "";
      console.log(this.state.user);
      var date = new Date();
      const stamp = {Month: date.getMonth() + 1, Day: date.getDate(), Year: date.getYear()+1900, Hour: date.getHours()%12,
                                  Minutes: date.getMinutes(), Seconds: date.getSeconds(), Milliseconds : date.getMilliseconds()};
      const URL = 'announcements/post?content=' + userMessage + '&Month=' + stamp.Month + '&Day=' + stamp.Day + '&Year=' + stamp.Year
                        + '&Hour=' + stamp.Hour + '&Minutes=' + stamp.Minutes + '&Seconds=' + stamp.Seconds + '&Milliseconds=' + stamp.Milliseconds;
      getJSON(URL, function(err,data){
        if (err)
          console.log('error');
        console.log(data);
      });

      $('.announcement').animate({
        top: '+=300px'
      });

      const posts = this.state.Announcements;
      posts.unshift(<Announcement user={this.state.user} msg={userMessage} date={stamp} />);
      const self = this;
      setTimeout(function(){
        $('.announcement').animate({
          top: '20px'
        });
        self.setState({Announcements: posts});
      }, 400);
    } //end of postAnnouncement()

    render() {
      return (
        <div>
          <AnnouncementPost click={this.postAnnouncement} />
          {this.state.Announcements}
        </div>
      )
    } //end of render()
  } //end of class

  ReactDOM.render(<Content />, document.getElementById('post-content'));
