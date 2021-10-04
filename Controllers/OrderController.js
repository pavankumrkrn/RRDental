const moment = require("moment");
const { URL } = require("../MongoDb/mongoUrl");
const mongodb = require("mongodb");
const fs = require('fs');
const path = require('path');
const fast2sms = require('fast-two-sms');
require('dotenv').config();

const mongoClient = mongodb.MongoClient

const create = async (req, res) => {
  try {
    res.render("orderForm");
  } catch (error) {
    res.json({
      error: "Something went wrong",
    });
  }
};

const sendOrders = async (req, res) => {
  const { orders } = req.body;
  try {
  const client = await mongoClient.connect(URL, {
    useNewURLParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("OrderApplication");
  const ids = orders.map((i) =>  new mongodb.ObjectId(i));
  const ns = await db.collection('Orders').find({
    '_id' : {
      $in : ids
    }
  }).toArray();
  ns.forEach(async (order) => {
    const options = {
      authorization : process.env.api_key , 
      message : 'Your Order is placed, order id is '+order.orderId ,  
      numbers : [order.contactNumber]
    } 
    await fast2sms.sendMessage(options);
  })
  
  res.json({
    message : "orders sent successfully"
  })
    
  } catch (error) {
    console.log(error);
    res.json({
        message : "An error occurred. Please try again."
      }); 
  }
}

const getOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const client = await mongoClient.connect(URL, {
      useNewURLParser: true,
      useUnifiedTopology: true,
    });
    const orderObj = orderId.split(":")
    const db = client.db("OrderApplication");
    const order = await db.collection("Orders").findOne({ _id: new mongodb.ObjectId(orderId) });
    if (order) {
      res.json({
        order
      });
    } else {
      res.json({
        error: "Order not found",
      });
    }

  } catch (error) {
    console.log(error);
    res.json({
      error: "Something went wrong",
    });
  }
};

const update = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const client = await mongoClient.connect(URL, {
      useNewURLParser: true,
      useUnifiedTopology: true,
    });
    const orderObj = orderId.split(":")
    if (orderObj[0] === 'orderUpdate') {
      const db = client.db("OrderApplication");
      const order = await db.collection("Orders").findOne({ _id: new mongodb.ObjectId(orderObj[1]) });
      if (order) {
        res.render("updateOrder", {
          order: order,
          moment: moment
        });
      } else {
        res.json({
          error: "Order not found",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      error: "Something went wrong",
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const { order } = req.body;
    const client = await mongoClient.connect(URL, {
      useNewURLParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db("OrderApplication");
    await db.collection("Orders").insertOne(order).then((result) => {
      res.json({
        message: "Order placed successfully",
        url: "thankyou",
        orderId: result.insertedId
      })
    }).catch((error) => {
      res.json({
        error: error
      })
    });

  } catch (error) {
    console.log(error);
    res.json({
      error: "Something went wrong",
    });
  }
};

// const upload = async (req, res) => {
//   try {

//     const { imfiles } = req.body;
//     console.log( imfiles);
//     // const dir = __dirname.split("\\")
//     // dir.pop();
//     // const image = {
//     //   id : req.params.id,
//     //   img : {
//     //     data : fs.readFileSync(path.join(dir.join("\\") + '/uploads/' + req.file.filename)),
//     //     contentType: req.file.mimetype
//     //   }
//     // }
//     // const client = await mongoClient.connect(URL, {
//     //   useNewURLParser: true,
//     //   useUnifiedTopology: true,
//     // });
//     // const db = client.db("OrderApplication");
//     // await db.collection("Images").insertOne(image);
//     // res.json({
//     //   message: "Order placed successfully",
//     //   url: "thankyou",
//     // });
//   } catch (error) {
//     console.log(error);
//   }
// }

const updateOrder = async (req, res) => {
  try {
    const { order } = req.body
    const id = order._id
    console.log(order);
    const client = await mongoClient.connect(URL, {
      useNewURLParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db("OrderApplication");
    const existingOrder = await db.collection("Orders").findOne({ _id: new mongodb.ObjectId(id) });
    if (existingOrder) {
      delete order["_id"];
      db.collection('Orders').replaceOne({ _id: new mongodb.ObjectId(id) }, order);
      res.json({
        url: "dashboard",
        message: "Order updated successfully"
      })
    } else {
      res.json({
        error: "Order not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      error: "Something went wrong",
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { orders } = req.body
    if (orders) {
      const client = await mongoClient.connect(URL, {
        useNewURLParser: true,
        useUnifiedTopology: true,
      });
      const db = client.db("OrderApplication");
      orders.forEach(async (orderId, id) => {
        await db.collection('Orders').deleteOne({ _id: new mongodb.ObjectId(orderId) });
      })
      res.json({
        message: "Record deleted successfully."
      })
    } else {
      res.json({
        error: "Order not found",
      });
    }
  } catch (error) {
    res.json({
      error: "Something went wrong",
    });
  }
};

const completeOrder = async (req, res) => {
  try {
    const { orders } = req.body
    const client = await mongoClient.connect(URL, {
      useNewURLParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db("OrderApplication");
    console.log(orders)
    if (orders) {
      orders.forEach(async (orderId) => {
        db.collection('Orders').updateOne({ _id: new mongodb.ObjectId(orderId) }, {
          $set: { completed: true },
          $currentDate: { lastModified: true }
        })
      });
      res.json({
        message: "Orders completed Successfully."
      })
    } else {
      res.json({
        error: "Order not found",
      });
    }
  } catch (error) {
    res.json({
      error: "Something went wrong",
    });
  }
};

const getIncomeCompleteOrders = async (req, res) => {
  try {
    const client = await mongoClient.connect(URL, {
      useNewURLParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db("OrderApplication");
    const orders = await (await db.collection('Orders').find().toArray()).filter((i, index) => !i.completed);
    res.json({
      orders: orders,
    });

  } catch (error) {
    res.json({
      error: "Something went wrong",
    });
  }
};

const getCompleteOrders = async (req, res) => {
  try {
    const client = await mongoClient.connect(URL, {
      useNewURLParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db("OrderApplication");
    const orders = await (await db.collection('Orders').find().toArray()).filter((i, index) => i.completed);
    res.json({
      orders: orders,
    });

  } catch (error) {
    res.json({
      error: "Something went wrong",
    });
  }
};

module.exports = {
  create,
  update,
  createOrder,
  updateOrder,
  deleteOrder,
  completeOrder,
  getOrder,
  sendOrders,
  getIncomeCompleteOrders,
  getCompleteOrders,
};
