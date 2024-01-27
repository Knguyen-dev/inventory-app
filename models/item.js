const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
	// Name of item
	name: {
		type: String,
		maxLength: 100,
		required: true,
	},
	// Description of item
	description: {
		type: String,
		maxLength: 300,
		required: true,
	},
	// Category that the item is in, we indicate it's an object id that references a document
	// that's a 'Category' model.
	category: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "Category",
		required: true,
	},
	// Seller of the item
	seller: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "Seller",
		required: true,
	},
	// Price of the item
	price: {
		type: Number,
		required: true,
	},
	// Number in stock
	number_in_stock: {
		type: Number,
		required: true,
	},
});

itemSchema.virtual("url").get(function () {
	return `/item/${this._id}`;
});

module.exports = mongoose.model("Item", itemSchema);
