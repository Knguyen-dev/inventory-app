const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");

const connectToDb = require("./db");

const indexRouter = require("./routes/index");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Connect to the database
connectToDb();

// Maximum of 10 requests every 10 seconds
const limiter = RateLimit({
	windowMs: 1 * 10 * 1000, // 10 seconds
	max: 10,
});

app.use(limiter);
app.use(compression());
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			// Only allow scripts from the same domain
			"script-src": ["'self'"],
		},
	})
);

// Connect our routes
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
