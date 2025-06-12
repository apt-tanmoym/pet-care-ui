import React, { useState } from 'react';
import CommonTable from '../common/table/Table';
import TableLinkButton from '../common/buttons/TableLinkButton';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Box, Table, TableCell, TableHead, TableRow, Typography, TableBody, TextField } from '@mui/material';
import CummonDialog from '../common/CummonDialog';

// Define interface for invoice data
interface Invoice {
  id: number;
  ownerFirstName: string;
  ownerLastName: string;
  petName: string;
  mrn: string;
  encounterDate: string;
  totalDueAmount: number;
}

// Sample data for the table
const initialInvoices: Invoice[] = [
  {
    id: 1,
    ownerFirstName: "John",
    ownerLastName: "Smith",
    petName: "Buddy",
    mrn: "MRN12345",
    encounterDate: "2025-05-01",
    totalDueAmount: 150.0,
  },
  {
    id: 2,
    ownerFirstName: "Emma",
    ownerLastName: "Johnson",
    petName: "Luna",
    mrn: "MRN67890",
    encounterDate: "2025-05-10",
    totalDueAmount: 200.0,
  },
  {
    id: 3,
    ownerFirstName: "Michael",
    ownerLastName: "Brown",
    petName: "Max",
    mrn: "MRN54321",
    encounterDate: "2025-05-15",
    totalDueAmount: 175.0,
  },
];

// Props for the GenerateInvoice component
interface GenerateInvoiceProps {
  onDataUpdate?: (invoices: Invoice[]) => void;
}

const GenerateInvoice: React.FC<GenerateInvoiceProps> = ({ onDataUpdate }) => {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [viewData, setViewData] = useState<Invoice | null>(null);
  const [invoiceDate, setInvoiceDate] = useState<string>("2025-06-09");
  const [quantity, setQuantity] = useState<number>(1); // Default quantity
  const [revisedValuePerUnit, setRevisedValuePerUnit] = useState<number>(0); // Default revised value

  React.useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate(invoices);
    }
  }, [invoices, onDataUpdate]);

  const colHeaders = [
    { id: 'ownerFirstName', label: 'Owner First Name' },
    { id: 'ownerLastName', label: 'Owner Last Name' },
    { id: 'petName', label: 'Pet Name' },
    { id: 'mrn', label: 'MRN' },
    { id: 'encounterDate', label: 'Encounter Date' },
    { id: 'totalDueAmount', label: 'Total Due Amount' },
    { id: 'action', label: 'Action' },
  ];

  const handleGenerateClick = (invoice: Invoice) => {
    setViewData(invoice);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setViewData(null);
  };

  const handleGenerate = () => {
    window.print();
    handleClose();
  };

  const renderInvoiceDetails = (invoice: Invoice) => {
    const valuePerUnit = 500.00; // Fixed as per the image
    const currentPaymentPercentage = 100.00; // Fixed as per the image
    const paymentDue = (quantity * valuePerUnit * currentPaymentPercentage) / 100;
    const totalValue = quantity * (valuePerUnit - revisedValuePerUnit);

    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          INVOICE DETAILS
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
          <Typography sx={{ flex: 1, fontWeight: 'bold' }}>
            Patient Name: <span style={{ fontWeight: 'normal' }}>{invoice.petName}</span>
          </Typography>
          <Typography sx={{ flex: 1, fontWeight: 'bold', textAlign: 'center' }}>
            Physician Name: <span style={{ fontWeight: 'normal' }}>Dr. Jagdeep Chowdhury</span>
          </Typography>
          <Typography sx={{ flex: 1, fontWeight: 'bold', textAlign: 'right' }}>
            Encounter Date: <span style={{ fontWeight: 'normal' }}>{invoice.encounterDate}</span>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2, alignItems: "center" }}>
          <Typography sx={{ mr: 1, fontWeight: 'bold' }}>Invoice Date:</Typography>
          <TextField
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            size="small"
            sx={{ width: 150 }}
          />
        </Box>
        <Table sx={{ mb: 2, borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '8px' }}>ITEM</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>QUANTITY</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>VALUE PER UNIT</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>CURRENT PAYMENT %</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>PAYMENT DUE</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>REVISED VALUE PER UNIT</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>TOTAL VALUE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ border: '1px solid #ccc', padding: '8px' }}>Consultation (Dr. Jagdeep Chowdhury)</TableCell>
              <TableCell sx={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  size="small"
                  sx={{ width: 80 }}
                  inputProps={{ min: 1 }}
                />
              </TableCell>
              <TableCell sx={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{valuePerUnit.toFixed(2)}</TableCell>
              <TableCell sx={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{currentPaymentPercentage.toFixed(2)}</TableCell>
              <TableCell sx={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{paymentDue.toFixed(2)}</TableCell>
              <TableCell sx={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                <TextField
                  type="number"
                  value={revisedValuePerUnit}
                  onChange={(e) => setRevisedValuePerUnit(Number(e.target.value))}
                  size="small"
                  sx={{ width: 80 }}
                  inputProps={{ min: 0 }}
                />
              </TableCell>
              <TableCell sx={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{totalValue.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box sx={{ display: "flex", justifyContent: "flex-end", flexDirection: "column", alignItems: "flex-end", mt: 2 }}>
          <Typography sx={{ fontWeight: 'bold' }}>Gross Amount: <span style={{ fontWeight: 'normal' }}>{(quantity * valuePerUnit).toFixed(2)}</span></Typography>
          <Typography sx={{ fontWeight: 'bold' }}>Discount: <span style={{ fontWeight: 'normal' }}>0.00</span></Typography>
          <Typography sx={{ fontWeight: 'bold' }}>Net Amount: <span style={{ fontWeight: 'normal' }}>{totalValue.toFixed(2)}</span></Typography>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <CommonTable
        heading="Generate Invoice"
        showSearch={true}
        showAddButton={false}
        showFilterButton={false}
        colHeaders={colHeaders}
        rowData={invoices.map(invoice => ({
          ...invoice,
          action: (
            <TableLinkButton
              text="Generate Invoice"
              icon={<ReceiptLongIcon />}
              color="primary"
              onClick={() => handleGenerateClick(invoice)}
            />
          ),
        }))}
        rowsPerPageOptions={[10, 25, 50]}
      />

      {openDialog && viewData && (
        <CummonDialog
          open={openDialog}
          title="Invoice Details"
          onClose={handleClose}
          onSubmit={handleGenerate}
          maxWidth="lg"
          submitLabel="SUBMIT"
          cancelLabel="CANCEL"
          showActions={true}
          hideDefaultButtons={false}
          aria-label="generate-invoice-details-dialog"
        >
          {renderInvoiceDetails(viewData)}
        </CummonDialog>
      )}
    </>
  );
};

export default GenerateInvoice;