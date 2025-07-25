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

const FacilityPage = () => {
  const [newFacilityType, setNewFacilityType] = useState("");
  const [selectedFacility, setSelectedFacility] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [generateBills, setGenerateBills] = useState(false);

  const handleAddFacility = () => {
    if (newFacilityType) {
      setOpenModal(true);
    }
  };

  const handleFacilityTypeChange = (event: SelectChangeEvent<string>) => {
    setNewFacilityType(event.target.value);
  };

  const handleFormSubmit = (data: {
    firstName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    area: string;
    pin: string;
    fees: string;
    facilityType: string;
  }) => {
    console.log("New Facility Added:", data);
    setOpenModal(false);
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
            <MenuItem value="Practice">Practice</MenuItem>
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
        />
      </Box>

      {/* Modal */}
      <AddFacility
        open={openModal}
        handleClose={() => setOpenModal(false)}
        facilityType={newFacilityType}
        onSubmit={handleFormSubmit}
      />
    </Box>
  );
};

export default FacilityPage;
