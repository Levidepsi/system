import User from "../model/userModel.js";
import { hashPassword, comparePassword } from "../utils/auth.js";
import jwt from "jsonwebtoken";
import AWS from "aws-sdk";
import { nanoid } from "nanoid";

const awsConfig = {
	accessKeyId: "AKIAQ4PUZ5AQ6Z6YAMD4",
	secretAccessKey: "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",
	region: "us-east-2",
	apiVersion: "2010-12-01"
};

const SES = new AWS.SES(awsConfig);

export const register = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!name) {
			return res.status(400).send("Name Required");
		}

		if (!password || password.length < 6) {
			return res.status(400).send("Must be 6 characters");
		}
		let userExist = await User.findOne({ email }).exec();
		if (userExist) {
			return res.status(400).send("Email Already Taken");
		}

		// hash password
		const hashedPassword = await hashPassword(password);

		// register
		const user = new User({
			name,
			email,
			password: hashedPassword
		});

		await user.save();
		console.log(user);

		return res.json({ ok: true });
	} catch (error) {
		console.log(error);
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		// console.log(req.body);
		const user = await User.findOne({ email }).exec();
		if (!user) {
			return res.status(400).send("No User Found");
		}

		// check Password
		const match = await comparePassword(password, user.password);
		if (!match) return res.status(400).send("Wrong password");

		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d"
		});

		// return user and token to client exclude hashed password
		user.password = undefined;

		res.cookie("token", token, {
			httpOnly: true
		});

		// send user as json
		res.json(user);
	} catch (error) {
		console.log(error);
		return res.status(400).send("Error Try Again");
	}
};

export const logout = async (req, res) => {
	try {
		res.clearCookie("token");
		return res.json({ msg: "Signout Success" });
	} catch (error) {
		console.log(error);
	}
};

export const currentUser = async (req, res) => {
	try {
		const user = await User.findById(req.user._id)
			.select("-password")
			.exec();
		res.json({ ok: true });
		console.log(user);
	} catch (error) {
		console.log(error);
	}
};

export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;
		// console.log(email);
		const shortCode = nanoid(6).toUpperCase();

		const user = await User.findOneAndUpdate(
			{ email },
			{ passwordResetCode: shortCode }
		);
		if (!user) {
			return res.status(400).send("User Not Found");
		}

		// prepare for email
		const params = {
			Source: process.env.EMAIL_FROM,
			Destination: {
				ToAddresses: [email]
			},
			Message: {
				Body: {
					Html: {
						Charset: "UTF-8",
						Data: `
						<html>
									<h1>Reset Password</h1>
									<p> Use This Code To Reset Password</p>
									<h2 style="color:red;">${shortCode}</h2>
									<i>edemy.com</i>
									</html>
							`
					}
				},
				Subject: {
					Charset: "UTF-8",
					Data: "Reset Password"
				}
			}
		};

		const emailSent = SES.sendEmail(params).promise();
		emailSent.then(data => {
			console.log(data);
			res.json({ ok: true });
		});
	} catch (error) {
		console.log(error);
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { email, code, newPassword } = req.body;
		// console.table(email, code, newPassword);
		const hashedPassword = await hashPassword(newPassword);

		const user = await User.findOneAndUpdate(
			{
				email,
				passwordResetCode: code
			},
			{
				password: hashedPassword,
				passwordResetCode: ""
			}
		).exec();

		res.json({ ok: true });
	} catch (error) {
		console.log(error);
	}
};

// export const sentEmail = async (req, res) => {
// 	const params = {
// 		Source: process.env.EMAIL_FROM,
// 		Destination: {
// 			ToAddresses: ["levidepsi7@gmail.com"]
// 		},
// 		ReplyToAddresses: [process.env.EMAIL_FROM],
// 		Message: {
// 			Body: {
// 				Html: {
// 					Charset: "UTF-8",
// 					Data: `
// 							<html>
// 								<h1>Reset Password Link</h1>
// 								<p>Please Use the Link to reset your password</p>
// 							</html>
// 						`
// 				}
// 			},
// 			Subject: {
// 				Charset: "UTF-8",
// 				Data: "Password Reset Link"
// 			}
// 		}
// 	};

// 	const emailSent = SES.sendEmail(params).promise();

// 	emailSent
// 		.then(data => {
// 			console.log(data);
// 			res.json({ ok: true });
// 		})
// 		.catch(err => {
// 			console.log(err);
// 		});
// };
