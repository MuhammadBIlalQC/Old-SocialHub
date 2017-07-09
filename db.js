const sql = require('mysql');
const jsonfile = require('jsonfile');
const fs = require('fs');

const db = {

    init: function(){
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
    addUser: function(req,res) {
        let conn = this.conn;
        conn.query('select * from accounts where usrname="'+req.body.reg_username+'"', function(err,query_response){
            if( (query_response == '') )
            {
                conn.query('insert into accounts(usrname, pw, name) values("'+req.body.reg_username+'", "' +req.body.reg_password+'", "'+req.body.reg_email+'")', function(err){
                    if(err)
                    {
                        res.type('text/html');
                        res.send('<html><body><h1>could not register =/ <a href="http://localhost:3000/signin">'
                              +'Back to login</a></h1></body></html>');
                    }
                    else
                    {
                        res.cookie('uname', req.body.reg_username);
                        res.type('text/html');
                        const file = 'data/friends/' + req.body.reg_username;
                        var friends = {friends: [], friendRequests: [], requestsSent: [], announcements: []};
                        jsonfile.writeFile(file, friends, function(err){
                          if (err)
                            console.log('Error initializing friends list');
                        })
                        res.send('<h1>You have registered Succesfully as ' + req.body.reg_username +
                            '<br><a href="http://localhost:3000/index">Click here to continue</a> ');
                    }
                  });
            }
            else
             {
                res.type('text/html');
                res.send('<html><body><h3>Username already exists =/ <a href="http://localhost:3000/signin">'
                      +'Back to login</a></h3></body></html>');
             }
        });
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

        //const accept = req.query.accept;

        const accept = true;
        if (!userName || !friendName)
        {
            console.log('sending back');
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
            jsonfile.writeFile('data/friends/' + userName, user, function(err){
                if(err)
                console.log('could not update user: ' + err);
            });
        }
        else {
            res.send('error sending info wtf');
        }
    },
    postAnnouncement: function(req,res){
      var user = jsonfile.readFileSync('data/friends/' + req.cookies.uname);
      console.log('---------------------');
      console.log(req.query.content);
      user.announcements.unshift(req.query.content);
      console.log(user.announcements);
      jsonfile.writeFile('data/friends/' + req.cookies.uname, user, function(err){
        if (err)
          console.log('error saving announcements: ', err);
      })
      res.send({id: 'got it'});
    },
    getAnnouncement: function(req,res){
      var userAnnoucements = jsonfile.readFileSync('data/friends/' + req.cookies.uname).announcements;
      var announcements = userAnnoucements.map(function(announ){
        return {content: announ};
      });
      res.send(announcements);
    }
}

module.exports = db;
