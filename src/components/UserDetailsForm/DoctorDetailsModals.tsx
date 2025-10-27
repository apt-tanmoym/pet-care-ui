import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./styles.module.scss";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "lodash.debounce";
import {
	getCityList,
	getAreaListSearchText,
} from "@/services/faclilityService";
import { addUser, editUser, getSpecalityList } from "@/services/userService";
import { InputAdornment } from "@mui/material";

const specialties = [
	"Select",
	"General Medicine",
	"Pediatrics",
	"Surgery",
	"Clinical Pathology",
];

type Mode = "short" | "full";

const StyledTextField = ({ sx, ...props }: any) => (
	<TextField
		{...props}
		variant='outlined'
		fullWidth
		sx={{
			width: "254px",
			bgcolor: "white",
			borderRadius: 2,
			"& .MuiOutlinedInput-root": {
				"& fieldset": {
					borderColor: "#0288d1",
				},
				"&:hover fieldset": {
					borderColor: "#01579b",
				},
				"&.Mui-focused fieldset": {
					borderColor: "#01579b",
					boxShadow: "0 0 8px rgba(2, 136, 209, 0.3)",
				},
			},
			...sx,
		}}
	/>
);

interface Council {
	councilId: string;
	councilName: string;
}

interface Props {
	open: boolean;
	onClose: () => void;
	mode?: Mode;
	initialData?: any;
	type?: string;
	councilList: Council[];
	onProceed?: (data: {
		councilId: string;
		yearOfReg: string;
		regNo: string;
	}) => void;
	onSubmit: (data: (any & { image?: File | null }) | null | string) => void;
}

const DoctorDetailsModal: React.FC<Props> = ({
	open,
	onClose,
	mode = "short",
	initialData,
	councilList,
	onProceed,
	onSubmit,
	type = "add",
}) => {
	// Shared fields

	const [councilId, setCouncilId] = useState("");
	const [yearOfReg, setYearOfReg] = useState("");
	const [regNo, setRegNo] = useState("");
	const [error, setError] = useState(false);
	const [councilError, setCouncilError] = useState("");
	const [yearError, setYearError] = useState("");
	const [regNoError, setRegNoError] = useState("");

	// Full mode fields
	const [userTitle, setUserTitle] = useState("Dr.");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [specialty, setSpecialty] = useState<any>("");
	const [orgUserQlfn, setOrgUserQlfn] = useState("");
	const [addressLine1, setAddressLine1] = useState("");
	const [addressLine2, setAddressLine2] = useState("");
	const [city, setCity] = useState("");
	const [areaName, setAreaName] = useState("");
	const [country, setCountry] = useState("");
	const [state, setState] = useState("");
	const [pin, setPin] = useState("");
	const [cellNumber, setCellNumber] = useState("");
	const [userName, setUserName] = useState("");
	const [profileDetails, setProfileDetails] = useState("");
	const [areaMappingId, setAreaMappingId] = useState("");
	const [imageFilePath, setImageFilePath] = useState<any>(undefined);
	const [activeInd, setActiveInd] = useState("Active");

	// Autocomplete states
	const [specalityList, setSpecalityList] = useState<any[]>([]);
	const [cityOptions, setCityOptions] = useState<any[]>([]);
	const [areaOptions, setAreaOptions] = useState<any[]>([]);
	const [cityLoading, setCityLoading] = useState(false);
	const [areaLoading, setAreaLoading] = useState(false);
	const [selectedCity, setSelectedCity] = useState<any>(null);
	const [apiError, setApiError] = useState<string>("");

	// Debounced city search
	const fetchCities = debounce(async (searchText: string) => {
		setCityLoading(true);
		try {
			const data = await getCityList(searchText);
			setCityOptions(data || []);
			setApiError("");
		} catch (error) {
			setApiError("Failed to load city suggestions");
			setCityOptions([]);
		} finally {
			setCityLoading(false);
		}
	}, 400);

	// Debounced area search
	const fetchAreas = debounce(async (cityId: string, searchText: string) => {
		setAreaLoading(true);
		try {
			const data = await getAreaListSearchText(cityId, searchText);
			setAreaOptions(data || []);
			setApiError("");
		} catch (error) {
			setApiError("Failed to load area suggestions");
			setAreaOptions([]);
		} finally {
			setAreaLoading(false);
		}
	}, 400);

	const fetchSpecalityList = async () => {
		const specalityList: any = await getSpecalityList();
		setSpecalityList(specalityList);
	};
	useEffect(() => {
		fetchSpecalityList();
		if (initialData) {
			// Shared fields for both modes
			setCouncilId(initialData.councilId || "");
			setYearOfReg(initialData.yearOfReg?.toString() || ""); // Convert number to string
			setRegNo(initialData.regNo || "");

			// Full mode fields
			if (mode === "full") {
				setUserTitle(initialData.userTitle || "Dr.");
				setFirstName(initialData.firstName || "");
				setLastName(initialData.lastName || "");
				setEmail(initialData.email || "");
				setRegNo(initialData.registrationNumber || "");
				setSpecialty(initialData.glbSpltyId || ""); // Ensure specialty is set
				setOrgUserQlfn(initialData.orgUserQlfn || "");
				setAddressLine1(initialData.addressLine1 || "");
				setAddressLine2(initialData.addressLine2 || "");
				setCity(initialData.city || "");
				setAreaName(initialData.areaName || "");

				setCountry(initialData.country || "");
				setState(initialData.state || "");
				setPin(initialData.pin || "");
				setCellNumber(initialData.cellNumber || ""); // Ensure cellNumber is set
				setUserName(initialData.userName || ""); // Ensure userName is set
				setProfileDetails(initialData.profileDetails || "");
				setImageFilePath(initialData.imageFilePath || undefined);
				setActiveInd(initialData.activeInd === 1 ? "Active" : "Inactive");
				setAreaMappingId(initialData.cityMappingId || "");
				// Initialize selectedCity
				if (initialData.city) {
					setSelectedCity({
						cityName: initialData.city,
						stateName: initialData.state || "",
						country: initialData.country || "",
						cityId: initialData.cityId || 0,
					});
					fetchCities(initialData.city);
					const areas: any = fetchAreas(String(initialData.cityId), "");
					setAreaOptions(areas);
				}
			}
		}
	}, [initialData, mode]);

	// Update state and country when selectedCity changes
	useEffect(() => {
		if (selectedCity) {
			setCity(selectedCity.cityName);
			setState(selectedCity.stateName || "");
			setCountry(selectedCity.country || "");
			// setAreaName('');
			// setAreaOptions([]);
		}
	}, [selectedCity]);

	const handleProceed = async () => {
		let valid = true;
		if (!councilId) {
			setCouncilError("Medical Council is required");
			valid = false;
		} else setCouncilError("");

		if (!yearOfReg) {
			setYearError("Year of Registration is required");
			valid = false;
		} else setYearError("");

		if (!regNo) {
			setRegNoError("Reg. No. is required");
			valid = false;
		} else setRegNoError("");

		if (!valid) {
			setError(true);
			return;
		}
		setError(false);
		if (mode === "short" && onProceed) {
			onProceed({ councilId, yearOfReg, regNo });
		}
		if (mode === "full") {
			try {
				const formData = new FormData();

				// Common fields
				if (councilId) {
					formData.append("councilId", councilId);
				}
				if (yearOfReg) {
					formData.append("yearReg", yearOfReg);
				}
				if (regNo) {
					formData.append("registrationNumber", regNo);
				}
				formData.append("userName", localStorage.getItem("userName") || "");
				formData.append("userPwd", localStorage.getItem("userPwd") || ""); // 🔹 you can replace with actual login pwd
				formData.append("orgId", localStorage.getItem("orgId") || "");
				formData.append(
					"loggedinFacilityId",
					localStorage.getItem("loggedinFacilityId") || ""
				);
				if (type == "add") {
					formData.append("userLogin", userName || "");
				} else {
					formData.append("orgUserId", initialData?.orgUserId || "0");
				}
				formData.append("userTitle", userTitle);
				formData.append("firstName", firstName);
				formData.append("lastName", lastName);
				formData.append("addressFirst", addressLine1);
				formData.append("addressSecond", addressLine2 || "");
				formData.append("city", city);
				formData.append("areaName", areaName);
				formData.append("pin", pin);
				formData.append("state", state);
				formData.append("country", country);
				if (type != "add") {
					formData.append("activeInd", activeInd === "Active" ? "1" : "0");
				}
				formData.append("email", email);
				formData.append("cellNumber", cellNumber);

				// Doctor-specific
				formData.append("isdoctor", "1");
				if (type == "add") {
					formData.append("specialtyId", specialty || "");
				} else {
					formData.append("specialtyId", specialty || "");
				}
				formData.append("qualification", orgUserQlfn || "");

				// City mapping
				if (type == "add") {
					formData.append(
						"cityMasterId",
						selectedCity?.cityId?.toString() || ""
					);
				} else {
					formData.append("cityId", selectedCity?.cityId?.toString() || "");
				}
				formData.append(
					"cityPincodeMappingId",
					areaMappingId?.toString() || ""
				);

				// File upload
				if (imageFilePath && imageFilePath instanceof File) {
					formData.append("userImage", imageFilePath);
				}
				let action = "";
				if (type == "add") {
					action = "add";
					const result = await addUser(formData);
					console.log("✅ Doctor added:", result);
				} else {
					const result = await editUser(formData);
					console.log("✅ Doctor updated:", result);
				}
				//console.log("✅ Doctor updated:", result);
				if (onSubmit) {
					onSubmit(action + "success");
				}
				onClose();
			} catch (err: any) {
				console.error("❌ Error updating doctor:", err);
				setApiError("Failed to update doctor details");
				onSubmit(err.response.data.message);
			}
		}
	};

	const handleCancel = () => {
		setError(false);
		onClose();
	};

	return (
		<Dialog
			open={open}
			maxWidth='md'
			fullWidth
			classes={{ paper: styles.modalPaper }}>
			<DialogTitle className={styles.title}>DOCTOR DETAILS</DialogTitle>
			<DialogContent>
				{error && (
					<Typography color='error' sx={{ fontWeight: "bold", mb: 2 }}>
						Please provide the following details!
					</Typography>
				)}
				<Box sx={{ display: "flex", gap: 2, mb: 3, mt: 3 }}>
					<FormControl fullWidth required error={!!councilError}>
						<InputLabel>Medical Council</InputLabel>
						<Select
							value={councilId}
							label='Medical Council'
							onChange={(e) => setCouncilId(e.target.value)}>
							<MenuItem value=''>Select</MenuItem>
							{councilList.map((c) => (
								<MenuItem key={c.councilId} value={c.councilId}>
									{c.councilName}
								</MenuItem>
							))}
						</Select>
						{councilError && (
							<Typography color='error' variant='caption'>
								{councilError}
							</Typography>
						)}
					</FormControl>
					<TextField
						label='Year of Registration'
						value={yearOfReg}
						onChange={(e) => setYearOfReg(e.target.value)}
						fullWidth
						required
						type='number'
						error={!!yearError}
						helperText={yearError}
					/>
					<TextField
						label='Reg. No.'
						value={regNo}
						onChange={(e) => setRegNo(e.target.value)}
						fullWidth
						required
						error={!!regNoError}
						helperText={regNoError}
					/>
				</Box>
				{mode === "full" && (
					<Box
						sx={{
							display: { xs: "block", md: "flex" },
							gap: 4,
							alignItems: "flex-start",
							mb: 2,
						}}>
						{/* Left: Form fields */}
						<Box sx={{ flex: 2 }}>
							<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
								<TextField
									label='Title'
									value={userTitle}
									onChange={(e) => setUserTitle(e.target.value)}
									sx={{ width: 80 }}
									required
								/>
								<TextField
									label='First Name'
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									required
									sx={{ flex: 2 }}
								/>
								<TextField
									label='Last Name'
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									sx={{ flex: 2 }}
								/>
								<TextField
									label='Email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									sx={{ flex: 2 }}
								/>
							</Box>
							<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
								<FormControl fullWidth required>
									<InputLabel>Speciality</InputLabel>
									<Select
										value={specialty}
										label='Speciality'
										onChange={(e) => setSpecialty(e.target.value)}>
										{specalityList.map((s) => (
											<MenuItem key={s.specialtyId} value={s.specialtyId}>
												{s.specialtyName}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<TextField
									label='Qualification'
									value={orgUserQlfn}
									onChange={(e) => setOrgUserQlfn(e.target.value)}
									required
									fullWidth
								/>
							</Box>
							<TextField
								label='Address Line1'
								value={addressLine1}
								onChange={(e) => setAddressLine1(e.target.value)}
								fullWidth
								required
								sx={{ mb: 2 }}
							/>
							<TextField
								label='Address Line2'
								value={addressLine2}
								onChange={(e) => setAddressLine2(e.target.value)}
								fullWidth
								sx={{ mb: 2 }}
							/>
							<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
								<Autocomplete
									freeSolo
									loading={cityLoading}
									options={cityOptions}
									getOptionLabel={(option) =>
										typeof option === "string"
											? option
											: `${option.cityName}${
													option.stateName ? ", " + option.stateName : ""
											  }`
									}
									value={city || ""}
									onInputChange={(_, value) => {
										fetchCities(value);
									}}
									onChange={(_, value) => {
										if (value && typeof value !== "string") {
											setSelectedCity({ ...value, cityId: value.cityId });
											setCity(value.cityName);
											setState(value.stateName || "");
											setCountry(value.country || "");
											setAreaName("");
											setAreaOptions([]);
										} else {
											setSelectedCity(null);
											setCity(value || "");
											setState("");
											setCountry("");
											setAreaName("");
											setAreaOptions([]);
										}
										setApiError("");
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											label='City'
											required
											error={!!apiError}
											helperText={apiError}
											InputProps={{
												...params.InputProps,
												endAdornment: (
													<>
														{params.InputProps.endAdornment}
														<IconButton size='small'>
															<SearchIcon />
														</IconButton>
													</>
												),
											}}
										/>
									)}
									sx={{ flex: 1 }}
								/>
								<Autocomplete
									freeSolo
									loading={areaLoading}
									options={areaOptions || []}
									getOptionLabel={(option) =>
										typeof option === "string" ? option : `${option.areaName}`
									}
									value={areaName || ""}
									onInputChange={(_, value) => {
										if (selectedCity && selectedCity.cityId) {
											fetchAreas(String(selectedCity.cityId), value || "");
										}
									}}
									onFocus={() => {
										if (
											selectedCity &&
											selectedCity.cityId &&
											!areaOptions.length
										) {
											fetchAreas(String(selectedCity.cityId), "");
										}
									}}
									onChange={(_, value) => {
										if (typeof value === "string") {
											setAreaName(value);
										} else if (value && value.areaName) {
											setAreaName(value.areaName);
											setAreaMappingId(value.cityPincodeMappingId);
											setPin(value?.pincode || "");
										}
										setApiError("");
									}}
									renderInput={(params) => (
										<StyledTextField
											{...params}
											label='Area'
											required
											//helperText={!selectedCity ? 'Select a city first' : errors.areaName || apiError}
											//error={!!errors.areaName || !!apiError}
											InputProps={{
												...params.InputProps,
												endAdornment: (
													<>
														{params.InputProps.endAdornment}
														<InputAdornment position='end'>
															<SearchIcon sx={{ color: "#0288d1" }} />
														</InputAdornment>
													</>
												),
											}}
										/>
									)}
									disabled={!selectedCity}
								/>
							</Box>
							<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
								<TextField
									label='Country'
									value={country}
									onChange={(e) => setCountry(e.target.value)}
									required
									sx={{ flex: 1 }}
								/>
								<TextField
									label='State'
									value={state}
									onChange={(e) => setState(e.target.value)}
									required
									sx={{ flex: 1 }}
								/>
							</Box>
							<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
								<TextField
									label='PIN'
									value={pin}
									onChange={(e) => setPin(e.target.value)}
									required
									sx={{ flex: 1 }}
								/>
								<TextField
									label='Cell No.'
									value={cellNumber}
									onChange={(e) => setCellNumber(e.target.value)}
									required
									sx={{ flex: 1 }}
								/>
							</Box>
							<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
								<TextField
									label='User Name'
									value={userName}
									disabled={type === "edit" ? true : false}
									onChange={(e) => setUserName(e.target.value)}
									required
									sx={{ flex: 1 }}
								/>
							</Box>
						</Box>
						{/* Right: Image upload, Status, Profile Details */}
						<Box
							sx={{
								flex: 1,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "flex-start",
								mt: { xs: 2, md: 0 },
							}}>
							<Box
								sx={{
									width: 150,
									height: 150,
									border: "2px dashed #bfc5cc",
									borderRadius: 2,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									position: "relative",
									bgcolor: "#f5f5f5",
									transition: "border-color 0.2s",
									"&:hover": { borderColor: "#0288d1" },
									mb: 2,
								}}>
								<Avatar
									src={
										imageFilePath instanceof File
											? URL.createObjectURL(imageFilePath)
											: imageFilePath
									}
									alt='Doctor'
									sx={{
										width: 134,
										height: 134,
										bgcolor: "#e0e0e0",
										fontSize: 40,
										borderRadius: 2,
									}}>
									{!imageFilePath && userTitle?.[0]}
								</Avatar>
								{imageFilePath && (
									<IconButton
										size='small'
										sx={{
											position: "absolute",
											top: 4,
											right: 4,
											bgcolor: "white",
											p: 0.5,
										}}
										onClick={() => setImageFilePath(undefined)}>
										<CloseIcon fontSize='small' />
									</IconButton>
								)}
								<Tooltip title='Attach Image'>
									<IconButton
										component='label'
										sx={{
											position: "absolute",
											bottom: 4,
											right: 4,
											bgcolor: "#174a7c",
											color: "white",
											"&:hover": { bgcolor: "#0288d1" },
											boxShadow: 2,
										}}>
										<CameraAltIcon />
										<input
											type='file'
											accept='image/*'
											hidden
											onChange={(e) => {
												if (e.target.files && e.target.files[0]) {
													setImageFilePath(e.target.files[0]); // store File
												}
											}}
										/>
									</IconButton>
								</Tooltip>
							</Box>
							<FormControl fullWidth required sx={{ mb: 2 }}>
								<InputLabel>Status</InputLabel>
								<Select
									value={activeInd}
									label='Status'
									disabled={type === "edit" ? false : true}
									onChange={(e) => setActiveInd(e.target.value)}>
									<MenuItem value='Active'>Active</MenuItem>
									<MenuItem value='Inactive'>Inactive</MenuItem>
								</Select>
							</FormControl>
							<TextField
								label='Profile Details'
								value={profileDetails}
								onChange={(e) => setProfileDetails(e.target.value)}
								fullWidth
								sx={{ mb: 2 }}
							/>
						</Box>
					</Box>
				)}
			</DialogContent>
			<DialogActions sx={{ justifyContent: "center", mb: 2 }}>
				<Button
					onClick={handleProceed}
					variant='contained'
					className={styles.proceedButton}
					sx={{ mr: 2 }}>
					{mode === "short" ? "Proceed" : "Submit"}
				</Button>
				<Button
					onClick={handleCancel}
					variant='contained'
					className={styles.cancelButton}>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DoctorDetailsModal;
