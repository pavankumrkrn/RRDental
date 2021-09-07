const { URL } = require("../MongoDb/mongoUrl");
const mongodb = require("mongodb");
const {createJWT} = require("../Auth/Authentication");
const mongoClient = mongodb.MongoClient;

const index = async (req, res) => {
  res.render("index");
};

const login = async (req, res) => {
  try {
    const { user } = req.body;
    if (user) {
      const client = await mongoClient.connect(URL, {
        useNewURLParser: true,
        useUnifiedTopology: true,
      });
      const db = client.db("OrderApplication");
      const existingUser = await db
        .collection("users")
        .findOne({ username: user.username }, {});
      if(existingUser) {
        const token = await createJWT({ id: existingUser._id });
        res.cookie("access_token", token, {
          httpOnly: true
        })
        res.json({
          url: "/dashboard",
          token,
          userId: existingUser._id,
        });
      } else {
        res.json({
          error: "Invalid Credentials",
        });
      }
    } else {
      res.json({
        error: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  index,
  login,
};
