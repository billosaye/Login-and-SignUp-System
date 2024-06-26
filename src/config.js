const mongoose = require('mongoose');                         // Importing the mongoose module, which is used for MongoDB object modeling

const connect = mongoose.connect("mongodb://localhost:27017/signup", { // Connecting to the MongoDB database located at 'localhost' on port 27017, with a database named 'signup'
    useNewUrlParser: true,                                    // Using the new URL parser
    useUnifiedTopology: true                                  // Using the new Server Discover and Monitoring engine
});

// Check database connection status
connect.then(() => {                                          // If the connection is successful
    console.log("Database Connected Successfully");           // Log "Database Connected Successfully" to the console
}).catch((error) => {                                         // If there is an error in connecting
    console.error("Database connection error:", error);       // Log the error message to the console
});

// Create Schema for user logins
const Loginschema = new mongoose.Schema({                     // Defining a new schema for login
    name: {                                                   // Defining the 'name' field
        type: String,                                         // 'name' is of type String
        required: true,                                       // 'name' is a required field
        unique: true                                          // 'name' must be unique
    },
    password: {                                               // Defining the 'password' field
        type: String,                                         // 'password' is of type String
        required: true                                        // 'password' is a required field
    }
});

// Collection part
const collection = mongoose.model("users", Loginschema);      // Creating a model named 'users' based on the Loginschema

module.exports = collection;                                  // Exporting the collection for use in other parts of the application
