import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import TableHeaderCell from "./TableHeaderCell";
import { FetchStatus, SortDirection, TableColumn } from "../../lib/constants/utilsConstants";
import TablePagination from "@mui/material/TablePagination";

interface MuiTableProps {
  columns: TableColumn[];
  rows: any[];
  status: FetchStatus;
  sort?: { sortBy: string; sortDirection: SortDirection } | null;
  onSort?: (sortBy: string, sortDirection: SortDirection) => void;
}

function MuiTable({ columns, rows, status, sort, onSort }: MuiTableProps) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isLoading = status === FetchStatus.LOADING;
  const isSuccess = status === FetchStatus.SUCCESS && rows.length > 0;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          maxHeight: "calc(100vh - 200px)",
        }}
      >
        <Table
          stickyHeader
          sx={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "0 0.75rem",
            "& thead th": {
              padding: "0 1rem",
            },
            "& tbody td": {
              padding: "0.5rem 1rem",
            },
          }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              {columns.map((column: TableColumn) => (
                <TableHeaderCell column={column} key={column.field} sort={sort || null} onSort={onSort} isSortable={column?.isSortable} />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  sx={{ textAlign: "center" }}
                >
                  <Typography variant="body1" sx={{ color: "#696969" }}>
                    Chargement...
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {isSuccess && (
              <>
                {rows.map((row) => (
                  <TableRow key={row.id} sx={{ backgroundColor: "white" }}>
                    {columns.map((column) => (
                      <TableCell key={column.field}>
                        {column.renderCell
                          ? column.renderCell(row)
                          : row[column.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            )}
            {!isLoading && !isSuccess && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  sx={{ textAlign: "center" }}
                >
                  <Typography variant="body1" sx={{ color: "#696969" }}>
                    Aucun client trouvé
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={100}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Lignes par page"
      />
    </Paper>
  );
}

export default MuiTable;
