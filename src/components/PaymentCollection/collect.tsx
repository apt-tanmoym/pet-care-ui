import React, { useState } from 'react';
import { Box, Table, TableCell, TableHead, TableRow, Typography, TableBody, TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

// Define interface for payment data (same as in PaymentCollection)
interface Payment {
  id: number;
  patient: string;
  mrn: string;
  encounterDate: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceAmount: number;
  dueAmount: number;
  paymentStatus: string;
}

interface CollectProps {
  payment: Payment;
  onSubmit: () => void;
}

const Collect: React.FC<CollectProps> = ({ payment, onSubmit }) => {
  const [invoiceDate] = useState<string>(payment.invoiceDate);
  const [openCollectPopup, setOpenCollectPopup] = useState<boolean>(false);
  const [collectionAmount] = useState<number>(payment.dueAmount); // Non-editable, matches due amount
  const [collectionDate, setCollectionDate] = useState<string>("2025-06-10"); // Default to current date
  const [collectionMode, setCollectionMode] = useState<string>("Cash");
  const [cardType, setCardType] = useState<string>("American Express"); // Default card type
  const [cardLastFourDigits, setCardLastFourDigits] = useState<string>("");
  const [referenceNumber, setReferenceNumber] = useState<string>("");

  const handleCollectButtonClick = () => {
    setOpenCollectPopup(true);
  };

  const handleCollectPopupClose = () => {
    setOpenCollectPopup(false);
    setReferenceNumber(""); // Reset reference number on close
    setCardLastFourDigits(""); // Reset card number on close
  };

  const handleCollectPopupSubmit = () => {
    onSubmit(); // Call the parent onSubmit to update payment status
    handleCollectPopupClose();
  };

  const handleCollectionModeChange = (event: SelectChangeEvent<string>) => {
    setCollectionMode(event.target.value);
  };

  const handleCardTypeChange = (event: SelectChangeEvent<string>) => {
    setCardType(event.target.value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
        INVOICE DETAILS
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
        <Typography sx={{ flex: 1, fontWeight: 'bold' }}>
          Patient Name: <span style={{ fontWeight: 'normal' }}>{payment.patient}</span>
        </Typography>
        <Typography sx={{ flex: 1, fontWeight: 'bold', textAlign: 'center' }}>
          Physician Name: <span style={{ fontWeight: 'normal' }}>Dr. Jagdeep Chowdhury</span>
        </Typography>
        <Typography sx={{ flex: 1, fontWeight: 'bold', textAlign: 'right' }}>
          Encounter Date: <span style={{ fontWeight: 'normal' }}>{payment.encounterDate}</span>
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ mr: 1, fontWeight: 'bold' }}>Invoice Number:</Typography>
          <Typography>{payment.invoiceNumber}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ mr: 1, fontWeight: 'bold' }}>Invoice Date:</Typography>
          <Typography>{invoiceDate}</Typography>
        </Box>
      </Box>
      <Table sx={{ mb: 2, borderCollapse: 'collapse' }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '8px' }}>ITEM</TableCell>
            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>QUANTITY</TableCell>
            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>VALUE PER UNIT</TableCell>
            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>CURRENT PAYMENT %</TableCell>
            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>PAYMENT DUE</TableCell>
            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>TOTAL VALUE</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell sx={{ border: '1px solid #ccc', padding: '8px' }}>Consultation (Dr. Jagdeep Chowdhury)</TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>1</TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{(payment.invoiceAmount / 1).toFixed(2)}</TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>100.00</TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{payment.dueAmount.toFixed(2)}</TableCell>
            <TableCell sx={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{payment.invoiceAmount.toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Box sx={{ display: "flex", justifyContent: "flex-end", flexDirection: "column", alignItems: "flex-end", mt: 2 }}>
        <Typography sx={{ fontWeight: 'bold' }}>Gross Amount: <span style={{ fontWeight: 'normal' }}>{payment.invoiceAmount.toFixed(2)}</span></Typography>
        <Typography sx={{ fontWeight: 'bold' }}>Discount: <span style={{ fontWeight: 'normal' }}>0.00</span></Typography>
        <Typography sx={{ fontWeight: 'bold' }}>Net Amount: <span style={{ fontWeight: 'normal' }}>{payment.invoiceAmount.toFixed(2)}</span></Typography>
        <Typography sx={{ fontWeight: 'bold' }}>Collected Due Amount: <span style={{ fontWeight: 'normal' }}>{payment.dueAmount.toFixed(2)}</span></Typography>
      </Box>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={handleCollectButtonClick}>
          Collect Payment
        </Button>
      </Box>

      {/* Collect Payment Popup */}
      <Dialog open={openCollectPopup} onClose={handleCollectPopupClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1976d2', color: 'white', textAlign: 'center' }}>
          COLLECTION
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Collection Amount *"
              value={collectionAmount.toFixed(2)}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Collection Date *"
              type="date"
              value={collectionDate}
              onChange={(e) => setCollectionDate(e.target.value)}
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel id="collection-mode-label">Collection Mode *</InputLabel>
              <Select
                labelId="collection-mode-label"
                value={collectionMode}
                onChange={handleCollectionModeChange}
                label="Collection Mode *"
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Card">Card</MenuItem>
                <MenuItem value="Check">Check</MenuItem>
                <MenuItem value="Wallet">Wallet</MenuItem>
              </Select>
            </FormControl>
            {collectionMode === "Card" && (
              <>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="card-type-label">Card Type *</InputLabel>
                  <Select
                    labelId="card-type-label"
                    value={cardType}
                    onChange={handleCardTypeChange}
                    label="Card Type *"
                  >
                    <MenuItem value="American Express">American Express</MenuItem>
                    <MenuItem value="Visa">Visa</MenuItem>
                    <MenuItem value="MasterCard">MasterCard</MenuItem>
                    <MenuItem value="Discover">Discover</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Card No (Last 4 Digit) *"
                  value={cardLastFourDigits}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,4}$/.test(value)) { // Allow only up to 4 digits
                      setCardLastFourDigits(value);
                    }
                  }}
                  variant="outlined"
                  fullWidth
                  inputProps={{ maxLength: 4 }}
                />
              </>
            )}
            <TextField
              label="Reference number"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCollectPopupSubmit} variant="contained" color="primary">
            SUBMIT
          </Button>
          <Button onClick={handleCollectPopupClose} variant="contained" color="primary">
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Collect;