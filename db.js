const mongoose = require("mongoose");
async function connectToDb() {
	try {
		await mongoose.connect(process.env.uri);
		console.log("Connected to MongoDb");
	} catch (err) {
		console.error(err);
	}
}
module.exports = connectToDb;
