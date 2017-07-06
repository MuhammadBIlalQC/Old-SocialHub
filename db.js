const sql = require('mysql');


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
          console.log('query resp: ' + query_response)
          console.log('query_response == "": ' + (query_response == ''))
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
    }
}

module.exports = db;


//conn.query('select * from accounts;', function(err, res){
//  console.log('res: ' + res[0].usrname);
//});
