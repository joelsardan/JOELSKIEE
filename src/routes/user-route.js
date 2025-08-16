// routes/user-route.js
const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth-middleware");

router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user }); 
});

module.exports = router;
