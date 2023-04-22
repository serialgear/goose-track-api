// const { AppError } = require("../helpers");

// const checkAuthData = (req, res, next) => {
//   next();
//   //   next(new AppError(400, "message"));
// };

// module.exports = { checkAuthData };
const { User } = require("../models");
const { Unauthorized } = require("http-errors");
const jwtToken = require("../helpers/jwtToken");

const auth = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  try {
    if (bearer !== "Bearer") {
      throw new Unauthorized("Not authorized");
    }
    const { id } = jwtToken.jwtTokenVerify(token);

    const user = await User.findById(id);

    if (!user || !user.token) {
      throw new Unauthorized("Not authorized");
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.message === "Invalid signature") {
      error.status = 401;
    }
    next(error);
  }
};

module.exports = auth;
