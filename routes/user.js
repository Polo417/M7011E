var url = require('url');
var querystring = require('querystring');

var pg = require('pg').native;
var dbURL = "tcp://nodetest:pika@localhost/dbtest";

var app = require('../app');
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.sendfile('views/Users.html');
  app.io.sockets.on('connection', function (socket) {
		pg.connect(dbURL, 	function(err, client) {      
			client.query("SELECT * FROM Users", function(err, result) {
				console.log(result);
				socket.emit('displayUsers', result);
				});
			});
		socket.on('AskForBan',function (data) {
			console.log("ask for ban");
			pg.connect(dbURL, 	function(err, client) {
				for (var i=0; i<data.banIDs.length; i++){
					console.log(data.banIDs[i]);
					client.query("UPDATE Users SET banned = 'true' WHERE googleid = '"+data.banIDs[i]+"';", function(err, result) {
						console.log("ban of "+data.banIDs[i]);
					});
				}
			});
		});
		socket.on('AskForUnBan',function (data) {
			console.log("ask for unban");
			pg.connect(dbURL, 	function(err, client) {
				for (var i=0; i<data.banIDs.length; i++){
					console.log(data.banIDs[i]);
					client.query("UPDATE Users SET banned = 'false' WHERE googleid = '"+data.banIDs[i]+"';", function(err, result) {
						console.log("unban of "+data.banIDs[i]);
					});
				}
			});
		});
	});
	//~ res.redirect("/users");
};

exports.checkUser = function(FirstName, LastName, GoogleID){
	var exist = false;
	var ban = false;
	pg.connect(dbURL, function(err, client){      
		client.query("SELECT * FROM Users", function(err, result) {
			for (var i = 0; i < result.rows.length; i++) {
				console.log(parseInt(result.rows[i].googleid), parseInt(GoogleID))
				if (parseInt(result.rows[i].googleid) == parseInt(GoogleID)){
					exist = true;
					ban = result.rows[i].banned
				}
			}
			
		})
		if (!exist){
			//~ console.log(FirstName, LastName, GoogleID);
			client.query("INSERT INTO Users(firstName, lastName, googleID, banned) VALUES('"+FirstName+"', '"+LastName+"', '"+GoogleID+"', false)");
			console.log("adding "+FirstName+" into the database");
		
		}else{
			console.log(FirstName+" is already in the database");
		}
	})
	return(ban);
	
};
