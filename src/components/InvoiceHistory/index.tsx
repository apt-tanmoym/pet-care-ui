import React, { useState } from "react";
import CommonTable from "../common/table/Table";
import TableLinkButton from "../common/buttons/TableLinkButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import CummonDialog from "../common/CummonDialog";

// Define interface for invoice items
interface InvoiceItem {
  item: string;
  quantity: number;
  valuePerUnit: number;
  currentPayment: number;
  paymentDue: number;
  totalValue: number;
}

// Define interface for invoice data
interface Invoice {
  id: number;
  patient: string;
  mrn: string;
  encounterDate: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceAmount: number;
  physician: string;
  items: InvoiceItem[];
  grossAmount: number;
  netAmount: number;
  collectedAmount: number;
  dueAmount: number;
}

// Sample data for the table
const initialInvoices: Invoice[] = [
  {
    id: 1,
    patient: "Test of Test",
    mrn: "MRN12345",
    encounterDate: "2025-05-30",
    invoiceNumber: "APT/01/001",
    invoiceDate: "2025-05-30",
    invoiceAmount: 700.0,
    physician: "Dr. Jagdeep Chowdhury",
    items: [
      {
        item: "Registration",
        quantity: 1,
        valuePerUnit: 100.0,
        currentPayment: 100.0,
        paymentDue: 100.0,
        totalValue: 100.0,
      },
      {
        item: "Consultation (Dr. Jagdeep Chowdhury)",
        quantity: 1,
        valuePerUnit: 500.0,
        currentPayment: 100.0,
        paymentDue: 600.0,
        totalValue: 600.0,
      },
    ],
    grossAmount: 700.0,
    netAmount: 700.0,
    collectedAmount: 700.0,
    dueAmount: 0.0,
  },
  {
    id: 2,
    patient: "Emma Johnson",
    mrn: "MRN67890",
    encounterDate: "2025-05-10",
    invoiceNumber: "INV002",
    invoiceDate: "2025-05-11",
    invoiceAmount: 200.0,
    physician: "Dr. Smith",
    items: [
      {
        item: "Consultation (Dr. Smith)",
        quantity: 1,
        valuePerUnit: 200.0,
        currentPayment: 200.0,
        paymentDue: 200.0,
        totalValue: 200.0,
      },
    ],
    grossAmount: 200.0,
    netAmount: 200.0,
    collectedAmount: 200.0,
    dueAmount: 0.0,
  },
];

// Props for the InvoiceHistory component
interface InvoiceHistoryProps {
  onDataUpdate?: (invoices: Invoice[]) => void;
}

const InvoiceHistory: React.FC<InvoiceHistoryProps> = ({ onDataUpdate }) => {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [openPrintDialog, setOpenPrintDialog] = useState<boolean>(false);
  const [openViewDialog, setOpenViewDialog] = useState<boolean>(false);
  const [viewData, setViewData] = useState<Invoice | null>(null);
  const [viewInvoiceData, setViewInvoiceData] = useState<Invoice | null>(null);

  // Notify parent of data changes
  React.useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate(invoices);
    }
  }, [invoices, onDataUpdate]);

  const colHeaders = [
    { id: "patient", label: "Patient" },
    { id: "mrn", label: "MRN" },
    { id: "encounterDate", label: "Encounter Date" },
    { id: "invoiceNumber", label: "Invoice Number" },
    { id: "invoiceDate", label: "Invoice Date" },
    { id: "invoiceAmount", label: "Invoice Amount" },
    { id: "action", label: "Action" },
  ];

  const handlePrintClick = (invoice: Invoice) => {
    setViewData(invoice);
    setOpenPrintDialog(true);
  };

  const handleViewClick = (invoice: Invoice) => {
    setViewInvoiceData(invoice);
    setOpenViewDialog(true);
  };

  const handleClosePrint = () => {
    setOpenPrintDialog(false);
    setViewData(null);
  };

  const handleCloseView = () => {
    setOpenViewDialog(false);
    setViewInvoiceData(null);
  };

  const renderInvoiceDetails = (invoice: Invoice) => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" align="center" gutterBottom>
        INVOICE DETAILS
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography>Patient Name: {invoice.patient}</Typography>
        <Typography>Physician Name: {invoice.physician}</Typography>
        <Typography>Encounter Date: {invoice.encounterDate}</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography>Invoice Number: {invoice.invoiceNumber}</Typography>
        <Typography>Invoice Date: {invoice.invoiceDate}</Typography>
      </Box>
      <Table sx={{ mb: 2 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
            <TableCell>ITEM</TableCell>
            <TableCell align="right">QUANTITY</TableCell>
            <TableCell align="right">VALUE PER UNIT</TableCell>
            <TableCell align="right">CURRENT PAYMENT</TableCell>
            <TableCell align="right">PAYMENT DUE</TableCell>
            <TableCell align="right">TOTAL VALUE</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoice.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.item}</TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">{item.valuePerUnit.toFixed(2)}</TableCell>
              <TableCell align="right">{item.currentPayment.toFixed(2)}</TableCell>
              <TableCell align="right">{item.paymentDue.toFixed(2)}</TableCell>
              <TableCell align="right">{item.totalValue.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Box>
          <Typography>Gross Amount: {invoice.grossAmount.toFixed(2)}</Typography>
          <Typography>Net Amount: {invoice.netAmount.toFixed(2)}</Typography>
          <Typography>Collected Amount: {invoice.collectedAmount.toFixed(2)}</Typography>
          <Typography>Due Amount: {invoice.dueAmount.toFixed(2)}</Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <CommonTable
        heading="Invoice History"
        showSearch={true}
        showAddButton={false}
        showFilterButton={false}
        colHeaders={colHeaders}
        rowData={invoices.map((invoice) => ({
          ...invoice,
          action: (
            <Box sx={{ display: "flex", gap: 1 }}>
              <TableLinkButton
                text="Print Invoice"
                icon={<ReceiptLongIcon />}
                color="primary"
                onClick={() => handlePrintClick(invoice)}
              />
              <TableLinkButton
                text="View Invoice"
                icon={<VisibilityIcon />}
                color="secondary"
                onClick={() => handleViewClick(invoice)}
              />
            </Box>
          ),
        }))}
        rowsPerPageOptions={[10, 25, 50]}
      />

      {/* Print Invoice Dialog */}
      {openPrintDialog && viewData && (
        <CummonDialog
          open={openPrintDialog}
          title="Invoice Details"
          onClose={handleClosePrint}
          onSubmit={() => {
            window.print();
          }}
          maxWidth="lg"
          submitLabel="Print"
          cancelLabel="Cancel"
          showActions={true}
          hideDefaultButtons={false}
          aria-label="invoice-details-dialog"
        >
          {renderInvoiceDetails(viewData)}
        </CummonDialog>
      )}

      {/* View Invoice Dialog */}
      {openViewDialog && viewInvoiceData && (
        <CummonDialog
          open={openViewDialog}
          title="View Invoice Details"
          onClose={handleCloseView}
          onSubmit={handleCloseView}
          maxWidth="lg"
          submitLabel="Submit"
          cancelLabel="Cancel"
          showActions={true}
          hideDefaultButtons={false}
          aria-label="view-invoice-details-dialog"
        >
          {renderInvoiceDetails(viewInvoiceData)}
        </CummonDialog>
      )}
    </>
  );
};

export default InvoiceHistory;