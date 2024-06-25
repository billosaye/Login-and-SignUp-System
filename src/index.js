const express = require("express");
const path = require("path");
const bcrypt = require('bcrypt');
const collection = require("./config");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("login", { alert: null });
});

app.get("/signup", (req, res) => {
    res.render("signup", { alert: null });
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };

    try {
        const existingUser = await collection.findOne({ name: data.name });

        if (existingUser) {
            // Display red alert for existing user
            return res.render("signup", { alert: 'User already exists. Please choose a different username.', alertType: 'alert-error' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;

        const userdata = await collection.create(data);
        console.log(userdata);

        // Redirect to login page with success message
        res.render("login", { alert: 'User registered successfully.', alertType: 'alert-success' });
    } catch (error) {
        console.error(error);
        res.status(500).render('Internal Server Error');
    }
});

app.post("/login", async (req, res) => {
    try {
        const user = await collection.findOne({ name: req.body.username });

        if (!user) {
            // Display red alert for user not found
            return res.render("login", { alert: 'User not found.', alertType: 'alert-error' });
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordMatch) {
            // Display red alert for wrong password
            return res.render("login", { alert: 'Wrong password.', alertType: 'alert-error' });
        }

        res.render("home");
    } catch (error) {
        console.error(error);
        res.status(500).render('Internal Server Error');
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
