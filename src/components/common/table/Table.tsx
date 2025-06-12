import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  TablePagination,
  Box,
} from "@mui/material";
import CummonDialog from "../CummonDialog";
import styles from "./styles.module.scss";

interface Filter {
  name: string;
  options: string[];
  value: string;
}

interface TableColumn {
  id: string;
  label: string;
}

interface TableRowData {
  [key: string]: any;
}

interface CommonTableProps {
  heading: string;
  showSearch?: boolean;
  showAddButton?: boolean;
  showFilterButton?: boolean;
  showEditButton?: boolean;
  addButtonLabel?: string;
  filterButtonLabel?: string;
  editButtonLabel?: string;
  filters?: Filter[];
  colHeaders: TableColumn[];
  rowData: TableRowData[];
  rowsPerPageOptions?: number[];
  openDialog?: boolean;
  handleClose?: () => void;
  onAddButtonClick?: () => void;
  dialogWidth?: any;
  title?: string;
  children?: any;
  hideDefaultButtons?: boolean; // Added prop to control dialog buttons
}

const CommonTable: React.FC<CommonTableProps> = ({
  heading,
  showSearch = true,
  showAddButton = true,
  showFilterButton = true,
  addButtonLabel = "Add New",
  filterButtonLabel = "Filter",
  filters = [],
  colHeaders,
  rowData,
  rowsPerPageOptions = [5, 10, 25],
  openDialog = false,
  dialogWidth = "sm",
  title = "",
  handleClose,
  onAddButtonClick,
  children,
  hideDefaultButtons = false, // Default to false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilters, setCurrentFilters] = useState<{
    [key: string]: string;
  }>({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const handleFilterChange = (filterName: string, value: string) => {
    setCurrentFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const filteredRows = rowData.filter((row) => {
    const searchMatch = Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filterMatch = Object.entries(currentFilters).every(
      ([key, val]) => val === "" || val === "All" || row[key] === val
    );
    return searchMatch && filterMatch;
  });

  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {heading}
        </Typography>

        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center" mb={2}>
          {showSearch && (
            <TextField
              label="Search by Name"
              variant="outlined"
              size="small"
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 250 }}
            />
          )}

          {filters.map((filter) => (
            <Select
              key={filter.name}
              value={currentFilters[filter.name] || ""}
              onChange={(e) => handleFilterChange(filter.name, e.target.value)}
              displayEmpty
              size="small"
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="">All {filter.name}</MenuItem>
              {filter.options.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          ))}

          {showFilterButton && (
            <Button variant="contained" color="primary" sx={{ ml: "auto" }}>
              {filterButtonLabel}
            </Button>
          )}

          {showAddButton && (
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: "auto" }}
              onClick={onAddButtonClick}
            >
              {addButtonLabel}
            </Button>
          )}
        </Box>

        <TableContainer component={Paper} className={styles.tableWrapper}>
          <Table>
            <TableHead >
              <TableRow>
                {colHeaders.map((col) => (
                  <TableCell
                    key={col.id}
                    
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.length > 0 ? (
                paginatedRows.map((row, idx) => (
                  <TableRow key={idx}>
                    {colHeaders.map((col) => (
                      <TableCell
                        key={col.id}
                        
                      >
                        {col.id === "image" ? (
                          <img src={row[col.id]} alt="row-img" width="50" />
                        ) : (
                          row[col.id]
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={colHeaders.length} align="center">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
       
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
           </TableContainer>
      
      <CummonDialog
        open={openDialog}
          onClose={handleClose || (() => {})}
        onSubmit={() => {}}
        maxWidth={dialogWidth}
        title={title}
        hideDefaultButtons={hideDefaultButtons} 
      >
        {children}
      </CummonDialog>
    </>
  );
};

export default CommonTable;