import Navigation from "../components/Navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "../public/css/styles.css";
import { Provider } from "../context";

function MyApp({ Component, pageProps }) {
	return (
		<Provider>
			<Navigation />
			<Component {...pageProps} />;
		</Provider>
	);
}

export default MyApp;