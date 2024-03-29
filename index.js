// import packages/modules
const express = require("express"),
      morgan = require("morgan"),
      uuid = require("uuid"),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      cors = require("cors"),
      { check, validateResult, validationResult } = require("express-validator"),
      models = require("./models.js");
const res = require("express/lib/response");

const app = express(),
      movies = models.movie,
      users = models.user; 

const passport = require("passport");
require("./passport");

// whitelist urls
let whitelist = [
  "https://myflixdb-kodeiak.herokuapp.com",
  "http://localhost:1234",
  "http://localhost:4200",
  "https://www.themoviedb.org/t/p",
  "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/bSqt9rhDZx1Q7UZ86dBPKdNomp2.jpg",
  "https://62c758afab75b800089fe189--myflix-movieapp-client.netlify.app",
  "https://image.tmdb.org/t/p/",
  "https://main--myflix-movieapp-client.netlify.app",
  "https://kodeiak.github.io/myFlix-Angular-client",
  "https://kodeiak.github.io"
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log(whitelist.indexOf(origin));
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, { origin: true });
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

let auth = require("./auth")(app); // (app) ensures Express is available in auth.js,


// Local DB
// mongoose.connect("mongodb://localhost:27017/myFlixDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// Hosted DB
mongoose.connect( process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(morgan("common"));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

/**
 * GET Welcome page
 * @returns welcome message
 */
app.get("/", (req, res) => {
  res.status(200).send("Welcome to myFlixDB!");
});

/**
 * GET a list of ALL movies to the user
 * @returns movie data
 */
app.get("/movies", passport.authenticate("jwt", { session: false }), (req, res) => {
// app.get("/movies", (req, res) => {
  movies.find()
  .then(movies => res.status(200).json(movies))
  .catch(err => {
    console.error(err);
    res.status(500).send(`Error: ${err}`);
  });
});

/**
 * GET a list of ALL users
 * @returns user list
 */
app.get("/users", passport.authenticate("jwt", { session: false }), (req, res) => {
  users.find()
    .then(users => res.status(200).json(users))
    .catch(err => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

/**
 * GET user by username
 * @returns user data
 */
app.get("/users/:username", passport.authenticate("jwt", { session: false }), (req, res) => {
  users.findOne({ username: req.params.username})
    .then( user => res.json(user))
    .catch( err => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

/**
 * GET data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
 * @returns data for single movie
 */
app.get("/movies/:title", passport.authenticate("jwt", { session: false }), (req, res) => {
  movies.findOne({ title: req.params.title})
    .then ( movie => res.status(200).json(movie))
    .catch( err => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

/**
 * GET data about a genre (description) by name/title (e.g., "The Dark Knight")
 * @returns genre data
 */
app.get("/movies/genre/:name", passport.authenticate("jwt", { session: false }), (req, res) => {
  movies.findOne({ "genre.name": req.params.name})
    .then ( movie => {
      if(movie) {
        res.status(200).json(movie.genre);
      } else {
        res.status(400).send("Genre not found.");
      }
    })
    .catch( err => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

/**
 * GET data about a director (bio, birth year, death year) by name
 * @returns director details
 */
app.get("/movies/director/:directorName", passport.authenticate("jwt", { session: false }), (req, res) => {
  movies.findOne({ "director.name": req.params.directorName})
    .then( movie => {
      if(movie) {
        res.status(200).json(movie.director);
      } else {
        res.status(400).send("Director not found.");
      }
    })
    .catch( err => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

/**
 * CREATE - register new users
Expected JSON Format
{ 
  ID: Integer,
  username: String,
  password: String,
  email: String,
  birthday: Date
}
 */
app.post("/users", 
  [
    check("username", "Username is required").isLength({min: 5}),
    check("username", "Username contains non alphanumeric characters - not allowed.").isAlphanumeric(),
    check("password", "Password is required").not().isEmpty(),
    check("email", "Email does not appear to be valid").isEmail()
  ], (req, res) => {

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  
  let hashedPassword = users.hashPassword(req.body.password);
  users.findOne({username: req.body.username}) //query users model for user by username
    .then((user) => {
      if (user) { // if user exists
        return res.status(400).send(`${req.body.username} already exists`);
      } else { // if user does not exist, add new user
        users
          .create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            birthday: req.body.birthday
          })
          .then((user) => res.status(201).json(user)) // send json response using the document just created
          .catch((error) => {
            console.error(error);
            res.status(500).send(`Error: ${error}`);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(`Error: ${error}`);
    });
});

/** UPDATE - allow users to update their username
  * Expected JSON format
  * {
  * username: String,
  * (required)
  * password: String,
  * (required)
  * email: String,
  * (required)
  * birthday: Date
  * }
  */
app.put("/users/:username",
  [
    check("username", "Username is required").isLength({min: 5}),
    check("username", "Username contains non alphanumeric characters - not allowed.").isAlphanumeric(),
    check("password", "Password is required").not().isEmpty(),
    check("email", "Email does not appear to be valid").isEmail()
  ], 
  passport.authenticate("jwt", { session: false }), (req, res) => {

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  
  users.findOneAndUpdate(
    { username: req.params.username},
    { 
      $set: {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        birthday: req.body.birthday
      }
    },
  { new: true}) // returns updated document
  .then( updatedUser => {
    res.status(200).json(updatedUser);
  })
  .catch( err => {
    console.error(err);
    res.status(500).send(`Error: ${err}`);
  });
});

/**
 * PUT - Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)
 * @returns updated user
 */
app.put("/users/:username/movies/:movieID", passport.authenticate("jwt", { session: false }), (req, res) => {
  users.findOneAndUpdate(
    {username: req.params.username},
    { $push: { favoriteMovies: req.params.movieID}},
  { new: true})
  .then( updatedUser => {
    res.status(201).json(updatedUser);
  })
  .catch ( err => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
  });
});

/**
 * DELETE - Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)
 */
app.delete("/users/:username/movies/:movieID", passport.authenticate("jwt", { session: false }), (req, res) => {
  users.findOneAndUpdate(
    {username: req.params.username},
    { $pull: { favoriteMovies: req.params.movieID }},
    { new: true})
  .then( updatedUser => {
    res.status(200).json(updatedUser);
  })
  .catch( err => {
    console.error(err);
    res.status(500).send(`Error: ${err}`);
  });
});


/**
 * DELETE - Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)
 */
app.delete("/users/:username", passport.authenticate("jwt", { session: false }), (req, res) => {
  users.findOneAndRemove({ username: req.params.username})
    .then( user => {
      if (!user) {
        res.status(400).send(`${req.params.username} was not found`);
      } else {
        res.status(200).send(`${req.params.username} was deleted`);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on Port ${port}`);
});


