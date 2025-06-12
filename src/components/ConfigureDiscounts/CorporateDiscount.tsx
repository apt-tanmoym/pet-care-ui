import React, { useState } from 'react';
import { Box, TextField, Checkbox, FormControlLabel, FormGroup, Typography, Radio, RadioGroup, FormControl, FormLabel } from '@mui/material';
import CommonTable from '../common/table/Table';
import TableLinkButton from '../common/buttons/TableLinkButton';
import SettingsIcon from '@mui/icons-material/Settings';
import CummonDialog from '../common/CummonDialog';

interface DiscountDetail {
  type: 'value' | 'percentage';
  amount: string;
}

interface CorporateDiscountData {
  name: string;
  discountCategory?: string;
  applicableOn: string[];
  discountDetails: { [key: string]: DiscountDetail }; 
  action: JSX.Element;
}

interface FormState {
  name: string;
  discountCategory: string;
  applicableOn: string[];
  discountDetails: { [key: string]: DiscountDetail };
}

export default function CorporateDiscount() {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormState>({
    name: 'abc',
    discountCategory: '',
    applicableOn: [],
    discountDetails: {},
  });

  const [corporateData, setCorporateData] = useState<CorporateDiscountData[]>([
    {
      name: 'abc',
      discountCategory: '',
      applicableOn: [],
      discountDetails: {},
      action: <></>,
    },
  ]);

  const handleOpenDialog = (index?: number) => {
    if (index !== undefined) {
      const data = corporateData[index];
      setFormData({
        name: data.name,
        discountCategory: data.discountCategory || '',
        applicableOn: data.applicableOn || [],
        discountDetails: data.discountDetails || {},
      });
      setIsEditing(true);
      setEditIndex(index);
    } else {
      setFormData({
        name: 'abc',
        discountCategory: '',
        applicableOn: [],
        discountDetails: {},
      });
      setIsEditing(false);
      setEditIndex(null);
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setFormData({ name: 'abc', discountCategory: '', applicableOn: [], discountDetails: {} });
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleSubmit = () => {
    const updatedData = [...corporateData];
    const newEntry = {
      name: formData.name,
      discountCategory: formData.discountCategory,
      applicableOn: formData.applicableOn,
      discountDetails: formData.discountDetails,
      action: <></>,
    };

    if (isEditing && editIndex !== null) {
      updatedData[editIndex] = newEntry;
    } else {
      updatedData.push(newEntry);
    }

    setCorporateData(updatedData);
    handleCloseDialog();
  };

  const corporateColumns = [
    { id: 'name', label: 'Name' },
    { id: 'action', label: 'Action' },
  ];

  const tableData = corporateData.map((data, index) => ({
    ...data,
    action: (
      <TableLinkButton
        text="Configure"
        icon={<SettingsIcon/>}
        onClick={() => handleOpenDialog(index)}
      />
    ),
  }));

  const applicableOnOptions = ['Registration', 'Consultation', 'Pharmacy', 'Procedure', 'Order'];

  const handleCheckboxChange = (option: string) => {
    let updatedApplicableOn: string[];
    let updatedDiscountDetails = { ...formData.discountDetails };

    if (formData.applicableOn.includes(option)) {
      updatedApplicableOn = formData.applicableOn.filter((item) => item !== option);
      delete updatedDiscountDetails[option];
    } else {
      updatedApplicableOn = [...formData.applicableOn, option];
      updatedDiscountDetails[option] = { type: 'percentage', amount: '' }; 
    }

    setFormData({
      ...formData,
      applicableOn: updatedApplicableOn,
      discountDetails: updatedDiscountDetails,
    });
  };

  const handleDiscountTypeChange = (option: string, type: 'value' | 'percentage') => {
    setFormData({
      ...formData,
      discountDetails: {
        ...formData.discountDetails,
        [option]: { ...formData.discountDetails[option], type, amount: '' }, 
      },
    });
  };

  // Handle discount amount change
  const handleDiscountAmountChange = (option: string, amount: string) => {
    setFormData({
      ...formData,
      discountDetails: {
        ...formData.discountDetails,
        [option]: { ...formData.discountDetails[option], amount },
      },
    });
  };

  return (
    <Box mt={3}>
      <CommonTable
        heading=""
        showSearch={true}
        showAddButton={false}
        showFilterButton={false}
        colHeaders={corporateColumns}
        rowData={tableData}
        // onAdd={() => handleOpenDialog()}
      />

      <CummonDialog
        open={open}
        title="Corporate Discount Details"
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        submitLabel={isEditing ? 'Save' : 'Submit'}
        cancelLabel="Cancel"
        maxWidth="sm"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1">Corporate Name :</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {formData.name}
            </Typography>
          </Box>
          <TextField
            label="Discount Category Name"
            value={formData.discountCategory}
            onChange={(e) => setFormData({ ...formData, discountCategory: e.target.value })}
            fullWidth
            required
            InputLabelProps={{ required: true }}
          />
          <Typography variant="body1">Discount applicable on :</Typography>
          <FormGroup>
            {applicableOnOptions.map((option) => (
              <Box key={option} sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.applicableOn.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                    />
                  }
                  label={option}
                />
                {formData.applicableOn.includes(option) && (
                  <Box sx={{ ml: 4, mt: 1 }}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Discount :</FormLabel>
                      <RadioGroup
                        row
                        value={formData.discountDetails[option]?.type || 'percentage'}
                        onChange={(e) =>
                          handleDiscountTypeChange(option, e.target.value as 'value' | 'percentage')
                        }
                      >
                        <FormControlLabel value="value" control={<Radio />} label="By value" />
                        <FormControlLabel value="percentage" control={<Radio />} label="By percentage" />
                      </RadioGroup>
                      <TextField
                      sx={{ mt: 1 }}
                      value={formData.discountDetails[option]?.amount || ''}
                      onChange={(e) => handleDiscountAmountChange(option, e.target.value)}
                      placeholder={
                        formData.discountDetails[option]?.type === 'value' ? 'Enter amount' : 'Enter percentage'
                      }
                      type="number"
                      size="small"
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                    </FormControl>
                    
                  </Box>
                )}
              </Box>
            ))}
          </FormGroup>
        </Box>
      </CummonDialog>
    </Box>
  );
}