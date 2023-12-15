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
const messages = [
  {
    title: `Message ${Math.floor(Math.random() * (10000 - 1 + 1)) + 1}`,
    message: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere pariatur magnam, doloribus dolor earum repellendus? Minus dolor alias, atque sit officia facilis consectetur! Aliquam quia saepe dolor corporis animi laborum autem! Maxime inventore placeat assumenda porro magni saepe ad deleniti.`,
  },
  {
    title: `Message ${Math.floor(Math.random() * (1000 - 1 + 1)) + 1}`,
    message: `Proin porta mi vitae congue euismod. Integer dictum tellus id purus rutrum semper. Nam dapibus, mauris eget sagittis placerat, risus lorem suscipit arcu, ac blandit dolor justo ac risus. Suspendisse potenti. Cras feugiat lacus ac volutpat elementum. Quisque rhoncus lectus est, suscipit ullamcorper urna ornare et. In lacinia ultrices suscipit. Nulla quis placerat mi. Quisque vitae sodales sapien. Cras sit amet commodo massa. Nullam vel hendrerit enim. Nulla augue urna, consectetur eget dignissim ac, pulvinar sed ante. `,
  },
  {
    title: `Message ${Math.floor(Math.random() * (1000 - 1 + 1)) + 1}`,
    message: `

    Fusce id nunc quis velit fermentum ornare quis vel justo. Integer nec massa tempor mi imperdiet scelerisque at eget nulla. Praesent malesuada porttitor massa, sed lacinia enim. Etiam mollis erat id magna ullamcorper, vel blandit ante euismod. Suspendisse vitae massa vitae ipsum rhoncus pharetra et at augue. Aenean venenatis consectetur arcu volutpat aliquam. Aliquam vel sem dapibus, sagittis odio ut, consectetur tortor. Suspendisse feugiat sollicitudin nulla fermentum mattis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce et massa urna. `,
  },
  {
    title: `Message ${Math.floor(Math.random() * (1000 - 1 + 1)) + 1}`,
    message: `
    Donec euismod erat in nulla dignissim bibendum. Donec eget tellus eget turpis vestibulum imperdiet ut quis libero. Phasellus viverra aliquam mauris vel cursus. Suspendisse mi diam, vehicula vestibulum ex vitae, sagittis fringilla turpis. Proin faucibus felis non quam vulputate, in molestie sapien pretium. Fusce eu ipsum erat. Quisque porttitor pretium enim. Sed volutpat diam ac libero pellentesque gravida. Phasellus vitae lobortis ex, sit amet tempor dolor.  `,
  },
];
