import { useContext, useEffect } from "react";
import { Context } from "../context";
import { useRouter } from "next/router";

const Index = () => {
	const {
		state: { user },
		dispatch
	} = useContext(Context);

	useEffect(() => {
		if (user === null) router.push("/login");
	});

	const router = useRouter();
	return (
		<>{user && <h1 className='text-center'>Hi I am {user && user.name}</h1>}</>
	);
};

export default Index;
