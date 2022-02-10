import { useState, useEffect, useContext } from "react";
import { Context } from "../context";
import { Menu } from "antd";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";

const { Item } = Menu;
const Navigation = () => {
	const [current, setCurrent] = useState("");
	const {
		state: { user },
		dispatch
	} = useContext(Context);

	useEffect(() => {
		process.browser && setCurrent(window.location.pathname);
	}, [process.browser && window.location.pathname]);

	const router = useRouter();

	const logout = async () => {
		dispatch({
			type: "LOGOUT"
		});
		window.localStorage.removeItem("user");
		const { data } = await axios.get("http://localhost:5000/api/logout");
		console.log(data);
		router.push("/login");
	};
	return (
		<Menu mode='horizontal' selectedKeys={[current]}>
			{user === null && (
				<>
					<Item key='/login'>
						<Link href='/login'>
							<a>Login</a>
						</Link>
					</Item>

					<Item key='/register'>
						<Link href='/register'>
							<a>Register</a>
						</Link>
					</Item>
				</>
			)}

			{user !== null && (
				<>
					<Item key='/'>
						<Link href='/'>
							<a>Home</a>
						</Link>
					</Item>
					<Item onClick={logout}>Logout</Item>
				</>
			)}
		</Menu>
	);
};

export default Navigation;
