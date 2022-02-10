import User from "../models/userModel.js";
import { hashPassword, comparePassword } from "../auth.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
	// res.json({ ok: true });
	// return;
	try {
		const { name, email, password, phoneNumber } = req.body;

		// console.log(name, email, password, phoneNumber);

		if (!name && name < 3) {
			return res.status(400).send("Name is Required and must be 3 characters");
		}
		// Email Validation
		function isEmailValid() {
			let regexEmail = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
			if (!email) return false;

			if (email.length > 50) return false;

			let valid = regexEmail.test(email);
			if (!valid) return false;

			let parts = email.split("@");
			if (parts[0].length > 20) return false;

			let domainParts = parts[1].split(".");
			if (
				domainParts.some(function(part) {
					return part.length > 63;
				})
			)
				return false;

			return true;
		}

		if (!email === isEmailValid()) {
			return res.status(400).send("Invalid Email");
		}

		// End of Email Validation

		// Phone Number Validation

		function isPhoneNumber() {
			let regexNumber = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
			if (!phoneNumber) return false;
			let valid = regexNumber.test(phoneNumber);
			if (!valid) return false;
		}
		if (!phoneNumber === isPhoneNumber()) {
			return res.status(400).send("Incorrect Phone Number");
		}

		// End of Phone Number Validation

		// Password Validation

		function isPassword() {
			let regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
			if (!password) return false;
			let valid = regexPassword.test(password);
			if (!valid) return false;
		}

		// console.log(isPassword());

		if (!password === isPassword()) {
			return res
				.status(400)
				.send(
					"Password must be at least 8 characters, 1 uppercase,1 lowercase, 1 number, 1 special character"
				);
		}

		// End of Password Validation

		const userExist = await User.findOne({ $or: [{ email }, { phoneNumber }] });
		if (userExist) {
			return res.status(400).send("Email already in use");
		}

		// hashPassword
		const hashedPassword = await hashPassword(password);

		// register
		const user = new User({
			name,
			email,
			phoneNumber,
			password: hashedPassword
		});

		await user.save();
		console.log(user);

		res.json(user);
	} catch (error) {
		console.log(error);
	}
};

export const login = async (req, res) => {
	try {
		const { email, phoneNumber, password } = req.body;

		const user = await User.findOne({
			$or: [{ email }, { phoneNumber }]
		}).exec();

		if (!user) {
			return res.status(400).send("Incorrect email or password");
		}

		if (!email || !phoneNumber) {
			return res.status(400).send("Wrong Email Or Password");
		}

		const match = await comparePassword(password, user.password);
		if (!match) return res.status(400).send("Incorrect email or password");

		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1d"
		});

		res.cookie("token", token, {
			httpOnly: true
		});

		user.password = undefined;

		res.json(user);
	} catch (error) {
		console.log(error);
	}
};

export const logout = async (req, res) => {
	try {
		res.clearCookie("token");
		res.send("Logout Success");
	} catch (error) {
		console.log(error);
	}
};
