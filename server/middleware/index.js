import jwt from "express-jwt";
import User from "../model/userModel.js";

export const requireSign = jwt({
	secret: "adahs98d6a9s8das8duasda09da90sn7da0sdas0d7ab0ds7a0d7a09dab0d7a0s9d",
	getToken: (req, res) => req.cookies.token,
	algorithms: ["HS256"]
});

export const isInstructor = async (req, res, next) => {
	try {
		const user = await User.findById(req.user._id).exec();

		if (!user.role.includes("Instructor")) {
			return res.sendStatus(403);
		} else {
			next();
		}
	} catch (error) {
		console.log(error);
	}
};
