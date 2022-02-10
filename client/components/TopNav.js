import React, { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import Link from "next/link";
import {
	AppstoreOutlined,
	LoginOutlined,
	UserAddOutlined,
	LogoutOutlined,
	CoffeeOutlined,
	CarryOutOutlined,
	TeamOutlined
} from "@ant-design/icons";
import { Context } from "../context";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const { Item, SubMenu, ItemGroup } = Menu;

if (typeof document === "undefined") {
	React.useLayoutEffect = React.useEffect;
}
const TopNav = () => {
	const [current, setCurrent] = useState("");

	const {
		state: { user },
		dispatch
	} = useContext(Context);

	const router = useRouter();

	useEffect(() => {
		process.browser && setCurrent(window.location.pathname);
	}, [process.browser && window.location.pathname]);

	const logout = async () => {
		dispatch({
			type: "LOGOUT"
		});
		window.localStorage.removeItem("user");
		const { data } = await axios.get("/api/logout");
		toast(data.message);
		router.push("/login");
	};

	return (
		<Menu mode='horizontal' selectedKeys={[current]}>
			<Item
				key='/'
				onClick={e => setCurrent(e.key)}
				icon={<AppstoreOutlined />}
			>
				<Link href='/'>
					<a>App</a>
				</Link>
			</Item>

			{user && user.role && user.role.includes("Instructor") ? (
				<Item
					key='/instructor/course/create'
					onClick={e => setCurrent(e.key)}
					icon={<CarryOutOutlined />}
				>
					<Link href='/instructor/course/create'>
						<a>Create Course</a>
					</Link>
				</Item>
			) : (
				<Item
					key='/user/become-instructor'
					onClick={e => setCurrent(e.key)}
					icon={<TeamOutlined />}
				>
					<Link href='/user/become-instructor'>
						<a>Become Instructor</a>
					</Link>
				</Item>
			)}

			{user === null && (
				<>
					<Item
						key='/login '
						onClick={e => setCurrent(e.key)}
						icon={<LoginOutlined />}
					>
						<Link href='/login'>
							<a>Login</a>
						</Link>
					</Item>

					<Item
						key='/register'
						onClick={e => setCurrent(e.key)}
						icon={<UserAddOutlined />}
					>
						<Link href='/register'>
							<a>Register</a>
						</Link>
					</Item>
				</>
			)}

			{user !== null && (
				<SubMenu
					key={user}
					icon={<CoffeeOutlined />}
					title={user && user.name}
					className='float-right'
				>
					<ItemGroup>
						<Item key='/user'>
							<Link href='/user'>
								<a>Dashboard</a>
							</Link>
						</Item>
						<Item onClick={logout} icon={<LogoutOutlined />}>
							Logout
						</Item>
					</ItemGroup>
				</SubMenu>
			)}

			{user && user.role && user.role.includes("Instructor") && (
				<Item
					key='/instructor'
					onClick={e => setCurrent(e.key)}
					icon={<TeamOutlined />}
					className='float-right'
				>
					<Link href='/instructor'>
						<a>Instructor</a>
					</Link>
				</Item>
			)}
		</Menu>
	);
};

export default TopNav;