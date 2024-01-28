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

categorySchema.virtual("delete_url").get(function () {
	return `/category/${this._id}/delete`;
});


module.exports = mongoose.model("Category", categorySchema, "categories");
