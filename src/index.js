const express = require("express"); // Import the Express.js framework
const path = require("path"); // Import the built-in 'path' module for file path manipulation
const bcrypt = require('bcrypt'); // Import the bcrypt library for password hashing
const collection = require("./config"); // Import the database collection 

const app = express(); // Create an Express application instance

//Midleware
app.use(express.json());                          // Middleware to parse incoming JSON requests
app.use(express.static("public"));                // Middleware to serve static files from the 'public' directory
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded data


app.set("view engine", "ejs");                    // Setting the view engine to EJS (Embedded JavaScript)


//Routes for rendering ejs files
app.get("/", (req, res) => {                      // Route handler for the root URL
    res.render("login", { alert: null });         // Renders the login page with no alert
});
app.get("/signup", (req, res) => {                // Route handler for the signup page
    res.render("signup", { alert: null });        // Renders the signup page with no alert
});  

//Routes for API endpoints
app.post("/signup", async (req, res) => {         // Route handler for processing signup form submissions
    const data = {                                // Extract username and password from the request body
        name: req.body.username,
        password: req.body.password
    };

    try {
        const existingUser = await collection.findOne({ name: data.name });  // Checking if a user with the same name already exists in the database

        if (existingUser) {                       // If user exists
            return res.render("signup", { alert: 'User already exists. Please choose a different username.', alertType: 'alert-error' });  // Render the signup page with an error alert
        }

        const saltRounds = 10; // Set the number of rounds for password hashing (security best practice)
        const hashedPassword = await bcrypt.hash(data.password, saltRounds); // Hash the user's password securely
        data.password = hashedPassword; // Update the 'data' object with the hashed password
    
        const userdata = await collection.create(data); // Create a new user document in the database
        console.log(userdata); // Log the newly created user data for debugging or logging purposes    
      
        // Redirect to login page with success message
        res.render("login", { alert: 'User registered successfully.', alertType: 'alert-success' });
    } catch (error) {
        console.error(error);
        res.status(500).render('Internal Server Error');
    }
});

app.post("/login", async (req, res) => {          // Route handler for processing login form submissions
    try {
        const user = await collection.findOne({ name: req.body.username }); // Finding the user by username in the database

        if (!user) {                              // If user is not found
            return res.render("login", { alert: 'User not found.', alertType: 'alert-error' }); // Render the login page with an error alert
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password); // Comparing the provided password with the stored hashed password

        if (!isPasswordMatch) {                   // If passwords do not match
            return res.render("login", { alert: 'Wrong password.', alertType: 'alert-error' }); // Render the login page with an error alert
        }

        res.render("home");                       // If login is successful, render the home page
    } catch (error) {                             // Handling errors
        console.error(error);                     // Logging any errors
        res.status(500).render('Internal Server Error'); // Rendering a 500 error page
    }
});

const port = 7000;                                // Defining the port number
app.listen(port, () => {                          // Starting the server and listening on the specified port
    console.log(`Server listening on port ${port}`);
});