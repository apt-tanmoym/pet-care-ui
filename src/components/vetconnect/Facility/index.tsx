import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import SelectYourFacility from "./SelectYourFacility";
import { SelectChangeEvent } from "@mui/material/Select";
import AddFacility from "./AddFacilityModal";
import Message from "@/components/common/Message";

const FacilityPage = () => {
  const [newFacilityType, setNewFacilityType] = useState("");
  const [selectedFacility, setSelectedFacility] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [generateBills, setGenerateBills] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [refreshKey, setRefreshKey] = useState(0);
  const handleAddFacility = () => {
    if (newFacilityType) {
      setOpenModal(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleFacilityTypeChange = (event: SelectChangeEvent<string>) => {
    setNewFacilityType(event.target.value);
  };

  const handleFormSubmit = (data: {
    facilityName: string;
    address1: string;
    address2: string;
    city: string;
    searcharea: string;
    pin: string;
    fees: string;
    facilityType: string;
  }) => {
    console.log("New Facility Added:", data);
    setSnackbarMessage('New Facility Added Successfully');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
    setOpenModal(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Box
      sx={{
        maxWidth: "60%",
        margin: "auto",
        mt: 4,
        p: 0,
        borderRadius: 2,
        boxShadow: 1,
        bgcolor: "#fff",
      }}
    >
      <Box
        sx={{
          bgcolor: "#0c3c69",
          color: "#fff",
          py: 2,
          px: 3,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Find your facilities
        </Typography>
      </Box>

      {/* Main Form Section */}
      <Box
        sx={{
          p: 3,
        }}
      >
        <FormControl fullWidth variant="outlined">
          <InputLabel id="demo-simple-select-label">Add Facilities</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={newFacilityType}
            onChange={handleFacilityTypeChange}
            label="Add Facilities"
          >
            <MenuItem value="Tele Medicine">Tele Medicine</MenuItem>
            <MenuItem value="practice">Practice</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleAddFacility}
          fullWidth
          sx={{
            mt: 2,
            mb: 2,
            bgcolor: "#0c3c69",
            color: "#fff",
            "&:hover": {
              bgcolor: "#092a4e",
            },
          }}
          disabled={!newFacilityType}
        >
          Add
        </Button>

        <SelectYourFacility
          selectedFacility={selectedFacility}
          setSelectedFacility={setSelectedFacility}
          generateBills={generateBills}
          setGenerateBills={setGenerateBills}
          onLoad={refreshKey}
        />
      </Box>

      {/* Modal */}
      <AddFacility
        open={openModal}
        handleClose={() => setOpenModal(false)}
        facilityType={newFacilityType}
        onSubmit={handleFormSubmit}
      />
      <Message 
        openSnackbar={openSnackbar} 
        handleCloseSnackbar={handleCloseSnackbar} 
        snackbarSeverity={snackbarSeverity} 
        snackbarMessage={snackbarMessage} 
      />
    </Box>
  );
};

export default FacilityPage;
