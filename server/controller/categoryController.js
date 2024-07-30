const { error } = require("console");
const categoryDb = require("../model/categorySchema");
const multer = require("multer");
const path = require("path");
const { callbackify } = require("util");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "category");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.filename}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage }).single("categoryImg");

exports.create = async (req, res) => {
  upload(req, {}, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ error: "Image Error" + error });
    } else if (error) {
      return res.status(500).json({ error: "Internal Server Error" + error });
    }
    const requireFields = ["categoryName"];
    for (const filed of requireFields) {
      if (!req.body[filed]) {
        return res
          .status(400)
          .send({ message: `Error : Missing ${field} field` });
      }
    }

    const categoryImg = req.file.path;

    const category = new categoryDb({
      ...req.body,
      categoryImg: categoryImg,
    });

    category
      .save(category)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || " Some Error Occured Creating List",
        });
      });
  });
};

exports.find = async (req, res) => {
  categoryDb
    .find()
    .then((categories) => {
      res.send(categories);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error Occured While Reterving Data",
      });
    });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  let categoryImg;

  upload(req, {}, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ error: "Image Error" + error });
    } else if (error) {
      return res.status(500).json({ error: "Internal Server Error" + error });
    }
    try{
      if (req.file){
        categoryImg = path.join("category",req.file.filename);
      }
      const category = await categoryDb.findById(id);
      console.log(category);
      if(!category){
        return res.status(404).send({
          message:"Category Not Found!",
        });
      }
      const updatedData ={
        ...req.body,
        categoryImg : categoryImg,
      };
      const updated = await categoryDb.findByIdAndUpdate(id,updatedData,{new:true});
      res.status(200).json(updated);
    }catch (err){
      console.error(err);
      res.status(500).json({error :"Inernal Server Error"});
    }
  });
};

// Delete A Category

exports.remove = async(req,res)=> {
  const id = req.params.id;
  categoryDb
  .findByIdAndDelete(id)
  .then((data)=> {
    if (!data) {
      res.status(404).send({message :`Cannot delete the data id`+id});
  }else{
        res.send({ message : "Category Deleted Successfully"});
  }
})
 .catch((err)=>{
  res.status(500).send({ message:"COuld Not Delete Category item" + err,});
 });

};
