import { Select, Button, Avatar, Badge } from "antd";

const { Option } = Select;

const CourseCreateForm = ({
	handleChange,
	handleImage,
	handleSubmit,
	values,
	setValues,
	preview,
	uploadButtonText,
	handleImageRemove
}) => {
	const children = [];
	for (let i = 9.99; i <= 99.99; i++) {
		children.push(<Option key={i.toFixed(2)}>${i.toFixed(2)}</Option>);
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className='form-group'>
				<input
					type='text'
					name='name'
					className='form-control'
					placeholder='Name'
					value={values.name}
					onChange={handleChange}
				/>
			</div>

			<div className='form-group'>
				<textarea
					name='description'
					cols='7'
					rows='7'
					value={values.description}
					className='form-control'
					onChange={handleChange}
				></textarea>
			</div>

			<div className='form-row'>
				<div className='col'>
					<div className='form-group'>
						<Select
							style={{ width: "100%" }}
							size='large'
							value={values.paid}
							onChange={v => setValues({ ...values, paid: v, price: 0 })}
						>
							<Option value={true}>Paid</Option>
							<Option value={false}>free</Option>
						</Select>
					</div>
				</div>
				{values.paid && (
					<div className='form-group'>
						<Select
							defaultValue='$9.99'
							style={{ width: "100%" }}
							onChange={v => setValues({ ...values, price: v })}
							tokenSeparators={[,]}
							size='large'
						>
							{children}
						</Select>
					</div>
				)}
			</div>

			<div className='form-group'>
				<input
					type='text'
					name='category'
					className='form-control'
					placeholder='Category'
					value={values.category}
					onChange={handleChange}
				/>
			</div>

			<div className='form-row'>
				<div className='col'>
					<div className='form-group'>
						<label className='btn btn-outline-secondary btn-block text-left'>
							{uploadButtonText}
							<input
								value=''
								type='file'
								name='image'
								onChange={handleImage}
								accept='image/*'
								hidden
							/>
						</label>
					</div>
				</div>
				{preview && (
					<Badge count='X' onClick={handleImageRemove} className='pointer'>
						<Avatar width={200} src={preview} />
					</Badge>
				)}
			</div>

			<div className='row'>
				<div className='col'>
					<Button
						className
						onClick={handleSubmit}
						disabled={values.loading || values.uploading}
						className='brn btn-primary'
						loading={values.loading}
						type='primary'
						size='large'
						shape='round'
					>
						{values.loading ? "Saving Text..." : "Save and Continue"}
					</Button>
				</div>
			</div>
		</form>
	);
};

export default CourseCreateForm;
