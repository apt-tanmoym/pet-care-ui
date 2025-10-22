import React, { useEffect, useMemo, useState } from 'react';
import {
  Box, Typography, TextField, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody, Button, TablePagination
} from '@mui/material';

import { styled } from '@mui/system';
import styles from './styles.module.css';
import {  getCounsultationFees } from '@/services/feesAndCharges';
import Message from '../../common/Message';
import EditIcon from "@mui/icons-material/Edit";
import PatientDetails from './patientDetails'
import { getPetDetails, getPetList, getPetOwnerList } from '@/services/managePatientService';

const Container = styled(Box)(({ theme }) => ({
  padding: theme?.spacing?.(2),
  [theme?.breakpoints?.down('sm')]: {
    padding: theme?.spacing?.(1),
  },
}));

function VetConnectManagePatient()  {

  const [page, setPage] = useState(0);
  const [rowData, setRowData] = useState<any[]>([]);
  const [petList, setPetList] = useState<any[]>([]);
  const [petDetails, setPetDetails] = useState<any>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditClicked , setIsEditClicked] = useState(false);

  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
 

  const counsltationPayload = {
    "callingFrom": "web",
    "userName": "dasdebashisindia",
    "userPwd": "P@ssw0rd",
    "orgId": "2",
    "deviceStat": "M",
  }

  const fetchPetList = async (id:any) => {
    const petListObj = {
      ...counsltationPayload,
      petOwnerUid: id
    }
    try {
      const response:any = await getPetList(petListObj);
      console.log("response")
       console.log(response)
      //const data: any = await response;
      setPetList(response);
     
      return response;
      //setRowData(data);
    } catch (error: any) {
      setSnackbarMessage(error?.response?.data?.message || 'Server Error');
      setOpenSnackbar(true);
    }
  };

   const fecthPetDetails = async (id:any) => {
    const petListObj = {
    "userName": "dasdebashisindia",
    "userPwd": "P@ssw0rd",
    "deviceStat": "D",
    "patientUid": id
    }
    try {
      const response:any = await getPetDetails(petListObj);
      console.log("response")
       console.log(response)
      //const data: any = await response;
      setPetDetails(response);
        return response;
      //setRowData(data);
    } catch (error: any) {
      setSnackbarMessage(error?.response?.data?.message || 'Server Error');
      setOpenSnackbar(true);
    }
  };

  const fetchOwnerList = async () => {
    try {
      const response = await getPetOwnerList(counsltationPayload);
      const data: any = await response;
      setRowData(data);
    } catch (error: any) {
      setSnackbarMessage(error?.response?.data?.message || 'Server Error');
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    fetchOwnerList();
  }, []);

  const filteredOwnerList = useMemo(() => {
    return rowData.filter((data: any) => {
      const matchesSearch = data.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [rowData, searchTerm]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  const paginatedRowData = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredOwnerList.slice(start, start + rowsPerPage);
  }, [filteredOwnerList, page, rowsPerPage]);

  const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = async (row:any) => {
   const list = await fetchPetList(row.petOwnerUid);
   const details = await fecthPetDetails(list[1].patientUid)
    if(list.length >0 && details){
      console.log("inside edit")
       console.log(petList)
       setIsEditClicked(true);
    }
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

   const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
    {!isEditClicked && (
    <Container>
      <Typography variant="caption" color="textSecondary" mb={2} display="block">
        *Pet Owner will be collected at confirmation of encounter consultation data {paginatedRowData.length}
      </Typography>
      
      <Box 
        sx={{ 
          p: 1, 
          mb: 3, 
          bgcolor: 'rgba(23, 74, 124, 0.02)', 
          border: '1px solid rgba(23, 74, 124, 0.08)',
          display: 'flex', 
          gap: 3, 
          flexWrap: 'wrap', 
          alignItems: 'center',
          pl: 4
        }}
      >
             
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        label="Search by Email"
        sx={{ 
          maxWidth: 280,
          '& .MuiOutlinedInput-root': {
              bgcolor: 'white',
              borderRadius: 2,
              '& fieldset': {
                borderColor: 'rgba(23, 74, 124, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: '#174a7c',
              },
              '&.Mui-focused fieldset': {
                 borderColor: '#174a7c',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#174a7c',
                fontWeight: 500,
              },
        }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
    </Box>
    <TableContainer component={Paper} className={styles.tableWrapper}>
        <Table size="small" >
          <TableHead>
            <TableRow>
              <TableCell>
                First Name
              </TableCell>
              <TableCell>
                Last Name
              </TableCell>
              <TableCell>
                Phone No
              </TableCell>
              <TableCell>
                Email
              </TableCell>
              <TableCell>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRowData
              .map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.firstName}</TableCell>
                  <TableCell>{row?.lastName}</TableCell>
                  <TableCell>{row?.contactNo}</TableCell>
                  <TableCell>{row?.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditClick(row)}
                      sx={{
                        mr:1
                      }}
                    >
                      Edit
                    </Button>
                   
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>

    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={filteredOwnerList.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </TableContainer>  
    <Message 
        openSnackbar={openSnackbar} 
        handleCloseSnackbar={handleCloseSnackbar} 
        snackbarSeverity={snackbarSeverity} 
        snackbarMessage={snackbarMessage} 
      />
    </Container>
    )}
    { isEditClicked && (
       <PatientDetails dropDownList={petList} petList={petDetails} isEditClick={setIsEditClicked}/>
    ) }
   
    </>
  );
};

export default VetConnectManagePatient;
