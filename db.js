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
                        res.send('could not insert =/');
                    }
                    else
                    {
                        res.type('text/html');
                        res.send('username has been inserted!');
                    }
                  });
            }
            else
             {
               console.log('query resp2: ' + query_response)
                res.type('text/html');
                res.send('username already exists');
             }
        });
    }
}

module.exports = db;


//conn.query('select * from accounts;', function(err, res){
//  console.log('res: ' + res[0].usrname);
//});
