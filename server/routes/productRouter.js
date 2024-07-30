const express = require("express");
const productRoute = express.Router();
const productController = require("../controller/productController");
const multer = require('multer');

const storage = multer.memoryStorage();
const uploadMiddleware = multer({ storage })
productRoute.put("/update-product", uploadMiddleware.array('images'), productController.update);
productRoute.delete("/delete-product/:id", productController.remove);
productRoute.post("/create-product", uploadMiddleware.array('files', 3), productController.create);
productRoute.get("/get-products", productController.getAllProducts);
productRoute.post("/get-product", productController.getProducts);

module.exports = productRoute;
