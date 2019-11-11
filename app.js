const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const multer = require("multer");

const upload = multer();
const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const aws = require("./helpers/aws");

const app = express();

// ROUTES FOR UPLOAD API
const router = express.Router();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

router.post("/upload", upload.any(), async function(req, res) {
  try {
    Date.prototype.yyyymmdd = function() {
      var mm = this.getMonth() + 1; // getMonth() is zero-based
      var dd = this.getDate();
      return [
        this.getFullYear(),
        (mm > 9 ? "" : "0") + mm,
        (dd > 9 ? "" : "0") + dd
      ].join("");
    };
    if (!!req.files && req.files instanceof Array && req.files.length > 0) {
      const pathToUpload = "Images/" + new Date().yyyymmdd();
      const fileUploadResp = await aws.uploadAllFiles(
        req.files,
        pathToUpload,
        res
      );
      if (!!fileUploadResp && fileUploadResp.success) {
        return res.json(fileUploadResp);
      } else {
        return res.status(400).json(fileUploadResp);
      }
    } else {
      const noFileFound = {
        success: false,
        message: "No files found"
      };
      return res.status(400).json(noFileFound);
    }
  } catch (error) {
    res.status(403).json(error);
  }
});

app.use("/", router);

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-kkm3j.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen(8000);
    console.log("App listen to port 8000");
  })
  .catch(err => {
    console.log(err);
  });
