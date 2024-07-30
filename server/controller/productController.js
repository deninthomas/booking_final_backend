require("dotenv").config();
const AWS = require("aws-sdk");
const path = require("path");
const productDb = require("../model/productModel");
const { v4: uuidv4 } = require("uuid");



const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadImageToS3 = (buffer, name) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: name,
    Body: buffer,
    acl: 'public-read',
  };
  return s3.upload(params).promise();
};


//Create a new Product
exports.test = async (req, res) => {
  try {

    const uploadPromises = req.files.map((image) => {
      const fileName = `${uuidv4()}${path.extname(image.originalname)}`;
      console.log('file name', fileName)
      return uploadImageToS3(image.buffer, fileName).then((data) => console.log('data', data.Location));
    });

    const productImage = await Promise.all(uploadPromises);
    console.log('product image', JSON.stringify(productImage))
    const product = new productDb({ ...req.body, image: productImage });

    product
      .save()
      .then((data) => {
        console
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          messsage: err.message || "some Error Occurred In Creating Products",
        });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.create = async (req, res) => {
  try {
    const requiredFields = ["name", "description", "price", "place", "category", "capacity", "amenities"];

    // Validate required fields
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).send({ message: `${field} is required` });
      }
    }

    // Handle image upload
    let productImages = [];
    if (req.files.length) {
      const uploadPromises = req.files.map((image) => {
        const fileName = `${uuidv4()}${path.extname(image.originalname)}`;
        return uploadImageToS3(image.buffer, fileName).then((data) => data.Location);
      });
      productImages = await Promise.all(uploadPromises);
    }

    // Create a new product with the provided data
    const product = new productDb({
      ...req.body,
      images: productImages,
    });

    // Save the product to the database
    product
      .save()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while creating the product.",
        });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Existing Product

exports.update = async (req, res) => {
  const { id } = req.body;
  try {
    const product = await productDb.findById(id);

    if (!product) {
      return res.status(400).send({ message: "Invalid Product ID" });
    }

    const updatedProduct = {
      ...product._doc,
      ...req.body,

    };

    const updated = await productDb.findByIdAndUpdate({ _id: id }, updatedProduct, {
      new: true,
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Reterive Single Product

exports.findProducts = async (req, res) => {
  const id = req.params.id;
  productDb
    .findById(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: `No data with the id ${id}` });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal Server Error" + err });
    });
};

exports.getAllProducts = async (req, res) => {
  productDb.find()
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: `No data with the id ${id}` });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal Server Error" + err });
    });
};

exports.getProducts = async (req, res) => {

  if (!req.body?.id) res.status(400).send({ message: `Invalid request payload!` })
  productDb.findById({ _id: req.body.id })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: `No data with the id ${id}` });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal Server Error" + err });
    });
};

// Delete Product

exports.remove = async (req, res) => {
  const  id  = req.params.id;
  productDb
    .findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: `Cannot delete record with the id ${id}` });
      } else {
        res.send({ message: "Product Deleted Successfully" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Cannot Delete Product" + err });
    });
};

