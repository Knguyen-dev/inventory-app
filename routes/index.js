const express = require("express");
const router = express.Router();
const category_controller = require("../controllers/categoryController");
const item_controller = require("../controllers/itemController");
const seller_controller = require("../controllers/sellerController");

/* GET home page. */
router.get("/", category_controller.index);

router.get("/categories", category_controller.category_list);
router.get("/category/create", category_controller.category_create_get);
router.post("/category/create", category_controller.category_create_post);
router.get("/category/:id", category_controller.category_details);

router.get("/category/:id/update", category_controller.category_update_get);
router.post("/category/:id/update", category_controller.category_update_post);

router.get("/category/:id/delete", category_controller.category_delete_get);
router.post("/category/:id/delete", category_controller.category_delete_post);

router.get("/items", item_controller.item_list);
router.get("/item/create", item_controller.item_create_get);
router.post("/item/create", item_controller.item_create_post);
router.get("/item/:id", item_controller.item_details);

router.get("/item/:id/update", item_controller.item_update_get);
router.post("/item/:id/update", item_controller.item_update_post);

router.get("/item/:id/delete", item_controller.item_delete_get);
router.post("/item/:id/delete", item_controller.item_delete_post);

router.get("/sellers", seller_controller.seller_list);
router.get("/seller/create", seller_controller.seller_create_get);
router.post("/seller/create", seller_controller.seller_create_post);
router.get("/seller/:id", seller_controller.seller_details);

router.get("/seller/:id/update", seller_controller.seller_update_get);
router.post("/seller/:id/update", seller_controller.seller_update_post);
router.get("/seller/:id/delete", seller_controller.seller_delete_get);
router.post("/seller/:id/delete", seller_controller.seller_delete_post);

module.exports = router;
