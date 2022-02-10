import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";
import { Context } from "../context";
import Error from "../components/Error";

const Login = () => {
	const [email, setEmail] = useState("lev@gmail.com");
	const [phoneNumber, setPhoneNumber] = useState("09284141394");
	const [password, setPassword] = useState("Levis_07");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const router = useRouter();

	const {
		state: { user },
		dispatch
	} = useContext(Context);

	useEffect(() => {
		if (user !== null) router.push("/");
	}, [user]);

	const handleSubmit = async e => {
		try {
			e.preventDefault();
			setLoading(true);

			const { data } = await axios.post("/api/login", {
				email,
				phoneNumber,
				password
			});
			// console.log(data);
			dispatch({
				type: "LOGIN",
				payload: data
			});
			window.localStorage.setItem("user", JSON.stringify(data));
			router.push("/");
			setLoading(false);
		} catch (error) {
			console.log(error);
			setError(error.response.data);
			setLoading(false);
		}
	};

	return (
		<div className=''>
			<h1 className='text-center'>Login</h1>
			<div className=' border container col-md-4 offset-md-4 pb-5 '>
				<form className='mt-4' onSubmit={handleSubmit}>
					{error && <Error>{error}</Error>}
					<input
						type='text'
						className='form-control mb-4 p-4'
						value={email || phoneNumber}
						onChange={e => {
							setEmail(e.target.value);
							setPhoneNumber(e.target.value);
						}}
						placeholder='Email or Phone Number'
					/>
					<input
						type='password'
						className='form-control mb-4 p-4'
						value={password}
						onChange={e => setPassword(e.target.value)}
						placeholder='Password'
					/>
					<div className='d-grid gap-2'>
						<button
							className='btn btn-block btn-primary'
							disabled={loading || (!email && !phoneNumber) || !password}
						>
							{loading ? <SyncOutlined /> : "Submit"}
						</button>
					</div>
					<div className=' d-flex create'>
						<p>Have No Account?</p>
						<a href='/register'> Create Account</a>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
