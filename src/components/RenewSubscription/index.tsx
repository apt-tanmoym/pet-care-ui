'use client';

import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Checkbox,
  Paper,
} from '@mui/material';
import { useState } from 'react';

const pricing = {
  small: { range: '2 to 10 Doctors', rate: 1200 },
  medium: { range: '11 to 25 Doctors', rate: 2000 },
  large: { range: '26 to 50 Doctors', rate: 4500 },
};

export default function RenewPage() {
  const [organization, setOrganization] = useState('Test11');
  const [facility, setFacility] = useState('Test1');
  const [counts, setCounts] = useState({ small: 1, medium: 0, large: 0 });
  const [selected, setSelected] = useState('small');
  const [duration, setDuration] = useState('3');

  const getMonthlyTotal = () => {
    return (
      counts.small * pricing.small.rate +
      counts.medium * pricing.medium.rate +
      counts.large * pricing.large.rate
    );
  };

  const getMultiplier = () => {
    if (duration === '6') return 6 * 0.9;
    if (duration === '12') return 12 * 0.8;
    return 3;
  };

  const monthlyTotal = getMonthlyTotal();
  const finalTotal = monthlyTotal * getMultiplier();

  return (
    <Container maxWidth="md" sx={{ mt: 0, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }} elevation={3}>
        <Typography variant="h5" fontWeight="medium" sx={{ mb: 3 }}>
          Renew Your Clinic Subscription
        </Typography>

        {/* Organization and Facility Inputs in a row */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name of the Organization"
              fullWidth
              required
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Primary Facility"
              fullWidth
              required
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
              size="small"
            />
          </Grid>
        </Grid>

        {/* Pricing Tiers */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
            Select Pricing Tier
          </Typography>
          <Grid container spacing={2}>
            {(['small', 'medium', 'large'] as const).map((key) => (
              <Grid item xs={12} sm={4} key={key}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selected === key}
                        onChange={() => setSelected(key)}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          INR {pricing[key].rate.toLocaleString()}/month
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pricing[key].range}
                        </Typography>
                      </Box>
                    }
                  />
                  <TextField
                    type="number"
                    inputProps={{ min: 0 }}
                    value={counts[key]}
                    onChange={(e) =>
                      setCounts({ ...counts, [key]: Number(e.target.value) })
                    }
                    label="No. of Facilities"
                    size="small"
                    fullWidth
                    sx={{ maxWidth: 150 }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Monthly Total */}
        <Typography variant="body1" sx={{ mb: 3 }}>
          Monthly Subscription: INR {monthlyTotal.toFixed(2)}
        </Typography>

        {/* Subscription Duration */}
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend">
            <Typography variant="subtitle1" fontWeight="medium">
              Subscription Duration
            </Typography>
          </FormLabel>
          <RadioGroup
            row
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            sx={{ gap: 2 }}
          >
            <FormControlLabel value="3" control={<Radio />} label="3 Months" />
            <FormControlLabel
              value="6"
              control={<Radio />}
              label="6 Months (Save 10%)"
            />
            <FormControlLabel
              value="12"
              control={<Radio />}
              label="1 Year (Save 20%)"
            />
          </RadioGroup>
        </FormControl>

        {/* Total Amount */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" fontWeight="medium">
            Total Subscription Amount: INR {finalTotal.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You Pay: INR {finalTotal.toFixed(2)}
          </Typography>
        </Box>

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" color="secondary">
            Go Back
          </Button>
          <Button variant="contained" color="primary">
            Pay & Renew
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}