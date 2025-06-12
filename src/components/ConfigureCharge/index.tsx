"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
} from "@mui/material";

export default function ChargeEvent() {
  const [tabIndex, setTabIndex] = useState(0);
  const [registrationOption, setRegistrationOption] = useState("bill");
  const [registrationFee, setRegistrationFee] = useState("100.0");
  const [consultationFees, setConsultationFees] = useState({
    booking: "0.0",
    arrival: "0.0",
    completion: "0.0",
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, margin: "auto", mt: 0 }}>
      <Typography variant="h5" gutterBottom>
        Charge Event of Test11
      </Typography>

      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Registration" />
        <Tab label="Consultation" />
      </Tabs>

      {tabIndex === 0 && (
        <Box>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ mb: 1 }}>
              Registration will be collected at
            </FormLabel>
            <RadioGroup
              value={registrationOption}
              onChange={(e) => setRegistrationOption(e.target.value)}
            >
              <FormControlLabel
                value="mrn"
                control={<Radio />}
                label="MRN creation (i.e. at registration completion)"
              />
              <FormControlLabel
                value="bill"
                control={<Radio />}
                label="Together with first bill"
              />
            </RadioGroup>
          </FormControl>

          <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Typography>Registration Fees:</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                value={registrationFee}
                onChange={(e) => setRegistrationFee(e.target.value)}
              />
            </Grid>
          </Grid>

          <Box textAlign="right" mt={4}>
            <Button variant="contained" color="primary">
              Update
            </Button>
          </Box>
        </Box>
      )}

      {tabIndex === 1 && (
        <Box>
          <Alert
            variant="standard"
            severity="info"
            sx={{
              backgroundColor: "transparent",
              padding: 0,
            }}
          >
            This is an info Alert.
          </Alert>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <Typography fontWeight="bold">
                Consultation fees will be collected at
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography fontWeight="bold">Collection (%)</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography>At the time of Appointment booking</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                value={consultationFees.booking}
                onChange={(e) =>
                  setConsultationFees({
                    ...consultationFees,
                    booking: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={8}>
              <Typography>At the time of arrival</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                value={consultationFees.arrival}
                onChange={(e) =>
                  setConsultationFees({
                    ...consultationFees,
                    arrival: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={8}>
              <Typography>At the time of Encounter completion</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                value={consultationFees.completion}
                onChange={(e) =>
                  setConsultationFees({
                    ...consultationFees,
                    completion: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>

          <Box textAlign="right" mt={4}>
            <Button variant="contained" color="primary">
              Update
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
