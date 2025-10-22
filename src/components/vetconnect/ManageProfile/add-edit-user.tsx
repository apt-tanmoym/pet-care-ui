import React, { forwardRef, useImperativeHandle } from "react";
import { Grid, TextField, Box, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

interface AddEditModelProps {
	initialData: {
		docEducationInstitute?: string;
		docDegree?: string;
		docFieldOfStudy?: string;
		docGrade?: string;
		educationFromDt?: string;
		educationToDt?: string;
		docExperience?: string;
		employmentType?: string;
		docExperienceInstitute?: string;
		instituteAddress?: string;
		experienceFromDt?: string;
		experienceToDt?: string;
	};
	formType: "education" | "experience" | null;
}

export interface AddDocumentRef {
	submit: () => void;
}

const AddEditModel = forwardRef<AddDocumentRef, AddEditModelProps>(
	({ initialData, formType }, ref) => {
		console.log(initialData);
		console.log(formType);
		let startDate;
		let endDate;
		if (formType === "education") {
			startDate = initialData?.educationFromDt;
			endDate = initialData?.educationToDt;
		} else {
			startDate = initialData?.experienceFromDt;
			endDate = initialData?.experienceToDt;
		}
		console.log(startDate);
		console.log(endDate);

		const { control, handleSubmit, reset } = useForm({
			defaultValues: {
				institution: initialData?.docEducationInstitute || "",
				degree: initialData?.docDegree || "",
				fieldOfStudy: initialData?.docFieldOfStudy || "",
				grade: initialData?.docGrade || "",
				startDate: startDate ? dayjs(startDate) : null,
				endDate: endDate ? dayjs(endDate) : null,
				jobTitle: initialData?.docExperience || "",
				employmentType: initialData?.employmentType || "",
				companyName: initialData?.docExperienceInstitute || "",
				location: initialData?.instituteAddress || "",
			},
		});

		useImperativeHandle(ref, () => ({
			submit: () => {
				return new Promise<any>((resolve, reject) => {
					handleSubmit((data) => {
						const formattedData = {
							...data,
							startDate: data.startDate
								? dayjs(data.startDate).format("DD-MM-YYYY")
								: "",
							endDate: data.endDate
								? dayjs(data.endDate).format("DD-MM-YYYY")
								: "",
						};
						resolve(formattedData);
					}, reject)(); // ← execute the function immediately
				});
			},
		}));

		return (
			<Box sx={{ p: 3 }}>
				<form>
					<Grid container spacing={2}>
						{formType === "education" && (
							<>
								<Grid item xs={12} sm={6}>
									<Controller
										name='institution'
										control={control}
										render={({ field }) => (
											<TextField {...field} label='Institution' fullWidth />
										)}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Controller
										name='degree'
										control={control}
										render={({ field }) => (
											<TextField {...field} label='Degree' fullWidth />
										)}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Controller
										name='fieldOfStudy'
										control={control}
										render={({ field }) => (
											<TextField {...field} label='Field of Study' fullWidth />
										)}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Controller
										name='grade'
										control={control}
										render={({ field }) => (
											<TextField {...field} label='Grade' fullWidth />
										)}
									/>
								</Grid>
							</>
						)}

						{formType === "experience" && (
							<>
								<Grid item xs={12} sm={6}>
									<Controller
										name='jobTitle'
										control={control}
										render={({ field }) => (
											<TextField {...field} label='Job Title' fullWidth />
										)}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Controller
										name='employmentType'
										control={control}
										render={({ field }) => (
											<TextField {...field} label='Employment Type' fullWidth />
										)}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Controller
										name='companyName'
										control={control}
										render={({ field }) => (
											<TextField {...field} label='Company Name' fullWidth />
										)}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Controller
										name='location'
										control={control}
										render={({ field }) => (
											<TextField {...field} label='Location' fullWidth />
										)}
									/>
								</Grid>
							</>
						)}

						<Grid item xs={12} sm={6}>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<Controller
									name='startDate'
									control={control}
									render={({ field }) => (
										<DatePicker
											label='Start Date'
											value={field.value}
											onChange={field.onChange}
											slotProps={{ textField: { fullWidth: true } }}
										/>
									)}
								/>
							</LocalizationProvider>
						</Grid>
						<Grid item xs={12} sm={6}>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<Controller
									name='endDate'
									control={control}
									render={({ field }) => (
										<DatePicker
											label='End Date'
											value={field.value}
											onChange={field.onChange}
											slotProps={{ textField: { fullWidth: true } }}
										/>
									)}
								/>
							</LocalizationProvider>
						</Grid>
					</Grid>
				</form>
			</Box>
		);
	}
);

export default AddEditModel;
