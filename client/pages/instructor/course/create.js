import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const CourseCreate = () => {
	// state
	const [values, setValues] = useState({
		name: "",
		description: "",
		price: "9.99",
		uploading: false,
		paid: true,
		category: "",
		loading: false
	});
	const [image, setImage] = useState({});
	const [preview, setPreview] = useState("");
	const [uploadButtonText, setUploadButtonText] = useState("Upload Image");

	const router = useRouter();

	const handleChange = e => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	const handleImage = e => {
		let file = e.target.files[0];
		setPreview(window.URL.createObjectURL(file));
		setUploadButtonText(file.name);
		setValues({ ...values, loading: true });

		// resize
		Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async uri => {
			try {
				let { data } = await axios.post("/api/course/upload-image", {
					image: uri
				});
				console.log(data);
				// set image in the state
				setImage(data);
				setValues({ ...values, loading: false });
			} catch (error) {
				console.log(error);
				setValues({ ...values, loading: false });
				toast("Failed To Upload Image");
			}
		});
	};

	const handleImageRemove = async () => {
		// console.log("Removed");
		try {
			setValues({ ...values, loading: true });
			const res = await axios.post("/api/course/remove-image", { image });
			setImage({});
			setPreview("");
			setUploadButtonText("Upload Image");
			setValues({ ...values, loading: false });
		} catch (error) {
			console.log(error);
			setValues({ ...values, loading: false });
			toast("Image Upload Failed");
		}
	};

	const handleSubmit = async e => {
		e.preventDefault();
		// console.log(values);
		try {
			const { data } = await axios.post("/api/course", {
				...values,
				image
			});
			toast("Great! Now You Can Start Adding Lessons");
			router.push("/instructor");
		} catch (error) {
			console.log(error);
			toast(error.response.data);
		}
	};

	return (
		<InstructorRoute>
			<h1
				className='jumbotron text-center bg-primary square '
				style={{ display: "grid", height: "10vh" }}
			>
				Create Course
			</h1>
			<div className='pt-3 pb-3'>
				<CourseCreateForm
					handleSubmit={handleSubmit}
					handleImage={handleImage}
					handleChange={handleChange}
					values={values}
					setValues={setValues}
					preview={preview}
					uploadButtonText={uploadButtonText}
					handleImageRemove={handleImageRemove}
				/>
			</div>
			<pre>{JSON.stringify(values, null, 4)}</pre>
			<pre>{JSON.stringify(image, null, 4)}</pre>
		</InstructorRoute>
	);
};

export default CourseCreate;
