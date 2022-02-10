import mongoose from "mongoose";

const userModel = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true
		},
		password: {
			type: String,
			required: true,
			min: 6,
			max: 64
		},
		phoneNumber: {
			type: String,
			required: true,
			trim: true,
			unique: true
		}
	},
	{ timestamps: true }
);

// userModel.path("email").validate(async email => {
// 	const countEmail = await mongoose.models.User.countDocuments({ email });
// 	return !countEmail;
// });

const User = mongoose.model("User", userModel);

export default User;
