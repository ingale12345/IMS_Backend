const express = require("express");
const config = require("config");
const bodyParser = require("body-parser");
const app = express();
const PORT = config.get("PORT") || 5001;
app.use(bodyParser.json()); // <--- Here
app.use(bodyParser.urlencoded({ extended: true }));
const userRouter = require("./route/user");
const categoriesRouter = require("./route/categories");
const shopRouter = require("./route/shops");
const itemclassesRouter = require("./route/itemClasses");
const itemsRouter = require("./route/items");
const shopItemsRouter = require("./route/shopItems");
const requisitionRouter = require("./route/requisitions");
const loginRouter = require("./route/login");

const cors = require("cors");
app.use(cors());
app.use("/api/users/", userRouter);
app.use("/api/categories/", categoriesRouter);
app.use("/api/shops/", shopRouter);
app.use("/api/itemClasses/", itemclassesRouter);
app.use("/api/items/", itemsRouter);
app.use("/api/shopItems", shopItemsRouter);
app.use("/api/requisitions", requisitionRouter);
app.use("/api/login", loginRouter);
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
  require("./database/db")();
});
