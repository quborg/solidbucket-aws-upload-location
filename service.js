const path = require("path");
const fs = require("fs");
const AWS = require("aws-sdk");
const { AwsWrapper } = require("solid-bucket/lib/providers/aws");

const bucketName = "miloud-bucket";

function getAWS() {
  const wasabiEndpoint = new AWS.Endpoint("s3.wasabisys.com");
  let s3 = new AWS.S3({
    endpoint: wasabiEndpoint,
    accessKeyId: "QF8EO8NNCJCD6TDVVTPS",
    secretAccessKey: "YrzqZQ3GpguY4Dg2lo4FDPAimypRFu3kpvFTXsH9",
    region: "us-east-1",
  });

  return new AwsLib(s3);
}

class AwsLib extends AwsWrapper {
  constructor(s3) {
    super(s3);
    let self = this;
    self.uploadFile = (filePath, bucketName) => {
      if (!bucketName || !filePath) {
        return new Promise((resolve, reject) => {
          reject({
            status: 400,
            message: "Invalid parameters",
          });
        });
      }

      let params = {
        Bucket: bucketName,
        Key: path.basename(filePath),
        Body: fs.createReadStream(filePath),
      };
      let fileSize = fs.statSync(filePath);

      let preferredPartSize = (fileSize.size > 50000 ? 10 : 5) * 1024 * 1024;
      let options = {
        partSize: preferredPartSize,
        queueSize: 10,
      };

      return new Promise((resolve, reject) => {
        self.s3.upload(params, options, (err, data) => {
          console.log("data", data);
          if (!err) {
            resolve({
              status: 200,
              message: `File "${filePath}" was uploaded successfully to bucket "${bucketName}"`,
              location: data.Location,
            });
          } else {
            reject({
              status: 400,
              message: err.message,
            });
          }
        });
      });
    };
  }
}

let provider = new getAWS();

provider
  .createBucket(bucketName)
  .then((resp) => {
    console.log(resp.message);
  })
  .catch((resp) => {
    console.log(resp.message);
  });

module.exports = provider;
