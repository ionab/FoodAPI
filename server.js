const express = require('express');
const parser = require('body-parser');
const server = express();

server.use(parser.json());
server.use(parser.urlencoded({extended: true}));

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

MongoClient.connect("mongodb://localhost/27017", function(err, client){

  //stop if error
  if (err){
    console.log(err);
    return;
  };

  //connect to named database
  const db = client.db("food");
  console.log("Connected to database");

  //make new
  server.post('/api/chocolate', function(req, res, next){
    const chocolateCollection = db.collection("chocolate");
    const quote = req.body;
    chocolateCollection.save(quote, function(err, result){
      if (err) next(err);
      res.status(201);
      res.json(result.ops[0]);
      console.log("Saved to database");
    });
  });

  //get all
  server.get("/api/chocolate", function(req, res, next){
    const chocolateCollection = db.collection("chocolate");
    chocolateCollection.find().toArray(function(err, chocolateCollection){
      if (err) next(err);
      res.json(chocolateCollection);
    });
  });
  //delete all
  server.delete("/api/chocolate", function(req, res, next){
    const chocolateCollection = db.collection("chocolate");
    chocolateCollection.remove({}, function(err, result){
      if (err) next(err);
      res.status(200).send();
    });
  });
  //delete one
  server.delete("/api/chocolate/:id", function(req, res, next){
    const chocolateCollection = db.collection("chocolate");
    const objectID = ObjectID(req.params.id);
    chocolateCollection.remove({_id: objectID}, function(err, result){
      if (err) next(err);
      res.status(200).send();
    });
  })

  //update
  server.post("/api/chocolate/:id", function(req, res, next){
    const chocolateCollection = db.collection("chocolate");
    const objectID = ObjectID(req.params.id);
    chocolateCollection.update({_id: objectID}, req.body, function(err, result){
      if (err) next(err);
      res.status(200).send();
    })
  });

  //server starts when connected to the database
  server.listen(3000, function(){
    console.log("Listening on port 3000");
  });

});
