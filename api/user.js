const express = require("express");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const router = express.Router();

// User model
const User = require("../models/User");

// @route   POST api/users/sign
// @desc    Sign or Check user
// @access  Public
router.post("/sign", (req, res) => {
  User.findOne({ email: req.body.email, country: req.body.country }).then(
    (user) => {
      if (user) {
        // User Matched
        const payload = {
          id: user.id,
          email: user.email,
          country: user.country,
        }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        const newUser = new User({
          email: req.body.email,
          country: req.body.country,
        });

        newUser
          .save()
          .then((newuser) => {
            // User Matched
            const payload = {
              id: newuser.id,
              email: newuser.email,
              country: newuser.country,
            }; // Create JWT Payload

            // Sign Token
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token,
                });
              }
            );
          })
          .catch((err) => console.log(err));
      }
    }
  );
});

module.exports = router;
