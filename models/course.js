// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  display: { type: String, required: true }
});

module.exports = mongoose.model('Course', courseSchema);