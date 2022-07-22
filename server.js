const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const routes = require("./routes");
const { sessionKeys, sessionName, currencySymbol } = require("./config");
require("dotenv").config();
const Data = require("./models/data");

app.disable("x-powered-by");

app.set("view engine", "ejs");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(
  cookieSession({
    name: sessionName,
    keys: sessionKeys,
  })
);

app.locals.currency = currencySymbol;

app.get("/", routes.home);
app.get("/cart", routes.cart);

app.post("/cart/add", routes.addToCart);
app.post("/cart/get", routes.getCart);
app.post("/cart/empty", routes.emptyCart);
app.post("/cart/remove", routes.removeFromCart);
app.post("/cart/update", routes.updateCart);

app.post("/cart", (req, res) => {
  let { name, email, address, phone, price } = req.body;
  let data = new Data({ name, email, address, phone, price });
  data
    .save()
    .then(() => {
      console.log(data);
      res.redirect("/");
    })
    .catch((err) => console.log("Error \n\n", err));
});

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connection to MongoDb is success!`);
    app.listen(port, () => {
      console.log(`Server is listening PORT ${port}...`);
    });
  } catch (error) {
    console.log(" \n Connection error!!! \n\n", error);
  }
}

start();
