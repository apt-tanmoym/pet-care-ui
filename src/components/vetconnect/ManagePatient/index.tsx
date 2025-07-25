import React, { useState, useRef, useEffect } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Box,
  Select,
  InputLabel,
  FormControl,
  Button,
  Typography,
  Stack,
  Chip,
  Card,
  CardContent,
  CardMedia,
  FormControlLabel,
  Switch
} from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import styles from './styles.module.scss';
import UploadBadge from '@/components/common/uploadBadge/UploadBadge';
import { dietData, dseaseHistory } from './data/chipData';
import { ChipData } from './interfaces/ChipData';
import CummonDialog from '@/components/common/CummonDialog';
import AddPet from './forms/AddPet';
import AddDocument from './forms/AddDocument';
import MonthList from './forms/MonthList';

function VetConnectManagePatient() {
  
  const [checked, setChecked] = useState(true);
  const dietInitialChips: ChipData[] = dietData;
  const dieseaseHistoryInitialChips: ChipData[] = dseaseHistory;
  const [dietChips, setDietChips] = useState(dietInitialChips);
  const [dieseaseHistoryChips, setdieseaseHistoryChips] = useState(dieseaseHistoryInitialChips);
  
  const [selectedValue, setSelectedValue] = useState("Test");

  const [openAddDialoge, setOpenAddDialoge] = useState(false);

  const [openDocumentDialoge, setopenDocumentDialoge] = useState(false);
 const [ openMonthDialoge, setOpenMonthDialoge ] = useState(false)

  const handleClose = () => {
    setOpenAddDialoge(false);
  };

  const handleMonthClose = () => {
    setOpenMonthDialoge(false);
  };

  const handleMonthOpenDialoge = () => {
    setOpenMonthDialoge(true);
  };

  const handleOpenDialouge = () => {
    setOpenAddDialoge(true);
  };

  const handleOpenDocumentDialoge = () =>{
    setopenDocumentDialoge(true)
  }

  const handleDocumentClose = ()=>{
    setopenDocumentDialoge(false)
  }

  const handleIsTrained = (_event: React.SyntheticEvent, checked: boolean) => {
    setChecked(checked);
  };

  const handleToggle = (id:number) => {
    setDietChips((prev) =>
      prev.map((chip) =>
        chip.id === id
          ? {
              ...chip,
              variant: chip.variant === 'filled' ? 'outlined' : 'filled',
            }
          : chip
      )
    );
  };

  const handleDiseaseToggle = (id:number) => {
    setdieseaseHistoryChips((prev) =>
      prev.map((chip) =>
        chip.id === id
          ? {
              ...chip,
              variant: chip.variant === 'filled' ? 'outlined' : 'filled',
            }
          : chip
      )
    );
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
        <Grid container>
        <Grid item xs={12} sm={1}>
          <UploadBadge/>
        </Grid>
        <Grid item xs={12} sm={6} sx={{marginTop:'50px', marginLeft: '25px'}}>
        <Typography gutterBottom variant="h5" component="div">
            Pet Of Test User
        </Typography>
        </Grid>

        <Grid item xs={12} sm={2} sx={{marginTop:'50px',marginRight: '25px'}}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="demo-simple-select-label">Pet Name</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Pet Name"
            defaultValue={selectedValue}
          >
            <MenuItem value="Test">Test</MenuItem>
          </Select>
        </FormControl>
        </Grid>

        <Grid item xs={12} sm={2} sx={{marginTop:'60px'}}>
          <Button variant="outlined"  onClick={() => handleOpenDialouge()} startIcon={<AddIcon />} className={styles.ovalButton}>
          Add Pet
          </Button>
        </Grid>

        </Grid>
      
      
      <Box component="fieldset" sx={{ border: '1px solid #ccc', padding: 2, borderRadius: 2, marginTop: 2 }}>
      <legend className={styles.legend}>Owner Personal Information</legend>
      <Grid container spacing={2}>
       
        <Grid item xs={12} sm={4}>
         <TextField
            required
            label="First Name"
            fullWidth
            defaultValue="TEST"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
        <TextField
            required
            label="Last Name"
            fullWidth
            defaultValue="TEST"
          />
        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
      
        <DatePicker slotProps={{ textField: { fullWidth: true } }} label="DOB"  defaultValue={dayjs('2022-04-17')} />
        
    </LocalizationProvider> */}
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            required
            label="Username"
            fullWidth
            defaultValue="Test"
            disabled
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField label="Email" fullWidth defaultValue="test@test.com" disabled/>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField label="Phone Number" disabled fullWidth defaultValue="782000216" />
        </Grid>

        </Grid>
      </Box>

      <Box component="fieldset" sx={{ border: '1px solid #ccc', padding: 2, borderRadius: 2, marginTop: 2 }}>
      <legend className={styles.legend}>Pet Personal Information</legend>
      <Grid container spacing={2}>
       
        <Grid item xs={12} sm={4}>
         <TextField
            required
            label="Pet Name"
            fullWidth
            defaultValue="PET TEST"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
        
          <LocalizationProvider dateAdapter={AdapterDayjs}>
      
           <DatePicker slotProps={{ textField: { fullWidth: true } }} label="DOB"  defaultValue={dayjs('2022-04-17')} />
        
         </LocalizationProvider> 
        </Grid>

        <Grid item xs={12} sm={4}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="demo-simple-select-label">Gender</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Pet Name"
            defaultValue={selectedValue}
          >
            <MenuItem value="Test">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField label="Breed" fullWidth defaultValue="Test Breed"/>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField label="Diet" fullWidth defaultValue="Meat"/>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField label="Leaving Enviorment" fullWidth defaultValue="Home" />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField label="Description" multiline
          rows={4} fullWidth defaultValue="Test Description" />
        </Grid>

        </Grid>
      </Box>

    
      <Box component="fieldset" sx={{ border: '1px solid #ccc', padding: 2, borderRadius: 2, marginTop: 2 }}>

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
   
      

    <Grid container spacing={2}>
     
<Grid item xs={12} sm={6}>
          <Box component="fieldset" sx={{ border: '1px solid #ccc', padding: 2, borderRadius: 2, marginTop: 2 }}>
          

          <legend className={styles.dietLegend}>Diet</legend>
          
          <Grid container spacing={2}>
            <Stack direction="row" spacing={1} sx={{margin:'25px',display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)', // Exactly 8 per row
    gap: 1,}}>
            {dietChips.map((chip) => (
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
      </Grid>
      <Grid item xs={12} sm={6}>
          <Box component="fieldset" sx={{ border: '1px solid #ccc', padding: 2, borderRadius: 2, marginTop: 2 }}>
          

          <legend className={styles.dieseaseHistoryLegend}>Disease History</legend>
          

            <Grid container spacing={2}>
            <Stack direction="row" spacing={1} sx={{margin:'25px',display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)', // Exactly 8 per row
    gap: 1,}}>
            {dieseaseHistoryChips.map((chip) => (
        <Chip
          key={chip.id}
          label={chip.label}
          variant={chip.variant}
          onClick={() => handleDiseaseToggle(chip.id)}
          clickable
          color="primary"
        />
      ))}

            </Stack>
            </Grid>

        </Box>
      </Grid>
    </Grid>

    <FormControlLabel
          control={<Switch color="primary" />}
          label="Traning Done"
          labelPlacement="start"
          checked={checked} 
          onChange={handleIsTrained}
        />
{checked &&(
    <Box component="fieldset" sx={{ border: '1px solid #ccc', padding: 2, borderRadius: 2, marginTop: 2 }}>

      <legend className={styles.traningInformation}>Traning Information</legend>
      <Grid container spacing={2}>
       
        <Grid item xs={12} sm={3}>
         <TextField
            required
            label="Traning School"
            fullWidth
            defaultValue="TEST School"
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            required
            label="Trainer Name"
            fullWidth
            defaultValue="Test"
          />
        </Grid>

        <Grid item xs={12} sm={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      
        <DatePicker slotProps={{ textField: { fullWidth: true } }} label="Start Date"  defaultValue={dayjs('2022-04-17')} />
        
    </LocalizationProvider>
        </Grid>

        

        

        <Grid item xs={12} sm={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      
        <DatePicker slotProps={{ textField: { fullWidth: true } }} label="End Date"  defaultValue={dayjs('2022-04-17')} />
        
    </LocalizationProvider>
        </Grid>

        <Grid item xs={12} sm={6}>
        <TextField label="Traning Description" multiline
          rows={4} fullWidth defaultValue="Test Description" />
        </Grid>

        </Grid>
      </Box>
)}
      <Box component="fieldset" sx={{ border: '1px solid #ccc', padding: 2, borderRadius: 2, marginTop: 2 }}>
      <legend className={styles.sharedDocumentLegend}>Shared Document</legend>
      
      <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end', // centers horizontally
        alignItems: 'center', 
        paddingBottom: '15px'    // centers vertically (if needed)        // optional: full viewport height
      }}
     >
        <Stack direction="row" spacing={1}>
          <Chip label="Recent(0)" color="primary" variant="outlined" />
          <Chip label="Last Month(0)" color="primary" variant="outlined" />
          <Chip label="Select Month"  onClick={() => handleMonthOpenDialoge()} color="primary" variant="outlined" />
        </Stack>
      </Box>
      <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', // centers horizontally
        alignItems: 'center', 
        paddingBottom: '20px'    // centers vertically (if needed)        // optional: full viewport height
      }}
     >
     
      <Button variant="contained" onClick={handleOpenDocumentDialoge} endIcon={<AddCircleOutlineIcon />} size='large'>
            Add New Document
      </Button>
      </Box>
      </Box>
        
      
      </CardContent>
      </Card>
      <CummonDialog open={openAddDialoge} onClose={handleClose} onSubmit={()=>{}} maxWidth="md" title="Add New Pet" >
         <AddPet />
      </CummonDialog>

      <CummonDialog open={openDocumentDialoge} onClose={handleDocumentClose} onSubmit={()=>{}} maxWidth="sm" title="Add Document" >
         <AddDocument />
      </CummonDialog>

      <CummonDialog open={openMonthDialoge} onClose={handleMonthClose} onSubmit={()=>{}} maxWidth="xs" title="Select Month" >
         <MonthList />
      </CummonDialog>
    </Box>

    
  );
}

export default VetConnectManagePatient;
