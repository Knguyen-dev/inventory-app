const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
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

sellerSchema.virtual("url").get(function () {
	return `/seller/${this._id}`;
});

sellerSchema.virtual("update_url").get(function () {
	return `/seller/${this._id}/update`;
});

module.exports = mongoose.model("Seller", sellerSchema);
