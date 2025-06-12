"use client";

import React, { useState, useMemo, useEffect } from "react";

import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  Grid
} from "@mui/material";

import styles from './style.module.scss';

import EditIcon from "@mui/icons-material/Edit";

import EditFacility from "../EditFacility";
import { FaclityServiceResponse } from "@/interfaces/facilityInterface";
import CummonDialog from "@/components/common/CummonDialog";



type FacilityTableProps = {
  facilities: FaclityServiceResponse[];
  onEdit?: (facility: FaclityServiceResponse) => void;
};

function FacilityList({ facilities }: FacilityTableProps) {
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<FaclityServiceResponse | null>(
    null
  );

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredFacilities = useMemo(() => {
    return facilities.filter((facility: any) => {
      const matchesSearch = facility.facilityName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
  
      const matchesStatus =
        !statusFilter ||
        facility.status?.toLowerCase() === statusFilter.toLowerCase();
  
      return matchesSearch && matchesStatus;
    });
  }, [facilities, searchTerm, statusFilter]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, statusFilter]);

  const paginatedFacilities = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredFacilities.slice(start, start + rowsPerPage);
  }, [filteredFacilities, page, rowsPerPage]);


  const handleEditClick = (facility: FaclityServiceResponse) => {
    setSelectedFacility(facility);
    setOpenEdit(true);
  };

  // Close modal
  const handleClose = () => {
    setOpenEdit(false);
    setSelectedFacility(null);
  };

  return (
    <Box p={2}>
      <Typography variant="h6" mb={2}>
        Maintain Facilities
      </Typography>

      {/* Search and Filter */}
      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={12} sm={6} md={4} mx="auto">
          <TextField
            fullWidth
            variant="outlined"
            label="Search by Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Select
            fullWidth
            displayEmpty
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </Grid>
        <Grid
          item
          xs={12}
          md={5}
          display="flex"
          justifyContent="flex-end"
          gap={1}
        >
         
          <Button 
            variant="contained" 
            color="primary"
          >
            Add New Facility
          </Button>
        </Grid>
      </Grid>

      {/* Table */}
      <TableContainer component={Paper} className={styles.tableWrapper}>
        <Table size="small" >
          <TableHead>
            <TableRow>
              <TableCell>
                Name
              </TableCell>
              <TableCell>
                Color
              </TableCell>
              <TableCell>
                Address
              </TableCell>
              <TableCell>
                Contact Person
              </TableCell>
              <TableCell>
                Pin No.
              </TableCell>
              <TableCell>
                Email
              </TableCell>
              <TableCell>
                Phone
              </TableCell>
              <TableCell>
                Current Plan
              </TableCell>
              <TableCell>
                Status
              </TableCell>
              <TableCell>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedFacilities
              .map((facility, index) => (
                <TableRow key={index}>
                  <TableCell>{facility.facilityName}</TableCell>
                  <TableCell>{facility?.color}</TableCell>
                  <TableCell>{facility.address1}</TableCell>
                  <TableCell>{facility.contactPersonName}</TableCell>
                  <TableCell>{facility.pin}</TableCell>
                  <TableCell>{facility.firstContactEmail}</TableCell>
                  <TableCell>{facility.firstContactNo}</TableCell>
                  <TableCell>{facility.facilityType}</TableCell>
                  <TableCell>{facility.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditClick(facility)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredFacilities.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* EditFacility Dialog */}
      <CummonDialog open={openEdit} onClose={handleClose} onSubmit={()=>{}} maxWidth="md" title="Edit Facility" >
        {selectedFacility && <EditFacility facility={selectedFacility} />}
      </CummonDialog>
      
    </Box>
  );
}

export default FacilityList;
