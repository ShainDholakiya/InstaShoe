const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shoesSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  size: { type: String, required: true },
  condition: { type: String, required: true }
});

const Trade = mongoose.model("Trade", shoesSchema);

module.exports = Trade;
