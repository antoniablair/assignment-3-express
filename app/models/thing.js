var mongoose = require("mongoose");

var thingSchema = mongoose.Schema({
    name: String
});

var Thing = mongoose.model("thing", thingSchema);

// function ThingTests() {
//     console.log("Hi");
// }

module.exports = Thing;
// module.exports = ThingTests;