const sql = require('mysql');
const jsonfile = require('jsonfile');
const fs = require('fs');

const db = {

    init: function(){
        this.cache = {};
        this.cache['admin'] = 'me';
        this.conn = sql.createConnection({
            host: 'localhost',
            user: 'root',
            pw: ''
        }),
       this.conn.connect(function(err){
            if (err)
                throw Error('could not connect');
        });

        this.conn.query('use test;', function(err){
            if(err)
                throw Error('Could not use database test.')
        });
    },
    addUser: function(req,res, commandAdd) {
        var self = this;
        let conn = this.conn;
        var user = commandAdd == null ? req.body.reg_username : commandAdd;
        var password = commandAdd == null ? req.body.reg_password : 'adminInserted';
        var email = commandAdd == null ? req.body.reg_email : '@adminInserted';
        conn.query('select * from accounts where usrname="'+user+'"', function(err,query_response){
            if( (query_response == '') )
            {
                conn.query('insert into accounts(usrname, pw, name) values("'+user+'", "' +password+'", "'+email+'")', function(err){
                    if(err)
                    {
                        res.type('text/html');
                        res.send('<html><body><h1>could not register =/ <a href="http://localhost:3000/signin">'
                              +'Back to login</a></h1></body></html>');
                    }
                    else
                    {
                        if (res != null)
                        {
                          res.cookie('uname', user);
                          res.type('text/html');
                        }
                        const file = 'data/friends/' + user;
                        var friends = {friends: [], friendRequests: [], requestsSent: [], announcements: []};
                        jsonfile.writeFile(file, friends, function(err){
                          if (err)
                            console.log('Error initializing friends list');
                        })
                        if (res != null)
                          res.send('<h1>You have registered Succesfully as ' + req.body.reg_username +
                              '<br><a href="http://localhost:3000/index">Click here to continue</a> ');
                    }
                  });
            }
            else
             {
                if (res != null)
                {
                  res.type('text/html');
                  res.send('<html><body><h3>Username already exists =/ <a href="http://localhost:3000/signin">'
                        +'Back to login</a></h3></body></html>');
                }
             }
        });
        var date = new Date()
        var time = date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();
        this.cache[user] = {lastActive: this.getTimeNow(), queue: []};
    },
    addFriend: function(req,res) {
      if(!req.cookies.uname || !req.query.add)
      {
          res.send({success: false, error: 'not logged in or incorrect request'});
          return;
      }
      var userPath = 'data/friends/' + req.cookies.uname;
      var friendPath = 'data/friends/' + req.query.add;

      if (fs.existsSync(friendPath))
      {
        var friend = jsonfile.readFileSync(friendPath);
        var user = jsonfile.readFileSync(userPath);
        var exists = false;
        for (var i = 0; i < user.requestsSent.length; i++)
          if (user.requestsSent[i] == req.query.add)
              exists = true;

        if (exists)
          res.send({success: false, error: 'friend request already pending'});
        else
        {
          friend.friendRequests.push(req.cookies.uname);
          jsonfile.writeFile(friendPath, friend, function(err){
            if(err)
              console.log('error adding friend');
          });
          user.requestsSent.push(req.query.add)
          jsonfile.writeFile(userPath, user, function(err){
              if(err)
                console.log(err);
          })
          res.send({success: true, error: 'none'});
        }
      }

      else
      {
        res.send({success: false, error: 'user does not exist'});
      }
    },
    allFriends: function(req,res){
        const friends = jsonfile.readFileSync('data/friends/' + req.cookies.uname).friends;
        var users = [];
        for (var i = 0; i < friends.length; i++)
            users.push({name: friends[i], imgsrc: 'placeholder.png', friend: true, sent: true, request: false, acceptType: false});
        res.send(users);
    },
    nonFriends: function(req,res){
        this.conn.query("select usrname from accounts", function(err,data){
            if(err)
                throw err;
            else
            {

                const user = jsonfile.readFileSync('data/friends/' + req.cookies.uname);
                const friends = user.friends;
                const requestsSent = user.requestsSent;
                var users = [];
                for (var i = 0; i < data.length; i++)
                {
                    var match = function(element){
                        if (element == data[i].usrname)
                            return true;

                    };
                    if (friends.find(match) || requestsSent.find(match)
                                || data[i].usrname == req.cookies.uname)
                        continue;
                    else
                        users.push({name: data[i].usrname, imgsrc: 'placeholder.png', friend: false, sent: false, request: false});
                };
            }
                res.send(users);
        });
    },
    seeRequests: function(req,res){
        var requestsSent = jsonfile.readFileSync('data/friends/' + req.cookies.uname).requestsSent;
        var users = [];
        for (var i = 0 ; i < requestsSent.length; i++)
            users.push({name: requestsSent[i], imgsrc: 'placeholder.png', friend: false, sent: true, request: false, acceptType: false});
        res.send(users);
    },
    seeFriendRequests: function(req,res){
        var friendRequests = jsonfile.readFileSync('data/friends/' + req.cookies.uname).friendRequests;
        var users = [];
        for (var i = 0 ; i < friendRequests.length; i++)
            users.push({name: friendRequests[i], imgsrc: 'placeholder.png', friend: false, sent: false, request: true, acceptType: true});
        res.send(users);
    },
    acceptFriendRequest: function(req,res){
        const userName = req.cookies.uname;
        const friendName = req.query.friend;

        const accept = true;
        if (!userName || !friendName)
        {
            res.send({success: false});
            return;
        }
        const friend = jsonfile.readFileSync('data/friends/' + friendName);
        const user = jsonfile.readFileSync('data/friends/' + userName);

        if (accept)
        {
           for (let i = 0; i < user.friendRequests.length; i++)
            {
                if (user.friendRequests[i] == friendName)
                {
                    user.friendRequests.splice(i,1);
                    user.friends.push(friendName);
                }
            }
            for (let i = 0; i < friend.requestsSent.length; i++)
            {
                if (friend.requestsSent[i] == userName)
                {
                    friend.requestsSent.splice(i,1);
                    friend.friends.push(userName);
                }
            }
            jsonfile.writeFile('data/friends/' + friendName, friend, function(err){
                if(err)
                    console.log('could not update friend:' + err);
            });
            //create a file with all messages between users
            var messageFile = userName < friendName ? userName + '-' + friendName : friendName + '-' + userName;
            var messagePath = 'data/messages/' + messageFile;
            var messages = [];
            jsonfile.writeFile(messagePath, messages, function(err){
              if (err)
                console.log(err + 'Error initializing message file');
            });
        }
        else {
            res.send('error sending info wtf');
        }
    },
    postAnnouncement: function(req,res){
      var user = jsonfile.readFileSync('data/friends/' + req.cookies.uname);
      var stamp = {Month: req.query.Month, Day: req.query.Day, Year: req.query.Year, Hour: req.query.Hour,
                      Minutes: req.query.Minutes, Milliseconds: req.query.Milliseconds};
      var content = req.query.content;
      var date = new Date();
      user.announcements.unshift({content: content, timePosted: stamp });
      jsonfile.writeFile('data/friends/' + req.cookies.uname, user, function(err){
        if (err)
          console.log('error saving announcements: ', err);
      })
      res.send({id: 'got it'});
    },
    getAnnouncement: function(req,res){
      var userName = req.cookies.uname
      var user = jsonfile.readFileSync('data/friends/' + userName);
      var userAnnoucements = user.announcements;
      var announcements = userAnnoucements.map(function(announ){
        return {user: userName, content: announ.content, date: announ.timePosted};
      });
      user.friends.forEach(function(friend){
        var friendAnnouncement = jsonfile.readFileSync('data/friends/' + friend).announcements;
        var posts = friendAnnouncement.map(function(post){
          return {user: friend, content: post.content, date: post.timePosted}
        })
        Array.prototype.push.apply(announcements, posts)
      });
      announcements.sort(function(a,b){
        var postA = '' + a.date.Year + '' + a.date.Month + '' + a.date.Day + '' + a.date.Hour + '' + a.date.Minutes;
        var postB = '' + b.date.Year + '' + b.date.Month + '' + b.date.Day + '' + b.date.Hour + '' + b.date.Minutes;
        if (postA > postB) //earlier posts go in the front of array
          return -1;
        else
          return 1;
      });
      res.send(announcements);
    },
    getUsername: function(req,res){
        res.send({user: req.cookies.uname});
    },
    sendMessage(req, res, srcUser, dstUser, msg) { //rename msg
      if (req != null)
      {
        srcUser = req.cookies.uname;
        dstUser = req.query.dstUser;
      }
      //if message file doesnt exist for somereason, create it

      var file = srcUser < dstUser ? srcUser + '-' + dstUser : dstUser + '-' + srcUser;
      var path = 'data/messages/' + file;
      if (!fs.existsSync(path))
      {
        jsonfile.writeFile(path, {}, function(err){
          if (err)
            console.log(err + 'Error initializing message file');
        });
      }
      if (this.cache[dstUser] == null)
        this.cache[dstUser] = {lastActive: '0', queue: []};
      var date = new Date();
      var time = date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString(); //instead of date.getHours()*10^n + date.getMinutes()*10^n-2 ...
      time = parseInt(time);
      const waitTime = 10000; //10 seconds
      var content = req != null ? req.query.msg : msg;
      var msg = {content: content, timeStamp: time, origin: srcUser}; //need time stamp and content msg
      this.cache[srcUser].lastActive = this.getTimeNow();
      if (this.cache[dstUser].lastActive + waitTime < this.getTimeNow())
        this.cache[dstUser].queue = []; //user not active -> reset queue
      else
        this.cache[dstUser].queue.push(msg);

      var messages = [];
      try
      {
        messages = jsonfile.readFileSync(path);
      }
      catch (err)
      {
        console.log(err);
      }
      if (msg == null)
        msg = req.query.message;
      messages.push(msg);
      jsonfile.writeFile(path, messages, function(err){
        if (err)
          console.log(err);
      })
      if (res != null)
        res.send({success: true});
    },
    fetchMessages(req, res, user){
      user = req != null ? req.cookies.uname : user;
      if (this.cache[user] == null)
        this.cache[user] = {lastActive: this.getTimeNow(), queue: []};
      if (req != null)
      {

        res.send({messages: this.cache[user].queue});
        this.cache[user].queue = [];
      }
      else
      {
        console.log(this.cache[user].queue);
        this.cache[user].queue = [];
      }
    },
    displayCache(user) {
      console.log(this.cache[user]);
    },
    getTimeNow() {
      var date = new Date();
      var hours = date.getHours().toString();
      hours = hours.length == 2 ? hours : '0' + hours;
      var minutes = date.getMinutes().toString();
      minutes = minutes.length == 2 ? minutes : '0' + minutes;
      var seconds = date.getSeconds().toString();
      seconds = seconds.length == 2 ? seconds : '0' + seconds;
      var timeNow =  hours + minutes + seconds;
      return parseInt(timeNow);
    },
    isActive(user) {
      const waitTime = 15; // in seconds
      timeNow = this.getTimeNow();
      if (this.cache[user] == null)
        return -1;
      if (this.cache[user].lastActive + waitTime > timeNow)
        return 1;
      return 0;
    }
}

module.exports = db;
