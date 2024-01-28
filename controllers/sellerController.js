const Seller = require("../models/seller");
const Item = require("../models/item");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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

exports.seller_create_get = (req, res) => {
	res.render("seller_create");
};

const validateSeller = [
	body("name")
		.trim()
		.isLength({ min: 1, max: 100 })
		.escape()
		.withMessage("Name can't be blank and is at most 100 characters"),
	body("description")
		.trim()
		.isLength({ min: 1, max: 300 })
		.escape()
		.withMessage("Description can't be blank and is at most 300 characters"),
];

exports.seller_create_post = [
	validateSeller,

	asyncHandler(async (req, res) => {
		const errors = validationResult(req);

		const seller = new Seller({
			name: req.body.name,
			description: req.body.description,
		});

		if (!errors.isEmpty()) {
			res.render("seller_create", {
				errors: errors.array(),
			});
			return;
		}

		await seller.save();
		res.redirect(seller.url);
	}),
];

// Render the update seller page
exports.seller_update_get = asyncHandler(async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		const err = new Error("Page not found: Invalid Seller ID");
		err.status = 400;
		return next(err);
	}
	const seller = await Seller.findById(req.params.id);
	if (seller === null) {
		const err = new Error("Page not found: Item not found");
		err.status = 404;
		return next(err);
	}
	res.render("seller_create", {
		pageTitle: "Update a seller!",
		seller,
	});
});

// Handle updating a seller
exports.seller_update_post = [
	validateSeller,
	asyncHandler(async (req, res) => {
		const errors = validationResult(req);
		const seller = new Seller({
			_id: req.params.id,
			name: req.body.name,
			description: req.body.description,
		});
		if (!errors.isEmpty()) {
			return res.render("seller_create", {
				pageTitle: "Update a seller!",
				seller,
				errors: errors.array(),
			});
		}
		const updatedSeller = await Seller.findByIdAndUpdate(req.params.id, seller);
		res.redirect(updatedSeller.url);
	}),
];

/*
+ Deleting a seller

*/

exports.seller_delete_get = asyncHandler(async (req, res) => {
	// Check id for seller
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		const err = new Error("Page Not Found: Invalid ID for Seller");
		err.status = 400;
		return next(err);
	}

	const [seller, items] = await Promise.all([
		Seller.findById(req.params.id),
		Item.find({ seller: req.params.id }),
	]);

	// Ensure a seller was actually found
	if (seller === null) {
		const err = new Error("Page Not Found: Item not found");
		err.status = 404;
		return next(err);
	}

	// Render the item_delete page
	res.render("seller_delete", {
		seller,
		items,
	});
});

exports.seller_delete_post = asyncHandler(async (req, res) => {
	// route parameter id should be valid and linked to existing document due
	// to checks in seller_delete_get

	const [seller, items] = await Promise.all([
		Seller.findById(req.params.id),
		Item.find({ seller: req.params.id }),
	]);

	// If there are still items associated with the seller, re-render the seller_delete page
	if (items.length > 0) {
		return res.render("seller_delete", {
			seller,
			items,
		});
	}

	// At this point, no items associated with seller, so delete the seller and
	// redirect the user back to the page that lists all sellers
	await Seller.findByIdAndDelete(req.params.id);
	res.redirect("/sellers");
});
