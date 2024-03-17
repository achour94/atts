import { Box, Grid } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import PageTitle from "../../components/utils/Typography/PageTitle";
import {
  FetchStatus,
  Filter,
  FilterType,
  SortDirection,
  TableColumn,
} from "../../lib/constants/utilsConstants";
import { ColumnType as CT } from "../../lib/constants/utilsConstants";
import { HistoryConstants as HC } from "../../lib/constants/HistoryConstants";
import { IHistory } from "../../lib/interfaces/IHistory";
import {
  formatTimestampToFrenchDate,
  getFiltersOptionsFromColumns,
} from "../../utils/utils";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import {
  HISTORY_API_URL,
  fetchHistory,
  selectError,
  selectFilters,
  selectHistory,
  selectPagination,
  selectSort,
  selectStatus,
  setFilters,
  setPagination,
  setSort,
} from "./historySlice";
import { toast } from "react-toastify";
import FilterButton from "../../components/Filters/FilterButton";
import MuiTable from "../../components/MuiTable/MuiTable";
import axiosInstance from "../../services/axios";
import MuiButton from "../../components/Form/MuiButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationPopup from "../../components/utils/ConfirmationPopup";

function History() {
  const columns: TableColumn[] = useMemo(
    () => [
      {
        field: HC.HISTORY_CREATEDAT,
        label: "Date",
        columnType: CT.DATE,
        filterOperators: [FilterType.EQUALS, FilterType.MIN, FilterType.MAX],
        isSortable: true,
        renderCell: (row: IHistory) => {
          return (
            <Box>
              {row[HC.HISTORY_CREATEDAT] &&
                formatTimestampToFrenchDate(+row[HC.HISTORY_CREATEDAT] * 1000)}
            </Box>
          );
        },
      },
      {
        field: HC.HISTORY_SOURCE,
        label: "Source",
        columnType: CT.TEXT,
        isSortable: true,
        filterOperators: [
          FilterType.EQUALS,
          FilterType.CONTAINS,
          FilterType.STARTS_WITH,
          FilterType.ENDS_WITH,
        ],
      },
      {
        field: HC.HISTORY_LEVEL,
        label: "Niveau",
        columnType: CT.TEXT,
        isSortable: true,
        filterOperators: [
          FilterType.EQUALS,
          FilterType.CONTAINS,
          FilterType.STARTS_WITH,
          FilterType.ENDS_WITH,
        ],
      },
      {
        field: HC.HISTORY_MESSAGE,
        label: "Message",
        columnType: CT.TEXT,
        isSortable: true,
        filterOperators: [
          FilterType.EQUALS,
          FilterType.CONTAINS,
          FilterType.STARTS_WITH,
          FilterType.ENDS_WITH,
        ],
      },
    ],
    []
  );

  const filtersOptions = useMemo(
    () => getFiltersOptionsFromColumns(columns),
    [columns]
  );

  const dispatch: ThunkDispatch<any, void, any> = useDispatch();
  const history: IHistory[] = useSelector(selectHistory);
  const status: FetchStatus = useSelector(selectStatus);
  const error = useSelector(selectError);
  const filters = useSelector(selectFilters);
  const pagination = useSelector(selectPagination);
  const sort = useSelector(selectSort);

  const [openConfirmation, setOpenConfirmation] = useState(false);

  const applyFiltersHandler = (filters: Filter[]) => {
    dispatch(setFilters(filters));
  };

  const resetFiltersHandler = () => {
    dispatch(setFilters([]));
  };

  const onSortHandler = (sortBy: string, sortDirection: SortDirection) => {
    dispatch(setSort({ sortBy, sortDirection }));
  };

  const onRowsPerPageChangeHandler = (rowsPerPage: number) => {
    dispatch(setPagination({ ...pagination, page: 0, pageSize: rowsPerPage }));
  };

  const onPageChangeHandler = (page: number) => {
    dispatch(setPagination({ ...pagination, page }));
  };

  useEffect(() => {
    dispatch(
      fetchHistory({
        pageSize: pagination.pageSize,
        pageNumber: pagination.page,
        criteria: filters,
        sort: sort,
      })
    );
  }, [dispatch, pagination, filters, sort]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const deleteAll = useCallback(() => {
    axiosInstance
      .delete(HISTORY_API_URL)
      .then(() => {
        dispatch(
          fetchHistory({
            pageSize: pagination.pageSize,
            pageNumber: pagination.page,
            criteria: filters,
            sort: sort,
          })
        );
      })
      .catch((error) => {
        toast.error(error);
      });
  }, [dispatch, pagination, filters, sort]);

  const handleDelete = () => {
    setOpenConfirmation(true);
  };

  const handleConfirmDelete = () => {
    deleteAll();
    setOpenConfirmation(false);
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box>
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 7,
          }}
        >
          <Grid item flex={1}>
            <PageTitle title="Historique" />
          </Grid>
          <Grid item>
            <MuiButton
              color="error"
              startIcon={<DeleteIcon />}
              label="Supprimer"
              onClick={handleDelete}
              disabled={history?.length === 0}
            />
          </Grid>
        </Grid>
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Grid item>
            <FilterButton
              filters={filters}
              applyFilters={applyFiltersHandler}
              resetFilters={resetFiltersHandler}
              filtersOptions={filtersOptions}
            />
          </Grid>
        </Grid>
        <Grid mt={2}>
          <MuiTable
            columns={columns}
            rows={history}
            status={status}
            sort={sort || null}
            onSort={onSortHandler}
            pagination={pagination}
            onPageChange={onPageChangeHandler}
            onRowsPerPageChange={onRowsPerPageChangeHandler}
          />
        </Grid>
      </Box>
      {openConfirmation && (
        <ConfirmationPopup
          open={openConfirmation}
          title="Supprimer l'historique"
          message="Êtes-vous sûr de vouloir supprimer tout l'historique ?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseConfirmation}
        />
      )}
    </Box>
  );
}

export default History;
