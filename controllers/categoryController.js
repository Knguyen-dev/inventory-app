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

exports.category_create_get = (req, res) => {
	res.render("category_create", {
		pageTitle: "Create a new category!",
	});
};

/*
+ Creating a category:

+ Validation: 
- Client side/browser form validation: We have our 
  client side validation in our markup, such as 'required'
  or 'maxlength'. This allows for quick validation without 
  us having to use the backend. However, we also have our 
  backend server-side validation that acts as a safety net
  in case the user bypasses or disables the client side validation.
- How to implement validation:
1. Look at our schema requirements. Then implement the server-side validation.
  Then implement the client-side validation. This allows us to be consistent.

+ Handling encoding and decoding:
- Situation: User enters "It's a good day outside.", the ' is 
  going to be converted into an html entity number, a number or 
  seequence that represents that character. However we need to 
  output the original ' symbol, instead of its html entity number.
  Here's how we can do this and enforce secure application practices:
1. For input data coming into our backend, we escape it, turning 
  any characters into HTML entities, which helps prevent any malicious
  input.
2. Then when outputting that data, we do <%- %> to output escaped content, 
  so any html entities are automatically converted back into their human 
  readable character form.

- validateCategory: Our array of input validation/sanitization middleware.
  We compartimentalize it into an array and variable, so that we don't have
  to repeat ourselves everytime.
*/

const validateCategory = [
	body("name")
		.trim()
		.isLength({ min: 1, max: 100 })
		.escape()
		.withMessage("Name can't be empty and at most has 100 characters"),

	body("description")
		.trim()
		.isLength({ min: 1, max: 300 })
		.escape()
		.withMessage("Description can't be empty and at most has 300 characters"),
];

exports.category_create_post = [
	validateCategory,

	asyncHandler(async (req, res, next) => {
		// Validation and sanitize our data
		const errors = validationResult(req);

		// Create category model instance
		const category = new Category({
			name: req.body.name,
			description: req.body.description,
		});

		// If there are errors, re-render the page with the errors
		if (!errors.isEmpty()) {
			return res.render("category_create", {
				pageTitle: "Create a new category!",
				errors: errors.array(),
			});
		}

		// Else no errors, so save the category to the database and redirect
		// the user to its url.
		await category.save();
		res.redirect(category.url);
	}),
];

/*
+ Rendering update category form: Gets a category from the database via 
  it's ID, and renders our form on it. Note that we render
  the 'category_create' page for updating. The reason is that 
  we're using this page for creating and updating categories.

1. Ensure the ID is valid. To protect in cases where user manually edits 
  the id in the url.
2. Ensure the ID actually found a document, again a safety net for 
  when the user manually edits the id in the url.


*/
exports.category_update_get = asyncHandler(async (req, res, next) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		const err = new Error("Page not found: Invalid Category ID");
		err.status = 400;
		return next(err);
	}
	const category = await Category.findById(req.params.id);
	if (category === null) {
		const err = new Error("Page not found: Category not found");
		err.status = 404;
		return next(err);
	}
	res.render("category_create", {
		pageTitle: "Update a category!",
		category,
	});
});

/*
+ Updating a category:

1. No need to check the id in this case because the ID should be a route parameter.
  If the user enters a bad route parameter then our category_update_get should 
  respond with an error, not letting the user access the form. This just ensures 
  our id is always valid and pointing to an existing thing if we're showing the form
2. Create a category object with the old id, so that Mongoose doesn't create 
  a new one. This represents the new category object.
3. Update it in the database and redirect the user to the url of the category.
*/
exports.category_update_post = [
	validateCategory,
	asyncHandler(async (req, res) => {
		const errors = validationResult(req);
		const category = new Category({
			_id: req.params.id,
			name: req.body.name,
			description: req.body.description,
		});

		if (!errors.isEmpty()) {
			return res.render("category_create", {
				pageTitle: "Update a category!",
				category,
				errors: errors.array(),
			});
		}

		const updatedCategory = await Category.findByIdAndUpdate(
			req.params.id,
			category
		);
		res.redirect(updatedCategory.url);
	}),
];

/*
+ Deleting a category

*/
exports.category_delete_get = asyncHandler(async (req, res, next) => {
	// Check validity of route parameter
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		const err = new Error("Page Not Found: Invalid ID for Category");
		err.status = 400;
		return next(err);
	}

	// Fetch for data
	const [category, items] = await Promise.all([
		Category.findById(req.params.id),
		Item.find({
			category: req.params.id,
		}),
	]);

	// Ensure a category was actually found
	if (category === null) {
		const err = new Error("Page Not Found: Category not found");
		err.status = 404;
		return next(err);
	}

	// Render corresponding pages
	res.render("category_delete", {
		category,
		items,
	});
});

/*
+ Handle deleting a category

1. router parameter ensured to be valid and linked to an existing document due to our 
  2 conditional checks category_delete_get. Of course this works because the get 
  and post requests happen at the same route.

2. Fetch category and items. Ensure that there are zero items linked to the
  category.

- NOTE: Our post handler is pretty easy because we're assuming that our route 
  handler is getting a route parameter 'id' representing the document id of the 
  category. However, you can do this differently with input type=hidden, which 
  is specifically used in situations like these where you want to pass info to
  the server, that you don't want the user to see. Just note that this is a 
  

*/
exports.category_delete_post = asyncHandler(async (req, res) => {
	const [category, items] = await Promise.all([
		Category.findById(req.params.id),
		Item.find({
			category: req.params.id,
		}),
	]);

	// If there are items, stop the process early, and render the category_delete page
	if (items.length > 0) {
		return res.render("category_delete", {
			category,
			items,
		});
	}

	// At this point, no items linked to category, so delete category and redirect
	// the user back to the category_list page
	await Category.findByIdAndDelete(req.params.id);
	res.redirect("/categories");
});
