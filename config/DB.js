// This is the DB connection setup

const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI'); //Located in config/default.json

const connectDB = async () => {
  try {
    // returns a promise so we need to use await
    await mongoose.connect(db, {
      useNewUrlParser: true
    });

    console.log('MongoDB connected!');
  } catch (err) {
    console.log(err.message);
    //Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
