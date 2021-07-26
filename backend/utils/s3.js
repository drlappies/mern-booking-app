require('dotenv').config
const S3 = require('aws-sdk/clients/s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path')
const { v4: uuidv4 } = require('uuid');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
    region,
    accessKey,
    secretAccessKey
})

module.exports.upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: bucketName,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, uuidv4());
        }
    }),
    limits: {
        fileSize: 1024 * 1024 * 200,
        files: 5
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('只支援JPEG/JPG圖片格式');
        }
    }
})

module.exports.imageDestroy = async (arr) => {
    try {
        const params = {
            Bucket: bucketName,
            Delete: {
                Objects: arr
            }
        }
        await s3.deleteObjects(params, (err, data) => {
            if (err) throw new Error(err);
            else console.log('deleted');
        })
    } catch (err) {
        throw new Error(err)
    }
}