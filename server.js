var express = require("express");
var session = require('express-session');
var Tab = require("./app/tab");
var db = require("./app/config/db");
var Thing = require("./app/models/thing");
var bodyParser = require("body-parser");

// var flash = require('connect-flash');

db.connect()
    .then(function(){
        console.log("connected");
    })
    .catch(function(err){
        console.log(err);
    });


var app = express();
app.locals.pretty = true;
app.set("view engine", "jade");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next){
    res.locals.tabs = [
            new Tab("Home", "/"),
            new Tab("People", "/people"),
            new Tab("Things", "/things")
    ];
    next(); 
});


app.get("/", function(req, res){
   res.render("index", {
       title: "Home",
       activePath: "/"
   });
});

app.get("/error", function(req, res){
    res.render("error", {
        activePath: "/error",
        title: "Something doesn't look right."
    });
});

app.get("/people", function(req, res){
   res.render("people", {
       title: "People",
       activePath: "/people"
   });
});
app.get("/things", function(req, res){
    Thing.find({}).then(function(things){
       res.render("things", {
           title: "Things",
           activePath: "/things",
           things: things
       });
    });
});

app.post("/things/new", function(req, res, next){
  var thing = new Thing(req.body);
  var key = thing.name;
  console.log("-------");
    if (req.body.name) {
        Thing.find({ name: thing.name }, function (err, thing) {
            if (err) {
            return res.send(500, 'An error has occurred!');
            }
            else if (thing.length!=0) {
            console.log(key + " already exists in the database");
            // return res.render('thing_new', {'errors': key });
            return res.send(500, 'That name exists already! Please try again.');
            }
            else {
            var thing = new Thing(req.body);    
            console.log("Successfully added.");
            thing.save()
                .then(function(){
                    res.redirect("/things");
                });
            }
        });
    }
    else {
        return res.send(500, 'Please choose a name!');
    }
  });
  
  
app.post("/things/delete", function(req, res, next){
  var thing = new Thing(req.body);
  console.log("-------");
    if (req.body.name) {
        Thing.find({ name: thing.name }, function (err, thing) {
            if (err) {
            return res.send(500, 'An error has occurred!');
            }
            else if (thing.length==0) {
            console.log(thing.name + " does not exist in the database.");
            // return res.render('thing_new', {'errors': key });
            return res.send(500, 'That Thing is not found in the database.');
            }
            else {
            var thing = new Thing(req.body);
            Thing.remove(
            { name: thing.name })
                .then(function(){
                    res.redirect("/things");
                });
            }
        });
    }
    else {
        return res.send(500, 'Please enter a legitimate Thing!');
    }
  });
  

app.post("/things/:id", function(req, res){
    Thing.update(
        {_id: req.params.id}, 
        {$set:{ name: req.body.name}}
    ).then(function(){
        res.redirect("/things"); 
    });
});

// app.post('/error', function(req,res){
//     var thing = new Thing(req.body.name);
//     Thing.remove(
//         {name: thing.name}
//     ).then(function(){
//         res.redirect("/things"); 
//     });
// });

app.get("/things/new", function(req, res){
    res.render("thing_new", {
        activePath: "/things",
        title: "Insert a New Thing"
    });
});

app.get("/things/delete", function(req, res){
    res.render("thing_delete", {
        activePath: "/things",
        title: "Delete a Thing"
    });
});

app.get("/things/:id", function(req, res){
    Thing.findById(req.params.id)
        .then(function(thing){
            res.render("thing", {
               activePath: "/things",
               thing: thing,
               title: "Thing " + thing.name
            });  
        });
});

app.listen(process.env.PORT);