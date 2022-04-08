// import packages/modules
const express = require("express"),
      morgan = require("morgan"),
      uuid = require("uuid"),
      bodyParser = require("body-parser");

const app = express(); 

// const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {flags: "a"});

app.use(morgan("common"));
app.use(express.static("public"));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

let topMovies = [
  {
    rank: 1,
    movie: "The Dark Knight",
  },
  {
    rank: 2,
    movie: "Inception"
  },
  {
    rank: 3,
    movie: "Blood Diamond"
  },
  {
    rank: 4,
    movie: "It's a Wonderful Life"
  },
  {
    rank: 5,
    movie: "Life is beautiful"
  },
  {
    rank: 6,
    movie: "Joker"
  },
  {
    rank: 7,
    movie: "The Count of Monte Cristo"
  },
  {
    rank: 8,
    movie: "Gangster Squad"
  },
  {
    rank: 9,
    movie: "Ocean's 11"
  },
  {
    rank: 10,
    movie: "Kill Bill"
  },

];

// Return a list of ALL movies to the user
// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
// Return data about a genre (description) by name/title (e.g., “Thriller”)
// Return data about a director (bio, birth year, death year) by name
// Allow new users to register
// Allow users to update their user info (username)
// Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)
// Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)
// Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)


app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});

console.log("My first Node test server is running on Port 8080.");