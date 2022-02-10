import { useState, useEffect } from "react";
import axios from "axios";
import { SyncOutlined } from "@ant-design/icons";
import Error from "../components/Error";

const Register = () => {
	const [name, setName] = useState("Levi");
	const [email, setEmail] = useState("lev@gmail.com");
	const [phoneNumber, setPhoneNumber] = useState("09284141394");
	const [password, setPassword] = useState("Levis_07");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {}, [name, email, phoneNumber, password]);

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			setLoading(true);
			const { data } = await axios.post(`/api/register`, {
				name,
				email,
				phoneNumber,
				password
			});
			if (error.data) return [];
			console.log(data);
			setName("");
			setEmail("");
			setPhoneNumber("");
			setPassword("");
			setLoading(false);
			alert("Register Success");
		} catch (error) {
			console.log(error);
			setLoading(false);
			setError(error.response.data);
		}
	};
	return (
		<>
			<h1 className='text-center'>Register</h1>
			<div className='border container col-md-4 offset-md-4 pb-5 '>
				<form className='mt-4' onSubmit={handleSubmit}>
					{error && <Error>{error}</Error>}
					<input
						type='text'
						className='form-control mb-4 p-4'
						value={name}
						onChange={e => setName(e.target.value)}
						placeholder='Name'
						required
					/>
					<input
						type='email'
						className='form-control mb-4 p-4'
						value={email}
						onChange={e => {
							setEmail(e.target.value);
						}}
						placeholder='Email'
						required
					/>
					<input
						type='+'
						className='form-control mb-4 p-4'
						value={phoneNumber}
						onChange={e => setPhoneNumber(e.target.value)}
						placeholder='Phone Number'
						required
					/>
					<input
						type='password'
						className='form-control mb-4 p-4'
						value={password}
						onChange={e => setPassword(e.target.value)}
						placeholder='Password'
						required
					/>

					<div className='d-grid gap-2'>
						<button className='btn btn-block btn-primary'>
							{loading ? <SyncOutlined /> : "Submit"}
						</button>
					</div>

					<div className=' d-flex create '>
						<p className='text-center'>Already Registerd?</p>
						<a href='/login'> Login Here</a>
					</div>
				</form>
			</div>
		</>
	);
};

export default Register;
