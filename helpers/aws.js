const aws = require("aws-sdk");
const s3bucket = new aws.S3({
  accessKeyId: "AKIAITKEDQQYFINEZ75Q",
  secretAccessKey: "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"
});

const isImage = (file, mime) => {
  if (!!mime && mime.trim() !== "" && mime.toUpperCase().includes("IMAGE")) {
    return true;
  } else if (/(gif|jpg|jpeg|png|svg|tiff)$/i.test(file || "")) {
    return true;
  } else {
    return false;
  }
};

const s3Upload = (file, path) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: "demo-gallery",
      Key: `${path}/${file.originalname}`,
      Body: file.buffer,
      ACL: 'public-read'
    };
    s3bucket.upload(params, function(error, data) {
      if (error) {
        return reject({
          success: false,
          error
        });
      } else {
        return resolve({
          success: true,
          data
        });
      }
    });
  });
};

const uploadAllFiles = async function(files, pathToStoreFile) {
  return await Promise.all(
    files.map(async file => {
      let fileUploads = {};
      let fileUrl = null;
      let fileKey = file.fieldname || "image";
      if (isImage(file.originalname, file.mimetype)) {
        const uploadPost = await s3Upload(file, pathToStoreFile);
        if (!!uploadPost && uploadPost.success) {
          fileUrl = uploadPost.data.Location;
        }
      }
      fileUploads[fileKey] = fileUrl;
      return fileUploads;
    })
  )
    .then(res => {
      return {
        success: true,
        data: res,
        message: "Upload Success"
      };
    })
    .catch(err => {
      return {
        success: false,
        err: err
      };
    });
};
module.exports = {
  uploadAllFiles
};
