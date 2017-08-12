const app = require('express')();
const fs = require('fs');
const bodyParser = require('body-parser');
const cookies = require('cookie-parser')('this-is-a-signed-cookie');
const db = require('./db.js');
const readline = require('readline');
const readlineSync = require('readline-sync');
const ws = require('express-ws')(app);
db.init();


app.use(cookies);
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/', function(req,res){
   res.redirect('/signin');
});
app.get('/signin', function(req,res){
    if(!req.cookies.uname)
        fs.readFile('pages/signin.html', function(err,data){
            res.status(200);
            res.type('text/html');
            res.send(data);
        });
    else
    {
        res.redirect('/index')
    }
});

app.get('/signout', function(req,res){
  res.clearCookie('uname');
  res.redirect('/signin');
});
app.get('/findfriends', function(req,res){
    if(!req.cookies.uname)
        res.redirect('/signin')
    else
        {
    fs.readFile('pages/friends.html', function(err,data){
        res.status(200);
        res.type('text/html');
        res.send(data);
    });
        }
})
app.get('/friends/add', function(req,res){
  db.addFriend(req,res)
});
app.get('/friends/sentrequests', function(req,res){
    db.seeRequests(req,res);
})
app.get('/friends/requests', function(req,res){
    db.seeFriendRequests(req,res);
});
app.get('/friends/acceptrequest', function(req,res){
    db.acceptFriendRequest(req,res);
});
app.get('/allusers', function(req,res){
    db.nonFriends(req,res);
});
app.get('/friends/allfriends', function(req,res){
    db.allFriends(req,res);
});
app.get('/friends/getusername', function(req,res){
  db.getUsername(req,res);
})
app.post('/signin', function(req, res){
    res.cookie('uname', req.body.username);
    res.redirect('/index');

});

app.post('/register', function(req,res){
     db.addUser(req,res);
});


app.get('/index', function(req,res){
    if(!req.cookies.uname)
        res.redirect('/signin')
    else
    {
        fs.readFile('pages/index.html', function(err,data){
            res.status(200);
            res.type('text/html');
            res.send(data);
        });
    }
});

app.get('/announcements/post', function(req,res){
    db.postAnnouncement(req,res);
});
app.get('/announcements/get', function(req,res){
    db.getAnnouncement(req,res);
});
// app.get('/messages/fetch', function(req,res) {
//   db.fetchMessages(req,res);
// });
// app.get('/messages/send', function(req,res){
//   db.sendMessage(req,res);
// });

app.ws('/messages', function(ws, req){
  ws.on('message', function(msg){
    if (msg == '&&hello&&')
      db.fetchMessages(ws,req);
    else if (msg[0] == "&" && msg[1] == "&")
    {
      console.log('Retriving data for: ' + msg.substring(2, msg.length-2));
      db.loadAllMessages(ws,req,req.cookies.uname, msg.substring(2, msg.length-2))
    }
    else //assumed to be sending a message
    {
      console.log('sendMessage() abouta be called');
      const data = JSON.parse(msg);
      console.log("" + data);
      
      db.sendMessage(ws,req, req.cookies.uname, data.dstUser, data.message);
    }
  });
});
//static files
app.get('/style.css', function(req,res){
   fs.readFile('stylesheets/style.css', function(err,data){
       res.send(data);
   })
});
app.get('/friends.css', function(req,res){
   fs.readFile('stylesheets/friends.css', function(err,data){
       res.send(data);
   })
});
app.get('/bear.png', function(req,res){
   fs.readFile('images/bear.png', function(err,data){
       res.send(data);
   });
});
app.get('/placeholder.png', function(req,res){
    fs.readFile('images/placeholder.png', function(err,data){
       res.send(data);
   });
});
app.get('/index.js', function(req,res){
    fs.readFile('scripts/index.js', function(err,data){
       res.send(data);
   });
});
app.get('/friends.js', function(req,res){
    fs.readFile('scripts/friends.js', function(err,data){
        if(err)
            console.log(err);
        else
            res.send(data);
   });
});
app.get('/friendsPanel.js', function(req,res){
    fs.readFile('scripts/friendsPanel.js', function(err,data){
       res.send(data);
   });
});
app.listen(3000);


console.log('Listening on port 3000...');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
process.stdout.write("Enter Command: ");
rl.on('line', function (command) {
  command = command.split(" ");
  if (command.length < 1)
  {
    console.log('\tno commands given print usage.');
  }
  switch(command[0])
  {
    case "add":
      if (command.length < 2)
        console.log("\tNo Users To Insert");
      else
      {
        for (var i = 1; i < command.length; i++)
          {
            console.log('\tAdding ' + command[i] + '...');
            db.addUser(null, null, command[i]);
          }
      }
      break;
    case "help":
      console.log('\thelp requested. printing usage');
      break;
    case "cache":
      if (command.length != 2)
        console.log("cache <user>");
      else
        db.displayCache(command[1]);
      break;
    case "message":
      if (command.length != 4)
        console.log("\tNot enough arguments given.");
      else
      {
        db.sendMessage(null, null, command[1], command[2], command[3]);
        console.log('Sending [' + command[3] + '] from ' + command[1] + ' to ' + command[2]);
      }
      break;
    case "message-file": {
      if (command.length != 3)
        console.log('usage: message-file <user-a> <user-b>');
      else
        db.loadAllMessages(null, null, command[1], command[2]);
      break;
    }
    case 'fetch':
      if (command.length != 2)
        console.log("usage: fetch <user>");
      else
      {
        db.fetchMessages(null, null, command[1]);
      }
      break;
    case 'isActive':
      if (command.length != 2)
        console.log('usage: isActive <user>');
      else
      {
        var status = db.isActive(command[1]);
        switch(status)
        {
          case 0:
            console.log(command[1] + ' is not active.');
            break;
          case 1:
            console.log(command[1] + ' is active.');
            break;
          case -1:
            console.log('Error retriving data');
            break;
          default:
            console.log('Error occured');
        }
        break;
      }
    case "quit":
      console.log('\tNow exiting');
      process.exit();
      break; //never reaches but w.e
    default:
      console.log('\terror retreving command "' + command[0] + '". printing usage');
  }
  console.log('\n');
  process.stdout.write("Enter Command: ");
});
