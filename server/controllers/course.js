import AWS from "aws-sdk";
import { nanoid } from "nanoid";
import Course from "../model/courseModel.js";
import slugify from "slugify";

const awsConfig = {
	accessKeyId: "AKIAQ4PUZ5AQ6Z6YAMD4",
	secretAccessKey: "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",
	region: "us-east-2",
	apiVersion: "2010-12-01"
};

const S3 = new AWS.S3(awsConfig);

export const uploadImage = async (req, res) => {
	// console.log(req.body);

	try {
		const { image } = req.body;
		if (!image) return res.status(400).send("No Image");

		// prepare the image
		const base64Data = new Buffer.from(
			image.replace(/^data:image\/\w+;base64,/, ""),
			"base64"
		);

		const type = image.split(";")[0].split("/")[1];

		// image params
		const params = {
			Bucket: "edemy-buckets",
			Key: `${nanoid()}.${type}`,
			Body: base64Data,
			ACL: "public-read",
			ContentEncoding: "base64",
			ContentType: `image/${type}`
		};

		// upload to s3
		S3.upload(params, (err, data) => {
			if (err) {
				console.log(err);
				return res.sendStatus(400);
			}
			console.log(data);
			res.send(data);
		});
	} catch (error) {
		console.log(error);
	}
};

export const removeImage = async (req, res) => {
	try {
		const { image } = req.body;
		// image parms
		const params = {
			Bucket: image.Bucket,
			Key: image.Key
		};
		// send removerequest to s3
		S3.deleteObject(params, (err, data) => {
			if (err) {
				console.log(err);
				res.sendStatus(400);
			}
			res.send({ ok: true });
		});
	} catch (error) {
		console.log(error);
	}
};

export const create = async (req, res) => {
	// console.log("Create Course", req.body);
	// create Course
	// return;
	try {
		const alreadyExist = await Course.findOne({
			// slug is based on the title
			slug: slugify(req.body.name.toLowerCase())
		});

		if (alreadyExist) {
			return res.status(400).sen("Title Already Exist");
		}
		// create new Course
		const course = await new Course({
			slug: slugify(req.body.name),
			instructor: req.user._id,
			...req.body
		}).save();

		res.json(course);
	} catch (error) {
		console.log(error);
		return res.status(400).send("Course Create Failed. Try again");
	}
};

export const read = async (req, res) => {
	try {
		const course = await Course.findOne({ slug: req.params.slug })
			.populate("instructor", "_id name")
			.exec();
		res.json(course);
	} catch (error) {
		console.log(error);
	}
};
