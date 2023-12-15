if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const app = express();

// Set up mongoose connection
const mongoDB = process.env.MONGODB_URL;
mongoose.connect(mongoDB);
const db = mongoose.connection;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const User = mongoose.model(
  "User",
  new Schema({
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { type: String, required: true },
  })
);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

passport.use(
  new LocalStrategy(async (name, password, done) => {
    try {
      const user = await User.findOne({ name: name });
      if (!user) {
        return done(null, false, { message: "Incorrect name" });
      }
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
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

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/loggedin",
    failureRedirect: "/loginfail",
  })
);

app.get("/loggedin", (req, res) => {
  res.send("HURRAY login done correctly");
});

app.get("/loginfail", (req, res) => {
  res.send("OOPS login failed");
});

app.listen(3000, () => console.log("app listening on port 3000!"));
