// import packages/modules
const express = require("express"),
      morgan = require("morgan");
      // fs = require("fs"),
      // path = require("path"),
      // http = require("http"),
      // url = require("url");

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
    movie: "The Dark Knight"
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

app.get("/", (req, res) => {
  res.send("Welcome to my app!");
});

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});

console.log("My first Node test server is running on Port 8080.");