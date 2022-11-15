const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../service");
const { SECRET_KEY } = process.env;
const RequestError = require("../../helpers/RequestError");

const loginUser = async (req, res) => {
  const { email, password } = req.body;
 
    const user = await User.findOne({ email });
    if (!user) {
      throw RequestError(401, "Email not found");
    } else {
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        throw RequestError(401, "Email or password is wrong");
      } else {
        const payload = {
          id: user._id,
        };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });
        await User.findByIdAndUpdate(user._id, { token });
        res.status(200).json({
          token,
          user: {
            email: user.email,
            subscription: user.subscription,
          },
        });
      }
    }
 
};
module.exports = loginUser;