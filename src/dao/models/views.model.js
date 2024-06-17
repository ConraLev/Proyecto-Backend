const mongoose = require('mongoose');

const viewsSchema = new mongoose.Schema({
    viewName: { type: String, required: true },
    // Add other fields as needed
});

const ViewsModel = mongoose.model('View', viewsSchema);

module.exports = ViewsModel;
