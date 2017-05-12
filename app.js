var 
	express = require("express"),
    bodyParser = require("body-parser"),
    mongoClient = require("mongodb").MongoClient,
    objectId = require("mongodb").ObjectID,
    app = express(),
    jsonParser = bodyParser.json(),
    url = "mongodb://localhost:27017/usersdb";
 
app.use(express.static(__dirname + "/public"));
app.get("/api/users", function(req, res){
      
    mongoClient.connect(url, function(err, db){
        db.collection("users").find({}).toArray(function(err, users){
            res.send(users)
            db.close();
        });
    });
});
app.get("/api/users/:id", function(req, res){
      
    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, db){
        db.collection("users").findOne({_id: id}, function(err, user){
             
            if(err) return res.status(400).send();
             
            res.send(user);
            db.close();
        });
    });
});
 
app.post("/api/users", jsonParser, function (req, res) {
     
    if(!req.body) return res.sendStatus(400);
     
    var 
    	userName = req.body.name,
        userAge = req.body.age,
        userNote = req.body.note,
        user = {name: userName, age: userAge, note: userNote};
     
    mongoClient.connect(url, function(err, db){
        db.collection("users").insertOne(user, function(err, result){
             
            if(err) return res.status(400).send();
             
            res.send(user);
            db.close();
        });
    });
});
  
app.delete("/api/users/:id", function(req, res){
      
    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, db){
        db.collection("users").findOneAndDelete({_id: id}, function(err, result){
             
            if(err) return res.status(400).send();
             
            var user = result.value;
            res.send(user);
            db.close();
        });
    });
});
 
app.put("/api/users", jsonParser, function(req, res){
      
    if(!req.body) return res.sendStatus(400);
    var 
    	id = new objectId(req.body.id);
        userName = req.body.name;
        userAge = req.body.age;
        userNote = req.body.note;
     
    mongoClient.connect(url, function(err, db){
        db.collection("users").findOneAndUpdate({_id: id}, 
        	{ $set: {age: userAge, name: userName, note: userNote}},
             {returnOriginal: false },function(err, result){
             
            if(err) return res.status(400).send();
             
            var user = result.value;
            res.send(user);
            db.close();
        });
    });
});
  
app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});