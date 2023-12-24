require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const app = express();
const Message = require("./models/messages");
const User = require("./models/users");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Set up mongoose connection
const mongoDB = process.env.MONGODB_URL;
mongoose.connect(mongoDB);
const db = mongoose.connection;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "views")));

// app.get("/", (req, res) => {
// res.render("home", { user: req.user });
// });
app.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/loggedin");
  }
  const allMessages = await Message.find({}).sort({ timestamp: -1 });
  res.render("home", { user: req.user, messages: allMessages });
});

passport.use(
  new LocalStrategy(async (name, password, done) => {
    try {
      const user = await User.findOne({ name: name });
      if (!user) {
        return done(null, false, { message: "User not found" });
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          return done(err);
        }
        if (!result) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      });
      // if (passwordMatch) {
      //   return done(null, false, { message: "Incorrect password" });
      // }
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.get("/login", (req, res) => {
  res.render("login", { user: req.user, errorMessage: null });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/loggedin",
    failureRedirect: "/loginfail?error=wrongpassword",
  })
);

app.get("/loginfail", (req, res) => {
  let errorMessage = "";
  if (req.query.error === "wrongpassword") {
    errorMessage = "Incorrect password. Please try again.";
  }
  res.render("login", { user: req.user, errorMessage });
});
app.get("/signup", (req, res) => {
  res.render("sign-up-form", { errorMessage: null }); // Empty error message on the first request
});

app.post("/signup", async (req, res, next) => {
  try {
    const existingMail = await User.findOne({ email: req.body.email });
    const existingUser = await User.findOne({ name: req.body.name });
    if (existingMail) {
      // If user already exists display the error
      return res.render("sign-up-form", {
        errorMessage: "A user already exists with this e-mail address",
      });
    }
    if (existingUser) {
      // If user already exists display the error
      return res.render("sign-up-form", {
        errorMessage: "Username already taken",
      });
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.render("sign-up-form", {
        errorMessage: "Passwords do not match",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    // If the user doesn't exist, create a new user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    const result = await user.save();
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

//Tests
app.get("/loggedin", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      // Fetch all messages from the database
      let errorMessage = "";
      const allMessages = await Message.find({})
        .populate("user", "name")
        .sort({ timestamp: -1 });
      // Render the logged-in page and the messages data
      res.render("loggedin", {
        user: req.user,
        messages: allMessages,
        errorMessage,
      });
    } catch (err) {
      console.error("Error fetching messages:", err);
      res.redirect("/error"); // Redirect to an error page
    }
  } else {
    res.redirect("/login"); // Redirect to login
  }
});

app.post("/access-messages", async (req, res) => {
  let errorMessage = "";
  const enteredKey = req.body.accessKey;
  const correctKey = "fusb0l"; // Replace 'yourSecretKey' with the actual key
  if (enteredKey === correctKey) {
    try {
      // Fetch all messages from the database
      const allMessages = await Message.find({})
        .populate("user", "name")
        .sort({ timestamp: -1 });
      // Render the logged-in page and the messages data
      res.render("messages", {
        user: req.user,
        messages: allMessages,
        errorMessage: null,
      });
    } catch (err) {
      console.error("Error fetching messages:", err);
      res.redirect("/error"); // Redirect to an error page
    }
  } else {
    // Incorrect key entered, restrict access
    errorMessage = "Invalid Key";
    const allMessages = await Message.find({})
      .populate("user", "name")
      .sort({ timestamp: -1 });
    res.render("loggedin", {
      user: req.user,
      messages: allMessages,
      errorMessage: errorMessage,
    });
  }
});

app.post("/postmessage", async (req, res) => {
  const { title, message } = req.body;
  const formattedDate = new Date(Date.now()).toLocaleString("en-US", {
    timeZone: "Asia/Kolkata", // Change this to your desired timezone
    dateStyle: "medium",
    timeStyle: "long",
  });
  // console.log(formattedDate);
  const newMessage = new Message({
    title: title,
    text: message,
    user: req.user._id,
    timestamp: formattedDate,
  });

  try {
    // Save the new message to the database
    await newMessage.save();
    res.redirect("/loggedin"); // Redirect to the logged-in page
  } catch (error) {
    console.error("Error saving message:", error);
    res.redirect("/error"); // Redirect to an error page
  }
});

app.listen(3000, () => console.log("app listening on port 3000!"));
