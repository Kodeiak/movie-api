const mongoose = require("mongoose"),
      bcrypt = require("bcrypt");

let movieSchema = mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  genre: {
    name: String,
    description: String
  },
  director: {
    name: String,
    bio: String,
    birth: Date,
    death: Date
  },
  Actors: [String],
  imagePath: String,
  featured: Boolean
});

let userSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  birthday: Date,
  favoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: "movie"}]
});

userSchema.statics.hashPassword = password => { bcrypt.hashSync(password, 10)};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password); // refers to user doc rather than userSchema.methods
};

let movie = mongoose.model("movie", movieSchema);
let user = mongoose.model("user", userSchema);

module.exports.movie = movie;
module.exports.user = user;