const mongoose = require('mongoose');

const connect = mongoose.connect("mongodb://localhost:27017/signup", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
}).catch((error) => {
    console.error("Database connection error:", error);
});

// Create Schema
const Loginschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Collection part
const collection = mongoose.model("users", Loginschema);

module.exports = collection;
