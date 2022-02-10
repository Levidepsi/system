import bcrypt from "bcrypt";

export const hashPassword = password => {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(12, (err, salt) => {
			if (err) {
				reject(err);
			}
			bcrypt.hash(password, salt, (err, hash) => {
				if (err) {
					reject(err);
				}
				resolve(hash);
			});
		});
	});
};

export const comparePassword = (password, hashed) => {
	return bcrypt.compare(password, hashed);
};

// export const emailValidation = (req, res) => {
// 	const { email } = req.body;

// 	let regex = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;

// 	if (!email) return false;

// 	if (email.length > 254) return false;

// 	let valid = regex.test(email);
// 	if (!valid) return false;

// 	let parts = email.split("@");
// 	if (parts[0].length > 64) return false;

// 	let domainParts = parts[1].split(".");
// 	if (
// 		domainParts.some(function(part) {
// 			return part.length > 63;
// 		})
// 	)
// 		return false;

// 	return true;
// };
