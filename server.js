var express = require("express");

var app = express();
app.locals.pretty = true;
app.set("view engine", "jade");

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
   res.render("index", {
       title: "Home"
   });
});
app.get("/people", function(req, res){
   res.render("people", {
       title: "People"
   });
});
app.get("/things", function(req, res){
   res.render("things", {
       title: "Things"
   });
});

app.listen(process.env.PORT);