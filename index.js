// import packages/modules
const express = require("express"),
      morgan = require("morgan"),
      uuid = require("uuid"),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      models = require("./models.js");

const app = express(),
      movies = models.movie,
      users = models.user; 

mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(morgan("common"));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

let movies = [
  {
    title: "The Dark Knight",
    description: "a movie",
    genre: {
      name: "drama",
      description: "description of drama"
    },
    director: {
      name: "Christopher Nolan",
      bio: "He is a director",
      birth: "1970",
      death: null
    },
    image: "url",
    featured: "yes/no"
  },
  {
    description: "a movie",
    genre: {
      name: "drama",
      description: "description of drama"
    },
    director: {
      name: "Christopher Nolan",
      bio: "He is a director",
      birth: "1970",
      death: null
    },
    image: "url",
    featured: "yes/no",
    title: "Inception"
  },
  {
    description: "a movie",
    genre: {
      name: "drama",
      description: "description of drama"
    },
    director: {
      name: "Christopher Nolan",
      bio: "He is a director",
      birth: "1970",
      death: null
    },
    image: "url",
    featured: "yes/no",
    title: "Blood Diamond"
  },
  {
    description: "a movie",
    genre: {
      name: "drama",
      description: "description of drama"
    },
    director: {
      name: "Christopher Nolan",
      bio: "He is a director",
      birth: "1970",
      death: null
    },
    image: "url",
    featured: "yes/no",
    title: "It's a Wonderful Life"
  },
  {
    description: "a movie",
    genre: {
      name: "drama",
      description: "description of drama"
    },
    director: {
      name: "Christopher Nolan",
      bio: "He is a director",
      birth: "1970",
      death: null
    },
    image: "url",
    featured: "yes/no",
    title: "Life is beautiful"
  },
  {
    description: "a movie",
    genre: "a genre",
    director: {
      name: "Christopher Nolan",
      bio: "He is a director",
      birth: "1970",
      death: null
    },
    image: "url",
    featured: "yes/no",
    title: "Joker"
  },
  {
    description: "a movie",
    genre: {
      name: "drama",
      description: "description of drama"
    },
    director: {
      name: "Christopher Nolan",
      bio: "He is a director",
      birth: "1970",
      death: null
    },
    image: "url",
    featured: "yes/no",
    title: "The Count of Monte Cristo"
  },
  {
    description: "a movie",
    genre: {
      name: "drama",
      description: "description of drama"
    },
    director: {
      name: "Christopher Nolan",
      bio: "He is a director",
      birth: "1970",
      death: null
    },
    image: "url",
    featured: "yes/no",
    title: "Gangster Squad"
  },
  {
    description: "a movie",
    genre: {
      name: "drama",
      description: "description of drama"
    },
    director:   {
      name: "Christopher Nolan",
      bio: "He is a director",
      birth: "1970",
      death: null
    },
    image: "url",
    featured: "yes/no",
    title: "Ocean's 11"
  },
  {
    description: "a movie",
    genre: {
      name: "drama",
      description: "description of drama"
    },
    director:   {
      name: "Christopher Nolan",
      bio: "He is a director",
      birth: "1970",
      death: null
    },
    image: "url",
    featured: "yes/no",
    title: "Kill Bill"
  },

];

let users = [
  {
    id: 1,
    email: "tessa@email.com",
    username: "Tessa",
    favoriteMovies: [ 
      "movie1", 
      "movie2", 
      "movie3"]
  },
];


// READ a list of ALL movies to the user
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

// READ data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("No such movie");
  }
  
});

// READ data about a genre (description) by name/title (e.g., “Thriller”)
app.get("/movies/:genre/:movieTitle", (req, res) => {
  const { movieTitle } = req.params;
  const genre = movies.find( movie => movie.title === movieTitle).genre;
  
  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("No such genre");
  }
});

// READ data about a director (bio, birth year, death year) by name
app.get("/movies/:director/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find( movie => movie.director.name === directorName).director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("No such director");
  }
});

// CREATE - register new users
app.post("/users", (req, res) => {
  const newUser = req.body;
  console.log(newUser);

  if (newUser.username) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("Users need names.");
  }
});

// UPDATE - allow users to update their user info (username)
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id );
  
  if (user) {
    user.username = updatedUser.username;
    res.status(200).json(user);
  } else { 
    res.status(400).send("No such user");
  }
});

// UPDATE - Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)
app.put("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s favorites.`);
  } else {
    res.status(400).send("No such user.");
  }
});

// DELETE - Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );
  
  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title != movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s favorites.`);
  } else {
    res.status(400).send("No such user.");
  }
});
// DELETE - Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    users = users.filter( user => user.id != id);
    res.status(200).send(`User ${id} has been removed.`);
  } else {
    res.status(400).send("No such users.");
  }
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});

console.log("My first Node test server is running on Port 8080.");