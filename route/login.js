const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User, userSchema } = require("../Models/userModel");
router.use(express.json());

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("Invalid Username or password");
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) return res.status(400).send("Invalid Username or password");
    // let token = userSchema.methods.getAuthToken();
    let token = user.getAuthToken();
    console.log(token);
    res.status(200).send(token);
  } catch (error) {
    console.log(error);
  }
});
function validate(data) {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(255),
    password: Joi.string().min(3).max(1024),
  });
  return schema.validate(data);
}
module.exports = router;
