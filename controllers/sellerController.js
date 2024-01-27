const Seller = require("../models/seller");
const Item = require("../models/item");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

exports.seller_list = asyncHandler(async (req, res) => {
	const sellers = await Seller.find();
	res.render("seller_list", {
		sellers,
	});
});

exports.seller_details = asyncHandler(async (req, res, next) => {
	// Check validity for parameter id
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		const err = new Error("Page Not Found: Invalid ID for Seller");
		err.status = 400;
		return next(err);
	}

	// Fetch seller and the items they sell from the database
	const [seller, items] = await Promise.all([
		Seller.findById(req.params.id),
		Item.find({
			seller: req.params.id,
		}),
	]);

	// If no seller with said id was found
	if (seller === null) {
		const err = new Error("Page not found: Seller not found");
		err.status = 404;
		return next(err);
	}

	res.render("seller_details", {
		seller,
		items,
	});
});
