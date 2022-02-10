import { useContext } from "react";
import { Context } from "../../context";
import UserRoute from "../../components/routes/UserRoute";

const UserIndex = () => {
	const {
		state: { user }
	} = useContext(Context);

	return (
		<UserRoute>
			<h1
				className='jumbotron text-center bg-primary square '
				style={{ display: "grid", height: "10vh" }}
			>
				Dashboard
			</h1>
		</UserRoute>
	);
};
export default UserIndex;
