const express = require('express');
const User = require('../models/User');
const router = express.Router();
// for validating the credentials
const { body, validationResult } = require('express-validator');
// import module for make password in hash format
const bcrypt = require("bcryptjs")
// import module for retrieve token of user
const jwt = require("jsonwebtoken")
//import middleware for fetch user
const fetchuser = require("../middleware/fetchuser")
const JWT_SECRET = 'samis$ocool'

//ROUTE 1: create a user using: POST '/api/auth/createuser'. log in doesn't require auth
router.post('/createuser', [
  body('name', 'enter a valid name').isLength({ min: 3 }),
  body('email', 'enter a valid email').isEmail(),
  body('password', 'password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
  let success = false;
  // if there are errors,return bad request and errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }
  // check whether the user with this email already exist
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({success, error: "sorry, user with this email already exist." })
    }

    //create a salt for password
    const salt = await bcrypt.genSalt(10);
    //create a hash password
    const secPass = await bcrypt.hash(req.body.password, salt)
    // create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    })

    // create a authentication token for user 
    const data = {
      user: {
        id: user.id
      }
    }

    const authToken = jwt.sign(data, JWT_SECRET);
    success=true;
    res.json({success, authToken })
  }

  catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error")
  }
  
})

//ROUTE 2: create a user using: POST '/api/auth/login'. log in doesn't require auth
router.post('/login', [
  body('email', 'enter a valid email').isEmail(),
  body('password', 'password cannot be blank').exists()
], async (req, res) => {
  let success=false
  // if there are errors,return bad request and errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      success=false
      return res.status(400).json({ error: "please try to login with correct credentials" });
    }

    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      success=false
      return res.status(400).json({ success,error: "please try to login with correct credentials" });
    }

    // create a authentication token for user 
    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    success=true
    res.json({success, authToken })
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error")
  }
})

//ROUTE 3: get logged in user details using: POST '/api/auth/getuser'. log in require auth

router.post('/getuser',fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error")
  }
})
module.exports = router