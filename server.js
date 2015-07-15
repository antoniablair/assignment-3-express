var express = require("express");

var app = express();
app.locals.pretty = true;
app.set("view engine", "jade");

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
   res.render("index");
});

app.listen(process.env.PORT);