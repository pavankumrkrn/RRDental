
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
    const orders = await db.collection('Orders').find().toArray();
    const implantStrings = {
      screwRetainedDMLS : 'Screw Retained DMLS - Crown & Bridge',
      screwRetainedZirconia : 'Screw Retained Zirconia - Crown & Bridge',
      screwRetainedDMLBar : 'Screw Retained DMLS Bar with PMMA',
      prosthesiesDMLS : 'Ident Prosthesis (DMLS Framework with Zirconia Individual Crowns or Composite Full Crowns)',
      prosthesisTitanium : 'Ident Prosthesis (Titanium Framework with Zirconia Individual Crowns or Composite Full Crowns)',
      screwRetainedPM : 'Screw Retained PAULO MALO Frame Work Titanium  with Individual Crowns',
      screwRetainedPeek: 'Screw Retained PEEK (DMLS Framework, PEEK with Composite)'
    }
    res.render("dashBoard", {
      orders : orders,
      implantStrings : implantStrings,
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
