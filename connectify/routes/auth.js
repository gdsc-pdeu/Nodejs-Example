const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(422)
      .json({ msg: "Please Input all the required fields" });
  }
  try {
    const sameUsername = await User.findOne({ username });
    const sameEmail = await User.findOne({ email });
    if (sameUsername) {
      return res.status(422).json({ msg: "Username already exists" });
    }
    if (sameEmail) {
      return res.status(422).json({ msg: "Email already exists" });
    }

    // generate hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).send(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ msg: "Please Input all the fields" });
    }
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(404).json({ msg: "User doesn't exist" });
    }
    const validPass = await bcrypt.compare(password, checkUser.password);
    if (validPass) {
      return res.status(200).json(checkUser);
    } else {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
