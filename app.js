const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const mainController = require("./Controllers/MainController");
const dashBoardController = require("./Controllers/DashBoardController");
const orderController = require("./Controllers/OrderController");
const feedbackController = require("./Controllers/FeedbackController");
const { authenticate } = require("./Auth/Authentication");

const app = express();
app.use(cors());
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb'}));
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cookieParser()); 
const port = process.env.PORT || 3001;

app.listen(port, async (req, res) => {
  console.log("Listening to " + port);
});

app.get("/", mainController.index);

app.get("/dashboard", authenticate, dashBoardController.dashBoard);

app.get("/completedOrders", authenticate, orderController.getCompleteOrders);

app.get(
  "/incompleteOrders",
  authenticate,
  orderController.getIncomeCompleteOrders
);

app.get("/logout", authenticate, mainController.logout);

app.post("/authenticate/user", mainController.login);

app.get("/order", orderController.create);

app.get("/thankyou", feedbackController.thankyou);

app.post("/createOrder", orderController.createOrder);

app.get("/:orderId", authenticate, orderController.update);

app.get("/getOrder/:orderId", authenticate, orderController.getOrder);

app.post("/updateOrder/:orderId", authenticate, orderController.updateOrder)

app.delete("/deleteOrders", authenticate, orderController.deleteOrder);

app.post("/sendOrders", authenticate, orderController.sendOrders);

app.post("/completeOrder", authenticate, orderController.completeOrder);
