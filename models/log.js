// models/Log.js
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  courseId: { type: String, required: true },
  uvuId: { type: String, required: true },
  date: { type: String, required: true },
  text: { type: String, required: true },
  id: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Log', logSchema);