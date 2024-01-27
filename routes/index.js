const express = require("express");
const router = express.Router();
const category_controller = require("../controllers/categoryController");
const item_controller = require("../controllers/itemController");
const seller_controller = require("../controllers/sellerController");

/* GET home page. */
router.get("/", category_controller.index);

router.get("/categories", category_controller.category_list);

router.get("/category/:id", category_controller.category_details);

router.get("/items", item_controller.item_list);

router.get("/item/:id", item_controller.item_details);

router.get("/sellers", seller_controller.seller_list);

router.get("/seller/:id", seller_controller.seller_details);

module.exports = router;
