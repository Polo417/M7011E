var pg = require('pg').native;
var dbURL = "tcp://nodetest:pika@localhost/dbtest";

function createTables() {
    pg.connect(dbURL, function(err, client) {
		client.query("CREATE TABLE Users(login VARCHAR(255) PRIMARY KEY, password VARCHAR(255))");
		client.query("CREATE TABLE Locations(location VARCHAR(255) PRIMARY KEY, x REAL NOT NULL, y REAL NOT NULL, img_name VARCHAR(255))");
		client.query("CREATE TABLE Comments(location VARCHAR(255) REFERENCES Locations(location), text VARCHAR(255), login VARCHAR(255) REFERENCES Users(login) )");
		
		client.query("INSERT INTO Users(login, password) VALUES($1, $2)",["default_user", "default_password"]);

		
        })
    }
createTables();
pg.end();
