const app = require('express')();
const fs = require('fs');
const bodyParser = require('body-parser');
const cookies = require('cookie-parser')('this-is-a-signed-cookie');
const db = require('./db.js');

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

app.get('/style.css', function(req,res){
   fs.readFile('pages/style.css', function(err,data){
       res.send(data);
   })
});
app.get('/bear.png', function(req,res){
   fs.readFile('pages/bear.png', function(err,data){
       res.send(data);
   });
});
app.get('/placeholder.png', function(req,res){
    fs.readFile('pages/placeholder.png', function(err,data){
       res.send(data);
   });
});
app.get('/index.js', function(req,res){
    fs.readFile('pages/index_js.js', function(err,data){
       res.send(data);
   });
});
app.get('/friends.js', function(req,res){
    fs.readFile('pages/friends.js', function(err,data){
        if(err)
            console.log(err);
        else
            res.send(data);
   });
});


app.listen(3000);
console.log('Listening on port 3000...');
