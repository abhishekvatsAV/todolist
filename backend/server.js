const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const Item = require("./models/itemSchema");

//express app
const app = express();

// middleware & static files
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

// routes
app.get("/", async (req, res) => {
  let items = await Item.find();
  res.status(200).send(items);
});

app.put("/", async (req, res) => {
  let items = req.body.items;
  let existingItem = await Item.countDocuments({});
  let newItem;
  if (!existingItem) {
    newItem = new Item({
      item: [],
    });
    await newItem.save();
  }
  await Item.updateOne(
    { _id: req.body.itemId || newItem?._id },
    { $set: { item: items } }
  );
  res.status(200).json({
    itemId: req.body.itemId || newItem?._id,
  });
});

const PORT = process.env.PORT || 4000;
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(PORT, () => {
      console.log("Connected with DB and Server started on " + PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
