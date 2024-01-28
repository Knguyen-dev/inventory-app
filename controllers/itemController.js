const Item = require("../models/item");
const Category = require("../models/category");
const Seller = require("../models/seller");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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

exports.item_create_get = asyncHandler(async (req, res) => {
	const [categories, sellers] = await Promise.all([
		Category.find({}, "name").sort({ name: 1 }),
		Seller.find({}, "name").sort({ name: 1 }),
	]);

	// If either no categories or no sellers were found we render the alert page
	if (categories.length === 0 || sellers.length === 0) {
		res.render("item_create_alert");
		return;
	}

	res.render("item_create", {
		pageTitle: "Create a new item!",
		categories,
		sellers,
	});
});

const validateItem = [
	body("name")
		.trim()
		.isLength({ min: 1, max: 100 })
		.escape()
		.withMessage("Name can't be blank and is at most 100 character"),
	body("description")
		.trim()
		.isLength({ min: 1, max: 300 })
		.escape()
		.withMessage("Name can't be blank and is at most 300 character"),
	// Remember category and seller are just id strings, but we can still validate
	// Saying if the user didn't pick them, id strings are blank, then that's invalid
	body("category", "Category can't be empty")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("seller", "Seller can't be empty").trim().isLength({ min: 1 }).escape(),
];

exports.item_create_post = [
	validateItem,

	asyncHandler(async (req, res, next) => {
		/*
    + Validate and sanitize data
    - NOTE: Here we just assume that the user isn't going to do inspect element 
      and mess with the IDs of the options.
    */
		const errors = validationResult(req);

		const item = new Item({
			name: req.body.name,
			description: req.body.description,
			category: req.body.category,
			seller: req.body.seller,
			price: req.body.price,
			number_in_stock: req.body.number_in_stock,
		});

		if (!errors.isEmpty()) {
			res.render("item_create", {
				pageTitle: "Create a new item!",
				errors: errors.array(),
			});
			return;
		}

		await item.save();
		res.redirect(item.url);
	}),
];

/*
+ Rendering update item form: Get a item from the database via ID, and 
  render our "item_create" page, now with that item's information filled in.
*/
exports.item_update_get = asyncHandler(async (req, res, next) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		const err = new Error("Page not found: Invalid Item ID");
		err.status = 400;
		return next(err);
	}

	const [item, categories, sellers] = await Promise.all([
		Item.findById(req.params.id),
		Category.find(),
		Seller.find(),
	]);

	if (item === null) {
		const err = new Error("Page not found: Item not found");
		err.status404;
		return next(err);
	}

	res.render("item_create", {
		pageTitle: "Update a item!",
		item,
		categories,
		sellers,
	});
});

// Updating an item
exports.item_update_post = [
	validateItem,
	asyncHandler(async (req, res) => {
		// Validate and sanitize the data in the request
		const errors = validationResult(req);

		// Create our new item object, which we will insert into the database.
		// Note how we still have the old id, so that Mongoose doesn't create a new one
		const item = new Item({
			_id: req.params.id,
			name: req.body.name,
			description: req.body.description,
			category: req.body.category,
			seller: req.body.seller,
			price: req.body.price,
			number_in_stock: req.body.number_in_stock,
		});

		if (!errors.isEmpty()) {
			return res.render("item_create", {
				pageTitle: "Update an item!",
				item: item,
				errors: errors.array(),
			});
		}

		// Find the item by id, and update it with the new version we made.
		const updatedItem = await Item.findByIdAndUpdate(req.params.id, item);
		res.redirect(updatedItem.url);
	}),
];
