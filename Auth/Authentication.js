const JWT = require("jsonwebtoken");
const secret = require("./secret");


const createJWT = ({ id }) => {
  return JWT.sign({ id }, secret.getSecret(), { expiresIn: "1h" });
};

const authenticate = async (req, res, next) => {
  try {
    const bearer = req.cookies['access_token'];
    if (!bearer) {
      return res.json({
        error: "Access failed",
      });
    }
    JWT.verify(bearer, secret, (err, decode) => {
      if (res) next();
      else
        res.json({
          error: "Authentication failed",
        });
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: "Authentication failed",
    });
  }
};
module.exports = { createJWT, authenticate };
