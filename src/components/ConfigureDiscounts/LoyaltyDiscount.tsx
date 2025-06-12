import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Button,
  Typography,
  Grid,
} from '@mui/material';

export default function LoyaltyDiscount() {
  const [discountType, setDiscountType] = useState('value');

  return (
    <Box component="form" sx={{ mt: 2 }}>
      <Grid container spacing={1}>
        {/* Left Column: Cut-off Age and Discount */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Cut-off Age */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                Cut-off Age
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  type="number"
                  size="small"
                  defaultValue={0}
                  inputProps={{ min: 0 }}
                  sx={{ maxWidth: 150 }}
                />
                <Typography variant="body2">years</Typography>
              </Box>
            </Box>

            {/* Discount Type */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                Discount
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'center' }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <FormControlLabel
                    value="value"
                    control={
                      <Radio
                        checked={discountType === 'value'}
                        onChange={() => setDiscountType('value')}
                      />
                    }
                    label="By Value"
                  />
                  <TextField
                    type="number"
                    size="small"
                    defaultValue={0.0}
                    inputProps={{ min: 0, step: 0.01 }}
                    sx={{ maxWidth: 120 }}
                    disabled={discountType !== 'value'}
                  />
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <FormControlLabel
                    value="percentage"
                    control={
                      <Radio
                        checked={discountType === 'percentage'}
                        onChange={() => setDiscountType('percentage')}
                      />
                    }
                    label="By Percentage"
                  />
                  <TextField
                    type="number"
                    size="small"
                    defaultValue={0.0}
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                    sx={{ maxWidth: 120 }}
                    disabled={discountType !== 'percentage'}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Right Column: Discount Applicable On */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="subtitle1" fontWeight="medium">
              Discount Applicable On
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                "Registration fees",
                "Consultation fees",
                "Local Pharmacy",
                "Local Procedure",
                "Local Order",
              ].map((label, index) => (
                <FormControlLabel
                  key={index}
                  control={<Checkbox />}
                  label={label}
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' }, m: 0 }}
                />
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box textAlign="right" mt={3}>
            <Button variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}