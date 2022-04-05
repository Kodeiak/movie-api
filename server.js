// import core node http module 
const http = require("http"),
      fs = require("fs"),
      url = require("url");

// use dot notation to access http module assigned to "http" above
http.createServer((request, response) => {
  let addr= request.url, // accessing url from the argument request
      q = url.parse(addr, true), // parse new addr variable
      filePath = "";

  // document instance in log.txt
  fs.appendFile("log.txt", "URL: " + addr + "\nTimestamp: " + new Date() + "\n\n", (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Added to log.");
    }
  });

  if (q.pathname.includes("documentation")) {
    filePath = (__dirname + "/documentation.html");
  } else {
    filePath = "index.html"; // if no documentation page, redirect to home
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    } 
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(data);
    response.end();
  })
  
}).listen(8080);

console.log("My test server is running on Port 8080");