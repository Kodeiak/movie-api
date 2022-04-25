const jwtSecret = "your_jwt_secret"; // this has to be the same key used in JWTStrategy

const jwt = require("jsonwebtoken"),
      passport = require("passport");

require("./passport"); // import local passport file

let generateJWTToken = user => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // username being encoded in the JWT
    expiresIn: "7d", // how long token is good for
    algorithm: "HS256" // algo used to "sign" or encode JWT values
  });
};

/* Post login */
module.exports = router => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user
        });
      }
      req.login(user, { session: false }, error => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};