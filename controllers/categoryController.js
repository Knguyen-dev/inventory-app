const Category = require("../models/category");
const Item = require("../models/item");
const Seller = require("../models/seller");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res) => {
	const [numCategories, numItems, numSellers] = await Promise.all([
		Category.countDocuments(),
		Item.countDocuments(),
		Seller.countDocuments(),
	]);

	res.render("index", {
		pageTitle: "Home",
		numCategories,
		numItems,
		numSellers,
	});
});

exports.category_list = asyncHandler(async (req, res) => {
	const categories = await Category.find();
	res.render("category_list", {
		categories,
	});
});

exports.category_details = asyncHandler(async (req, res, next) => {
	// Check if parameter id is valid first
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		const err = new Error("Page Not Found: Invalid ID for Category");
		err.status = 400;
		return next(err);
	}

	// Fetch category and products within that category in parallel
	const [category, items] = await Promise.all([
		Category.findById(req.params.id),
		Item.find({
			category: req.params.id,
		}),
	]);

	// Check if the id didn't match a category in the database
	if (category === null) {
		const err = new Error("Page not found: Category not found");
		err.status = 404;
		return next(err);
	}

	// Render the category_details page
	res.render("category_details", {
		category,
		items,
	});
});
