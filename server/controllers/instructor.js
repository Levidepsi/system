import User from "../model/userModel.js";
import queryString from "query-string";
import Course from "../model/courseModel.js";
const stripe = require("stripe")(
	"sk_test_51JzcVNEFtnu5nZOoENEOGMa4Uj9cfDCSYLQttpy02MQxC9SRoAqqnZnAjNznKsxBJXabum9tfuYRj0re7bp0seQE00hAYLiYi5"
);

export const makeInstructor = async (req, res) => {
	try {
		// 1. find user from database
		const user = await User.findById(req.user._id).exec();
		// 2. if user dont have stripe_account_id yet, then create new
		if (!user.stripe_account_id) {
			const account = await stripe.accounts.create({ type: "express" });
			user.stripe_account_id = account.id;
			user.save();
			// console.log(account_id);
		}
		// 3. create account link based on account id(for frontend to complete boarding)
		let accountLink = await stripe.accountLinks.create({
			account: user.stripe_account_id,
			refresh_url: process.env.STRIPE_REDIRECT_URL,
			// refresh_url: 'http://localhost:3000/stripe/callback',
			return_url: process.env.STRIPE_REDIRECT_URL,
			type: "account_onboarding"
		});
		// 4. pre-fill any info such as email (optional), then send url response to frontend
		accountLink = Object.assign(accountLink, {
			"stripe_user[email]": user.email
		});
		// 5. then send the account link as response to frontend
		res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
	} catch (error) {
		console.log(error);
	}
};

export const getAccountStatus = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).exec();

		const account = await stripe.accounts.retrieve(user.stripe_account_id);
		// console.log(account);

		if (!account.charges_enabled) {
			return res.status(401).send("Unauthorized");
		} else {
			const statusUpdated = await User.findByIdAndUpdate(
				user._id,
				{
					stripe_seller: account,
					$addToSet: { role: "Instructor" }
				},
				{ new: true }
			).exec();
			res.json(statusUpdated);
		}
	} catch (error) {
		console.log(error);
	}
};

export const currentInstructor = async (req, res) => {
	try {
		let user = await User.findById(req.user._id)
			.select("-password")
			.exec();
		if (!user.role.includes("Instructor")) {
			return res.sendStatus(403);
		} else {
			res.json({ ok: true });
		}
	} catch (error) {
		console.log(error);
	}
};

export const instructorCourses = async (req, res) => {
	try {
		// find based on the instructor
		const courses = await Course.find({ instructor: req.user._id })
			.sort({ createdAt: -1 })
			.exec();
		res.json(courses);
	} catch (error) {
		console(error);
	}
};
