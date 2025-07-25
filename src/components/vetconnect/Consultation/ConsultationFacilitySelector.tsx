import React, { useEffect, useState } from "react";
import {
  FaclityServiceResponse,
  FaclityServicePayload,
} from "@/interfaces/facilityInterface";
import { getOwnFacilites } from "@/services/faclilityService";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface ConsultationFacilitySelectorProps {
  onFacilitySelect: (facility: FaclityServiceResponse | null) => void;
  onSelectConsultationDate: () => void;
  selectedFacility: FaclityServiceResponse | null;
}

const CONTROL_HEIGHT = 56;

const ConsultationFacilitySelector: React.FC<
  ConsultationFacilitySelectorProps
> = ({ onFacilitySelect, onSelectConsultationDate, selectedFacility }) => {
  const [facilities, setFacilities] = useState<FaclityServiceResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHelper, setShowHelper] = useState(false);

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true);
      try {
        const payload: FaclityServicePayload = {
          userName: "jibons",
          userPass: "P@ssw0rd",
          deviceStat: "M",
          callingFrom: "web",
          orgId: "20",
          searchFacility: "",
          status: "All",
        };
        const data = await getOwnFacilites(payload);
        setFacilities(data);
      } catch (error) {
        setFacilities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  const handleChange = (event: any) => {
    const facility =
      facilities.find((f) => f.facilityId === event.target.value) || null;
    onFacilitySelect(facility);
    setShowHelper(false);
  };

  const handleSelectConsultationDate = () => {
    if (!selectedFacility) {
      setShowHelper(true);
    } else {
      setShowHelper(false);
      onSelectConsultationDate();
    }
  };

  return (
    <Card
      sx={{
        width: "80%",
        maxWidth: 800,
        mx: "auto",
        mt: 4,
        borderRadius: 4,
        boxShadow: 6,
        background: "#ffffff",
        border: "1px solid #e0e0e0",
        p: 0,
      }}
    >
      <Box
        sx={{
          background: "#174a7c",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          p: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#fff",
            fontWeight: 700,
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          Select Your Facility
        </Typography>
      </Box>
      <CardContent
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            width: "100%",
          }}
        >
          <FormControl
            fullWidth
            variant="outlined"
            sx={{
              minWidth: 220,
              maxWidth: 500,
              flex: 1,
              height: CONTROL_HEIGHT,
              background: "#fff",
              borderRadius: 2,
            }}
            error={showHelper}
          >
            <InputLabel id="facility-select-label">Facility</InputLabel>
            <Select
              labelId="facility-select-label"
              value={selectedFacility?.facilityId || ""}
              onChange={handleChange}
              label="Facility"
              sx={{
                background: "#f8fafc",
                borderRadius: 2,
                fontWeight: 500,
                height: CONTROL_HEIGHT,
                display: "flex",
                alignItems: "center",
              }}
              disabled={loading || facilities.length === 0}
              inputProps={{
                sx: {
                  height: CONTROL_HEIGHT,
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              {facilities.map((facility) => (
                <MenuItem key={facility.facilityId} value={facility.facilityId}>
                  {facility.facilityName}
                </MenuItem>
              ))}
            </Select>
            {showHelper && (
              <FormHelperText sx={{ color: "#d32f2f" }}>
                Please select a facility.
              </FormHelperText>
            )}
          </FormControl>

         <Button
  variant="contained"
  onClick={handleSelectConsultationDate}
  startIcon={<CalendarMonthIcon />}
  sx={{
    bgcolor: '#174a7c',
    color: '#fff',
    fontWeight: 700,
    borderRadius: 3,
    py: 1.5,
    px: 4,
    height: CONTROL_HEIGHT,
    whiteSpace: 'nowrap',
    '&:hover': {
      bgcolor: '#103a61',
    },
  }}
>
  View Calendar
</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ConsultationFacilitySelector;
