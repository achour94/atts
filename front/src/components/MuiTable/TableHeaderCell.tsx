import React from "react";
import { Box, TableCell, Typography } from "@mui/material";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import { SortDirection, TableColumn } from "../../lib/constants/utilsConstants";

interface TableHeaderCellProps {
  column: TableColumn;
  sort: { sortBy: string; sortDirection: SortDirection } | null;
  onSort?: (sortBy: string, sortDirection: SortDirection) => void;
  isSortable?: boolean;
}

const TableHeaderCell = ({ column, sort, onSort, isSortable }: TableHeaderCellProps) => {

  const columnClickHandler = () => {
    console.log('columnClickHandler')
    if (column?.field && isSortable && onSort) {
      if (sort?.sortBy === column?.field && sort?.sortDirection === SortDirection.ASC) {
        onSort(column?.field, SortDirection.DESC)
      } else {
        onSort(column?.field, SortDirection.ASC)
      }
    }
  }

  const getSortDirectionContent = () => {
    if (sort?.sortBy === column?.field && sort?.sortDirection === SortDirection.ASC) {
      return <ArrowDropUpOutlinedIcon
        sx={{ color: "text.secondary", fontSize: "1rem" }}
      />
    } else if (sort?.sortBy === column?.field && sort?.sortDirection === SortDirection.DESC) {
      return <ArrowDropDownOutlinedIcon
        sx={{ color: "text.secondary", fontSize: "1rem" }}
      />
    } else {
      return null
    }
  }

  return (
    <TableCell  >
      {column?.renderHeader ? (
        column?.renderHeader()
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", cursor: isSortable ? 'pointer' : 'not-allowed' }} onClick={columnClickHandler}>
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 500,
              fontStyle: "normal",
              color: "text.secondary",
              mr: 1,
            }}
          >
            {column?.label || ''}
          </Typography>
          {
            getSortDirectionContent()
          }
        </Box>
      )}
    </TableCell>
  );
};

export default TableHeaderCell;
