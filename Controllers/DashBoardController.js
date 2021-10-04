
const moment = require("moment");
const fs = require('fs');
const { URL } = require("../MongoDb/mongoUrl");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient

const dashBoard = async (req, res) => {
  try {
    const client = await mongoClient.connect(URL, {
      useNewURLParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db("OrderApplication");
    const orders = await db.collection('Orders').find().toArray()
    res.render("dashBoard", {
      orders : orders,
      mls : {
        mlsClassic : false,
        mlsPremium : false
      },
      enclosedWithCase : {
        tray : false,
        byte : false
      },
      moment : moment,
      all : true,
      incomplete : false,
      complete : false
    });
    
  } catch (error) {
    console.log(error);
    
  }
  
};

module.exports = {
  dashBoard,
};
