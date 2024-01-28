const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		maxLength: 100,
		required: true,
	},
	description: {
		type: String,
		maxLength: 300,
		required: true,
	},
});

categorySchema.virtual("url").get(function () {
	return `/category/${this._id}`;
});

categorySchema.virtual("update_url").get(function () {
	return `/category/${this._id}/update`;
});

module.exports = mongoose.model("Category", categorySchema, "categories");
