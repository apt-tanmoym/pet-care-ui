import React, { useState } from "react";
import { Box, TextField, Grid } from "@mui/material";
import { styled } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import CommonTable from "../common/table/Table";
import TableLinkButton from "../common/buttons/TableLinkButton";

interface RowData {
  doctorName: string;
  fees: string;
  action: any;
}

const Container = styled(Box)(({ theme }) => ({
  padding: theme?.spacing?.(2) || "16px",
  [theme?.breakpoints?.down("sm") || "600px"]: {
    padding: theme?.spacing?.(1) || "8px",
  },
}));

const ConsultationFees: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [newFee, setNewFee] = useState("");
  const [rowData, setRowData] = useState<RowData[]>([
    {
      doctorName: "abc",
      fees: "₹150",
      action: null,
    },
  ]);

  const handleOpenDialog = (row: RowData) => {
    setSelectedRow(row);
    setNewFee("");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedRow(null);
    setNewFee("");
    setDialogOpen(false);
  };

  const colHeaders = [
    { id: "doctorName", label: "Doctor Name" },
    { id: "fees", label: "Fees" },
    { id: "action", label: "Action" },
  ];

  const updatedRowData = rowData.map((row) => ({
    ...row,
    action: (
      <>
        <TableLinkButton
          text="Update"
          icon={<EditIcon />}
          onClick={() => handleOpenDialog(row)}
        />
      </>
    ),
  }));

  return (
    <Container>
      <CommonTable
        heading=""
        showSearch={false}
        showAddButton={false}
        showFilterButton={false}
        colHeaders={colHeaders}
        rowData={updatedRowData}
        rowsPerPageOptions={[5, 10, 25]}
        openDialog={dialogOpen}
        handleClose={handleCloseDialog}
        onAddButtonClick={() => handleOpenDialog({ doctorName: "", fees: "", action: null })}
        dialogWidth="sm"
        title={selectedRow ? "Update Consultation Fee" : "Add Consultation Fee"}
      >
        {selectedRow ? (
          <Box p={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Current Fee"
                  value={selectedRow.fees}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="New Fee"
                  value={newFee}
                  onChange={(e) => setNewFee(e.target.value)}
                  fullWidth
                  type="number"
                  inputProps={{ min: 0, step: 1 }}
                  placeholder="Enter new fee"
                />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box p={2}>
            <p>Placeholder form for adding a consultation fee.</p>
          </Box>
        )}
      </CommonTable>
    </Container>
  );
};

export default ConsultationFees;