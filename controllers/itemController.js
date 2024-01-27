const Item = require("../models/item");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

exports.item_list = asyncHandler(async (req, res) => {
	const items = await Item.find();
	res.render("item_list", {
		items,
	});
});

exports.item_details = asyncHandler(async (req, res, next) => {
	// Check validity of parameter id
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		const err = new Error("Page Not Found: Invalid ID for Item");
		err.status = 400;
		return next(err);
	}

	/*
  - Fetch item from database. Then use .populate on 'category' and 'seller', so 
    that we can convert their ObjectIds into the real models. Now we have the 
    real models for category and seller in our item model object, instead of just the 
    object ids.
  */
	const item = await Item.findById(req.params.id)
		.populate("category")
		.populate("seller");

	// If the database didn't find an item with that id
	if (item === null) {
		const err = new Error("Page not found: Item not found");
		err.status = 404;
		return next(err);
	}

	res.render("item_details", {
		item,
	});
});
