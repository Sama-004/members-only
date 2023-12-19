#! /usr/bin/env node
console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);
// Get arguments passed on command line
const processArgs = process.argv.slice(2);

const USERS = require("./models/users");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = processArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createUsers();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

const COMMON_PASSWORD =
  "$2a$10$AavMM60KdTNEacYQI.vWYeOwKVqDimBiAxfU/S3EHxdLd0srJSBfm";
async function createUsers() {
  console.log("Adding users");
  const users = [
    {
      name: "ross",
      email: "ross@gmail.com",
      password: COMMON_PASSWORD,
      is_member: true,
    },
    {
      name: "rachel",
      email: "rachel@gmail.com",
      password: COMMON_PASSWORD,
    },
    {
      name: "monica",
      email: "monica@gmail.com",
      password: COMMON_PASSWORD,
    },
    {
      name: "chandler",
      email: "chandler@gmail.com",
      password: COMMON_PASSWORD,
    },
    {
      name: "joey",
      email: "joey@gmail.com",
      password: COMMON_PASSWORD,
    },
    {
      name: "phoebe",
      email: "phoebe@gmail.com",
      password: COMMON_PASSWORD,
    },
  ];
  await USERS.insertMany(users);
  console.log("user added");
}
