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
                        var friends = {friends: [], friendRequests: []};
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
               console.log('query resp2: ' + query_response)
                res.type('text/html');
                res.send('<html><body><h3>Username already exists =/ <a href="http://localhost:3000/signin">'
                      +'Back to login</a></h3></body></html>');
             }
        });
    },
    addFriend: function(req,res) {
      var user = req.cookies.uname;
      var friend = req.query.add;

      var friendPath = 'data/friends/' + friend;
      if (fs.existsSync(friendPath)) //if the friend exists
      {
        var friends = jsonfile.readFileSync(friendPath); //get his file
        var exists = false;
        for (var i = 0; i < friends.friendRequests.length; i++) //if he exists in his friend requests
          if (friends.friendRequests[i] == user)
              exists = true;

        if (exists) // send success false since cannot have duplicate requests
          res.send({success: false, error: 'friend request already pending'});
        else
        {
          friends.friendRequests.push(user);
          jsonfile.writeFile(friendPath, friends, function(err){
            if(err)
              console.log('error adding friend');
          });
          res.send({success: true, error: 'none'});
        }
      }

      else
      {
        res.send({success: false, error: 'user does not exist'});
      }
    },
    
    allUsers: function(req,res){
        this.conn.query("select usrname from accounts", function(err,data){
            if(err)
            {
                throw err;
            }
            else 
                {
                    var users = [];
                    for (var i = 0; i < data.length; i++)
                        users.push({name: data[i].usrname, imgsrc: 'placeholder.png'})
                    res.send(users);
                }
        })
    }
}

module.exports = db;
