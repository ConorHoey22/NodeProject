const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  bio: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  userType: {
    //This is the userType , e.g. Admin
    type: String,
    required: true
  }

  //This how you do an array of fields

  /*expierence:[
    {
        description: { 
            type:String,
            required:true
        },
        info:{
            type:String,
            required:true
        }
    },
    
  }],*/
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
