/*
+ Populate the database with your items. Use the populateDb fro mthe mdn express tutorial 
  to help yourself out
*/

const Category = require("./models/category");
const Seller = require("./models/seller");
const Item = require("./models/item");
const mongoose = require("mongoose");

let categories = [];
let sellers = [];
let items = [];

async function createCategory(index, name, description) {
	const category = new Category({
		name: name,
		description: description,
	});
	await category.save();
	categories[index] = category;
	console.log(`Added category: ${name}`);
}

async function createSeller(index, name, description) {
	const seller = new Seller({
		name: name,
		description: description,
	});
	await seller.save();
	sellers[index] = seller;
	console.log(`Added seller: ${name}`);
}

async function createItem(
	index,
	name,
	description,
	category,
	seller,
	price,
	number_in_stock
) {
	const item = new Item({
		name: name,
		description: description,
		category: category._id,
		seller: seller._id,
		price: price,
		number_in_stock: number_in_stock,
	});
	await item.save();
	items[index] = item;
	console.log(`Added item: ${name}`);
}

async function loadCategories() {
	console.log("Adding categories");
	await Promise.all([
		createCategory(0, "Food & Groceries", "Foods and grocery items"),
		createCategory(1, "Technology", "Gadgets and electronics"),
		createCategory(2, "Books", "Books of various genres"),
		createCategory(
			3,
			"Entertainment",
			"Various movies, shows, and video games"
		),
		createCategory(4, "Beauty and health", "Beauty and health products"),
	]);
}

async function loadSellers() {
	console.log("Adding sellers");
	await Promise.all([
		createSeller(
			0,
			"Creation Corp.",
			"Technocrats and producers of industry leading tech."
		),
		createSeller(
			1,
			"Monsieur Boulangerie Inc.",
			"World's finest bakers and makers of your favorite pastries."
		),
		createSeller(
			2,
			"Universal Libraire",
			"We're a company that sells books from all over the world. From superhero comic, to ancient greek literature, find your book today!"
		),
		createSeller(
			3,
			"Artist Entertainment",
			"Come stream your favorite shows or movies!"
		),
		createSeller(
			4,
			"Crema & Sol",
			"The best producers of beauty products! Come get your shampoo, makeup, eyeliner, and other essentials."
		),
	]);
}

async function loadItems() {
	console.log("Adding items");
	await Promise.all([
		createItem(
			0,
			"Milky Way Cookies",
			"Cosmic cookies that taste like cosmic dust itself.",
			categories[0],
			sellers[1],
			12.99,
			120
		),
		createItem(
			1,
			"iPhone 15",
			"The latest flagship smartphone from Creation Corp.",
			categories[1],
			sellers[0],
			999.99,
			50
		),
		createItem(
			2,
			"The Hitchhiker's Guide to the Galaxy",
			"A classic science fiction comedy by Douglas Adams.",
			categories[2],
			sellers[2],
			15.99,
			80
		),
		createItem(
			3,
			"Nintendo Switch",
			"A versatile gaming console for home and on-the-go entertainment.",
			categories[3],
			sellers[3],
			299.99,
			30
		),
		createItem(
			4,
			"Organic Lavender Shampoo",
			"Gentle shampoo infused with organic lavender extracts.",
			categories[4],
			sellers[4],
			9.99,
			100
		),
	]);
}

async function loadData() {
	try {
		console.log("MongoDB about to connect...");
		await mongoose.connect(process.env.uri);
		console.log("MongoDB is connected!");

		await loadCategories();
		await loadSellers();
		await loadItems();

		mongoose.connection.close();
		console.log("MongoDB connection closed!");
	} catch (err) {
		console.log(err);
	}
}
loadData();
