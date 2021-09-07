const moment = require("moment");
const { URL } = require("../MongoDb/mongoUrl");
const mongodb = require("mongodb");
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
    db.collection("Orders").insertOne(order);
    res.json({
      message: "Order placed successfully",
      url: "thankyou"
    })
  } catch (error) {
    res.json({
      error: "Something went wrong",
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { order } = req.body
    console.log(order);
    const client = await mongoClient.connect(URL, {
      useNewURLParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db("OrderApplication");
    const existingOrder = await db.collection("Orders").findOne({ _id: new mongodb.ObjectId(orderId) });
    if (existingOrder) {
      delete order["_id"];
      db.collection('Orders').replaceOne({ _id: new mongodb.ObjectId(orderId) }, order);
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
    res.render('dashboard', {
      orders: orders,
      mls : {
        mlsClassic : false,
        mlsPremium : false
      },
      enclosedWithCase : {
        tray : false,
        byte : false
      },
      moment: moment,
      incomplete: true
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
    res.render('dashboard', {
      orders: orders,
      mls : {
        mlsClassic : false,
        mlsPremium : false
      },
      enclosedWithCase : {
        tray : false,
        byte : false
      },
      moment: moment,
      complete: true
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
  getIncomeCompleteOrders,
  getCompleteOrders,
};
