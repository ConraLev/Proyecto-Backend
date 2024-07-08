const mongoose = require('mongoose');

const viewsSchema = new mongoose.Schema({
    viewName: { type: String, required: true }
});

const ViewsModel = mongoose.model('View', viewsSchema);

module.exports = ViewsModel;
