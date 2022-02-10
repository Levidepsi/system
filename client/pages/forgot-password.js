import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [success, setSuccess] = useState(false);
	const [code, setCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const {
		state: { user }
	} = useContext(Context);

	const router = useRouter();

	// redirect if user is logged in
	useEffect(() => {
		if (user !== null) router.push("/");
	}, [user]);

	const handleSubmit = async e => {
		e.preventDefault();
		setLoading(true);
		try {
			const { data } = await axios.post("/api/forgot-password", { email });
			setSuccess(true);
			toast("Check your email for code");
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
			toast.error(error.response.data);
		}
	};

	const handleResetPassword = async e => {
		e.preventDefault();
		// console.log(email, code, newPassword);
		// return;

		try {
			setLoading(true);
			const { data } = await axios.post("/api/reset-password", {
				email,
				code,
				newPassword
			});
			setEmail("");
			setCode("");
			setNewPassword("");
			setLoading(false);
			toast.success("Reset Successful, Login Again");
		} catch (error) {
			console.log(error);
			setLoading(false);
			toast.error(error.response.data);
		}
	};

	return (
		<>
			<h1
				className='jumbotron text-center bg-primary square'
				style={{ display: "grid" }}
			>
				ForgotPassword
			</h1>
			<div className='container col-md-4 offset-md-4 pb-5'>
				<form onSubmit={success ? handleResetPassword : handleSubmit}>
					<input
						type='email'
						className='form-control mb-4 p-3'
						value={email}
						onChange={e => setEmail(e.target.value)}
						placeholder='Enter Email'
						required
					/>
					{success && (
						<>
							<input
								type='text'
								className='form-control mb-4 p-3'
								value={code}
								onChange={e => setCode(e.target.value)}
								placeholder='Enter Code'
								required
							/>

							<input
								type='password'
								className='form-control mb-4 p-3'
								value={newPassword}
								onChange={e => setNewPassword(e.target.value)}
								placeholder='Enter New Password'
								required
							/>
						</>
					)}
					<div className='d-grid gap-2'>
						{" "}
						<button
							type='submit'
							className='btn btn-primary btn-block p-2 '
							disabled={loading || !email}
						>
							{loading ? <SyncOutlined spin /> : "Submit"}
						</button>
					</div>
				</form>
			</div>
		</>
	);
};

export default ForgotPassword;
