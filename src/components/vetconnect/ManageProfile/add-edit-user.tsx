import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Box,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

interface AddEditModelProps {
  initialData: {
    institution?: string;
    degree?: string;
    fieldOfStudy?: string;
    grade?: string;
    startDate?: string;
    endDate?: string;
    jobTitle?: string;
    employmentType?: string;
    companyName?: string;
    location?: string;
  };
  formType: string | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const AddEditModel: React.FC<AddEditModelProps> = ({
  initialData,
  formType,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    institution: initialData.institution || "",
    degree: initialData.degree || "",
    fieldOfStudy: initialData.fieldOfStudy || "",
    grade: initialData.grade || "",
    startDate: initialData.startDate ? dayjs(initialData.startDate) : null,
    endDate: initialData.endDate ? dayjs(initialData.endDate) : null,
    jobTitle: initialData.jobTitle || "",
    employmentType: initialData.employmentType || "",
    companyName: initialData.companyName || "",
    location: initialData.location || "",
  });

  useEffect(() => {
    setFormData({
      institution: initialData.institution || "",
      degree: initialData.degree || "",
      fieldOfStudy: initialData.fieldOfStudy || "",
      grade: initialData.grade || "",
      startDate: initialData.startDate ? dayjs(initialData.startDate) : null,
      endDate: initialData.endDate ? dayjs(initialData.endDate) : null,
      jobTitle: initialData.jobTitle || "",
      employmentType: initialData.employmentType || "",
      companyName: initialData.companyName || "",
      location: initialData.location || "",
    });
  }, [initialData]);

  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: event.target.value });
    };

  const handleDateChange = (field: string) => (date: Dayjs | null) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleSave = () => {
    onSave({
      ...formData,
      startDate: formData.startDate
        ? formData.startDate.format("YYYY-MM-DD")
        : "",
      endDate: formData.endDate ? formData.endDate.format("YYYY-MM-DD") : "",
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        {formType == "education" && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Institution"
                fullWidth
                value={formData.institution}
                onChange={handleChange("institution")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Degree"
                fullWidth
                value={formData.degree}
                onChange={handleChange("degree")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Field of Study"
                fullWidth
                value={formData.fieldOfStudy}
                onChange={handleChange("fieldOfStudy")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Grade"
                fullWidth
                value={formData.grade}
                onChange={handleChange("grade")}
              />
            </Grid>
          </>
        )}
        {formType == "experience" && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Job Title"
                fullWidth
                value={formData.jobTitle}
                onChange={handleChange("jobTitle")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employment Type"
                fullWidth
                value={formData.employmentType}
                onChange={handleChange("employmentType")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Company Name"
                fullWidth
                value={formData.companyName}
                onChange={handleChange("companyName")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location"
                fullWidth
                value={formData.location}
                onChange={handleChange("location")}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={formData.startDate}
              onChange={handleDateChange("startDate")}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="End Date"
              value={formData.endDate}
              onChange={handleDateChange("endDate")}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddEditModel;
