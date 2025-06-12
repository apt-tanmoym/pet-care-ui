import React, { useState } from "react";
import CommonTable from "../common/table/Table";
import TableLinkButton from "../common/buttons/TableLinkButton";
import PaymentIcon from "@mui/icons-material/Payment";
import { Box, Table, TableCell, TableHead, TableRow, TableBody, Typography } from "@mui/material";
import CummonDialog from "../common/CummonDialog";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Collect from "./collect";

// Define interface for payment data
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

interface PaymentCollectionProps {
  onDataUpdate?: (payments: Payment[]) => void;
}

const PaymentCollection: React.FC<PaymentCollectionProps> = ({ onDataUpdate }) => {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 1,
      patient: "John Smith",
      mrn: "MRN12345",
      encounterDate: "2025-05-01",
      invoiceNumber: "APT/01/002",
      invoiceDate: "2025-06-09",
      invoiceAmount: 500.0,
      dueAmount: 500.0,
      paymentStatus: "Pending",
    },
    {
      id: 2,
      patient: "Emma Johnson",
      mrn: "MRN67890",
      encounterDate: "2025-05-10",
      invoiceNumber: "INV002",
      invoiceDate: "2025-05-11",
      invoiceAmount: 200.0,
      dueAmount: 75.0,
      paymentStatus: "Pending",
    },
  ]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [viewData, setViewData] = useState<Payment | null>(null);
  const [openCollectDialog, setOpenCollectDialog] = useState<boolean>(false);
  const [collectData, setCollectData] = useState<Payment | null>(null);

  React.useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate(payments);
    }
  }, [payments, onDataUpdate]);

  const colHeaders = [
    { id: "patient", label: "Patient" },
    { id: "mrn", label: "MRN" },
    { id: "encounterDate", label: "Encounter Date" },
    { id: "invoiceNumber", label: "Invoice Number" },
    { id: "invoiceDate", label: "Invoice Date" },
    { id: "invoiceAmount", label: "Invoice Amount" },
    { id: "dueAmount", label: "Due Amount" },
    { id: "paymentStatus", label: "Payment Status" },
    { id: "action", label: "Action" },
  ];

  const handleViewClick = (payment: Payment) => {
    setViewData(payment);
    setOpenDialog(true);
  };

  const handleCollectClick = (payment: Payment) => {
    setCollectData(payment);
    setOpenCollectDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setViewData(null);
    setOpenCollectDialog(false);
    setCollectData(null);
  };

  const handleCollectSubmit = () => {
    if (collectData) {
      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === collectData.id
            ? { ...payment, dueAmount: 0, paymentStatus: "Already Paid" }
            : payment
        )
      );
    }
    handleClose();
  };

  const renderPaymentDetails = (payment: Payment) => (
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
          <Typography>{payment.invoiceDate}</Typography>
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
      </Box>
    </Box>
  );

  return (
    <>
      <CommonTable
        heading="Payment Collection"
        showSearch={true}
        showAddButton={false}
        showFilterButton={false}
        colHeaders={colHeaders}
        rowData={payments.map((payment) => ({
          ...payment,
          action: (
            <Box sx={{ display: "flex", gap: 1 }}>
              <TableLinkButton
                text="Print Invoice"
                icon={<ReceiptLongIcon />}
                color="primary"
                onClick={() => handleViewClick(payment)}
              />
              <TableLinkButton
                text="Collect Payment"
                icon={<PaymentIcon />}
                color="secondary"
                onClick={() => handleCollectClick(payment)}
              />
            </Box>
          ),
        }))}
        rowsPerPageOptions={[10, 25, 50]}
      />

      {/* Print Invoice Dialog */}
      {openDialog && viewData && (
        <CummonDialog
          open={openDialog}
          title="Payment Details"
          onClose={handleClose}
          onSubmit={() => window.print()}
          maxWidth="lg"
          submitLabel="Print"
          cancelLabel="Cancel"
          showActions={true}
          hideDefaultButtons={false}
          aria-label="payment-details-dialog"
        >
          {renderPaymentDetails(viewData)}
        </CummonDialog>
      )}

      {/* Collect Payment Dialog */}
      {openCollectDialog && collectData && (
        <CummonDialog
          open={openCollectDialog}
          title="Collect Payment"
          onClose={handleClose}
          onSubmit={handleCollectSubmit}
          maxWidth="lg"
          submitLabel="Submit"
          cancelLabel="Close"
          showActions={true}
          hideDefaultButtons={false}
          aria-label="collect-payment-dialog"
        >
          <Collect payment={collectData} onSubmit={handleCollectSubmit} />
        </CummonDialog>
      )}
    </>
  );
};

export default PaymentCollection;