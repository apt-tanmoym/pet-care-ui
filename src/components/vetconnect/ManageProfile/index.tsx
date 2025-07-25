import React, { useState, useRef, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CloudUpload } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { HexColorPicker } from "react-colorful";
import { FaclityServiceResponse } from "@/interfaces/facilityInterface";
import styles from "./styles.module.scss";
import UploadBadge from "@/components/common/uploadBadge/UploadBadge";
import CommonTable from "@/components/common/table/Table";
import TableLinkButton from "@/components/common/buttons/TableLinkButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonDialog from "@/components/common/CummonDialog";
import AddEditModel from "./add-edit-user";

type EditFacilityProps = {
  facility: FaclityServiceResponse;
};

type ChipVariant = "filled" | "outlined";

interface ChipData {
  id: number;
  label: string;
  variant: ChipVariant;
}

interface TableColumn {
  id: string;
  label: string;
}

interface TableRowData {
  [key: string]: any;
}

function VetConnectUserProfile() {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [themeColor, setThemeColor] = useState("#1a365d");
  const [hexInput, setHexInput] = useState("#1a365d");
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddExprienceDialog, setOpenAddExprienceDialog] = useState(false);
  const [showAddForm, setShowAddForm] = useState<
    "education" | "experience" | null
  >(null);
  const [selectedRow, setSelectedRow] = useState<TableRowData | null>(null);

  const initialChips: ChipData[] = [
    { id: 1, label: "Cat", variant: "filled" },
    { id: 2, label: "Dog", variant: "filled" },
    { id: 3, label: "Hourse", variant: "filled" },
    { id: 4, label: "Moenky", variant: "outlined" },
    { id: 5, label: "Behaviour", variant: "outlined" },
    { id: 6, label: "Bird", variant: "outlined" },
    { id: 7, label: "Eye", variant: "outlined" },
    { id: 8, label: "Ear", variant: "outlined" },
    { id: 9, label: "Psychology", variant: "outlined" },
  ];
  const [chips, setChips] = useState(initialChips);

  const data = [{
      institution: "TEST",
      degree: "Test",
      fieldOfStudy: "Test",
      grade: "Not Available",
      startDate: "2022-04-17",
      endDate: "2022-04-17",
  }]

  

  const [educationData, setEducationData] = useState<TableRowData[]>([
    {
      institution: "TEST",
      degree: "Test",
      fieldOfStudy: "Test",
      grade: "Not Available",
      startDate: "2022-04-17",
      endDate: "2022-04-17",
      action: (
        <>
          <TableLinkButton
            text="Edit"
            icon={<EditIcon />}
            onClick={() => handleEdit("education", educationData[0])}
          />
          <TableLinkButton
            text="Delete"
            icon={<DeleteIcon />}
            color="error"
            onClick={() => handleDelete("education", 0)}
          />
        </>
      ),
    },
  ]);

  const [experienceData, setExperienceData] = useState<TableRowData[]>([
    {
      jobTitle: "TEST",
      employmentType: "Permanent",
      companyName: "Test",
      location: "Not Available",
      startDate: "2022-04-17",
      endDate: "2022-04-17",
      action: (
        <>
          <TableLinkButton
            text="Edit"
            icon={<EditIcon />}
            onClick={() => handleEdit("experience", experienceData[0])}
          />
          <TableLinkButton
            text="Delete"
            icon={<DeleteIcon />}
            color="error"
            onClick={() => handleDelete("experience", 0)}
          />
        </>
      ),
    },
  ]);

  const handleToggle = (id: number) => {
    setChips((prev) =>
      prev.map((chip) =>
        chip.id === id
          ? {
              ...chip,
              variant: chip.variant === "filled" ? "outlined" : "filled",
            }
          : chip
      )
    );
  };

  const [value, setValue] = React.useState<Dayjs | null>(dayjs("2022-04-17"));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    }

    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker]);

  useEffect(() => {
    setHexInput(themeColor);
  }, [themeColor]);

  const educationColumns: TableColumn[] = [
    { id: "institution", label: "Institution" },
    { id: "degree", label: "Degree" },
    { id: "fieldOfStudy", label: "Field of Study" },
    { id: "grade", label: "Grade" },
    { id: "startDate", label: "Start Date" },
    { id: "endDate", label: "End Date" },
    { id: "action", label: "Action" },
  ];

  const experienceColumns: TableColumn[] = [
    { id: "jobTitle", label: "Job Title" },
    { id: "employmentType", label: "Employment Type" },
    { id: "companyName", label: "Company Name" },
    { id: "location", label: "Location" },
    { id: "startDate", label: "Start Date" },
    { id: "endDate", label: "End Date" },
    { id: "action", label: "Action" },
  ];

  const handleEdit = (type: "education" | "experience", row: TableRowData) => {
    setShowAddForm(type);
    setSelectedRow(row);
    setOpenEditDialog(true);
  };

  const handleDelete = (type: string, index: number) => {
    if (type === "education") {
      setEducationData(educationData.filter((_, i) => i !== index));
    } else if (type === "experience") {
      setExperienceData(experienceData.filter((_, i) => i !== index));
    }
  };

  const handleSaveEdit = (data: any) => {
    if (selectedRow) {
      const updatedData = { ...selectedRow, ...data };
      if (educationData.includes(selectedRow)) {
        setEducationData(
          educationData.map((row) => (row === selectedRow ? updatedData : row))
        );
      } else if (experienceData.includes(selectedRow)) {
        setExperienceData(
          experienceData.map((row) => (row === selectedRow ? updatedData : row))
        );
      }
    }
    setOpenEditDialog(false);
  };

  const handleAdd = (type: "education" | "experience") => {
    setShowAddForm(type);
    setOpenAddExprienceDialog(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ maxWidth: 1345 }}>
        <CardMedia
          component="img"
          height="140"
          image="/images/sample.jpeg"
          alt="green iguana"
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={1}>
              <UploadBadge />
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              sx={{ marginTop: "50px", marginLeft: "25px" }}
            >
              <Typography gutterBottom variant="h5" component="div">
                Dr Test
              </Typography>
            </Grid>
          </Grid>

          <Box
            component="fieldset"
            sx={{
              border: "1px solid #ccc",
              padding: 2,
              borderRadius: 2,
              marginTop: 2,
            }}
          >
            <legend className={styles.legend}>Personal Information</legend>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  label="Name"
                  fullWidth
                  defaultValue="TEST"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    slotProps={{ textField: { fullWidth: true } }}
                    label="DOB"
                    defaultValue={dayjs("2022-04-17")}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  label="Education"
                  fullWidth
                  defaultValue="MBBS"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Language"
                  fullWidth
                  defaultValue="Not Available"
                />
              </Grid>

              <Grid item xs={12} sm={8}>
                <TextField
                  label="Speciality"
                  fullWidth
                  defaultValue="Large Animal Internal Medicine"
                />
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box
                component="fieldset"
                sx={{
                  border: "1px solid #ccc",
                  padding: 2,
                  borderRadius: 2,
                  marginTop: 2,
                }}
              >
                <legend className={styles.homeLegend}>Home Address</legend>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      label="City"
                      fullWidth
                      defaultValue="TEST"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      label="State"
                      fullWidth
                      defaultValue="TEST"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      label="Pincode"
                      fullWidth
                      defaultValue="123456"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      label="Landmark"
                      fullWidth
                      defaultValue="Test"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                component="fieldset"
                sx={{
                  border: "1px solid #ccc",
                  padding: 2,
                  borderRadius: 2,
                  marginTop: 2,
                }}
              >
                <legend className={styles.contactLegend}>Contacts</legend>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      label="Primary Email"
                      fullWidth
                      defaultValue="TEST@test.com"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      label="Optional Email"
                      fullWidth
                      defaultValue="TEST@test.com"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      label="Primary Phone"
                      fullWidth
                      defaultValue="123456"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      label="Optional Phone"
                      fullWidth
                      defaultValue="123456"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>

          <Box
            component="fieldset"
            sx={{
              border: "1px solid #ccc",
              padding: 2,
              borderRadius: 2,
              marginTop: 2,
            }}
          >
            <legend className={styles.expirenceLegend}>Education</legend>
            <CommonTable
              heading=""
              colHeaders={educationColumns}
              rowData={educationData}
              showSearch={false}
              showAddButton={true}
              addButtonLabel="Add Education"
              onAddButtonClick={() => handleAdd("education")}
              showFilterButton={false}
            />
          </Box>

          <Box
            component="fieldset"
            sx={{
              border: "1px solid #ccc",
              padding: 2,
              borderRadius: 2,
              marginTop: 2,
            }}
          >
            <legend className={styles.expirenceLegend}>Experience</legend>
            <CommonTable
              heading=""
              colHeaders={experienceColumns}
              rowData={experienceData}
              showSearch={false}
              showAddButton={true}
              addButtonLabel="Add Experience"
              onAddButtonClick={() => handleAdd("experience")}
              showFilterButton={false}
            />
          </Box>

          <Box
            component="fieldset"
            sx={{
              border: "1px solid #ccc",
              padding: 2,
              borderRadius: 2,
              marginTop: 2,
            }}
          >
            <legend className={styles.expirenceLegend}>Categories</legend>
            <Grid container spacing={2}>
              <Stack direction="row" spacing={1} sx={{ margin: "25px" }}>
                {chips.map((chip) => (
                  <Chip
                    key={chip.id}
                    label={chip.label}
                    variant={chip.variant}
                    onClick={() => handleToggle(chip.id)}
                    clickable
                    color="primary"
                  />
                ))}
              </Stack>
            </Grid>
          </Box>

          <Box
            component="fieldset"
            sx={{
              border: "1px solid #ccc",
              padding: 2,
              borderRadius: 2,
              marginTop: 2,
            }}
          >
            <legend className={styles.expirenceLegend}>Facilities</legend>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: "15px",
              }}
            >
              <Button
                variant="contained"
                endIcon={<AddCircleOutlineIcon />}
                size="large"
              >
                Add Facilities
              </Button>
            </Box>
          </Box>

          <CommonDialog
            open={openEditDialog}
            title={`Edit ${
              showAddForm === "education" ? "Education" : "Experience"
            }`}
            onClose={() => setOpenEditDialog(false)}
            onSubmit={handleSaveEdit}
            maxWidth="md"
          >
            {selectedRow && (
              <AddEditModel
                initialData={selectedRow}
                onSave={handleSaveEdit}
                onCancel={() => setOpenEditDialog(false)}
                formType={showAddForm}
              />
            )}
          </CommonDialog>

          <CommonDialog
            open={openAddExprienceDialog}
            title="Add Education"
            onClose={() => setOpenAddExprienceDialog(false)}
            onSubmit={handleSaveEdit}
            maxWidth="md"
          >
            <AddEditModel
              initialData={{}}
              onSave={handleSaveEdit}
              formType={showAddForm}
              onCancel={() => setOpenEditDialog(false)}
            />
          </CommonDialog>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VetConnectUserProfile;
