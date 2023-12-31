import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../services/axios";
import { Box, Button, Grid, Input } from "@mui/material";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { IInvoice } from "../../lib/interfaces/IInvoice";
import {
  selectInvoices,
  selectInvoicesError,
  selectInvoicesStatus,
  selectInvoicesFilters,
  selectInvoicesPagination,
  selectInvoicesSort,
  fetchInvoices,
  setFilters,
  setSort,
  setPagination,
  selectInvoicesStatusFilter,
} from "./invoiceSlice";
import {
  FetchStatus,
  Filter,
  FilterType,
  SortDirection,
  TableColumn,
} from "../../lib/constants/utilsConstants";
import { toast } from "react-toastify";
import PageTitle from "../../components/utils/Typography/PageTitle";
import MuiButton from "../../components/Form/MuiButton";
import {
  InvoiceConstants as IC,
  InvoiceStatus,
} from "../../lib/constants/InvoiceConstants";
import { ColumnType as CT } from "../../lib/constants/utilsConstants";
import StyledLink from "../../components/utils/Typography/StyledLink";
import MuiTable from "../../components/MuiTable/MuiTable";
import {
  formatNumberToEuro,
  formatTimestampToFrenchDate,
  getFiltersOptionsFromColumns,
  getInvoiceStatusColor,
  getInvoiceStatusLabel,
} from "../../utils/utils";
import InvoiceStatusContainer from "../../components/utils/InvoiceStatusContainer";
import { Upload } from "@mui/icons-material";
import UploadInvoicesDialog from "../../components/UploadInvoicesDialog/UploadInvoicesDialog";
import FilterButton from "../../components/Filters/FilterButton";
import StatusFilterButton from "../../components/Filters/StatusFilterButton";

function Invoices() {
  const dispatch: ThunkDispatch<any, void, any> = useDispatch();
  const invoices: IInvoice[] = useSelector(selectInvoices);
  const invoicesStatus: FetchStatus = useSelector(selectInvoicesStatus);
  const error = useSelector(selectInvoicesError);
  const filters = useSelector(selectInvoicesFilters);
  const pagination = useSelector(selectInvoicesPagination);
  const sort = useSelector(selectInvoicesSort);
  const invoiceStatusFilter = useSelector(selectInvoicesStatusFilter)

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const invoicesColumns: TableColumn[] = useMemo(
    () => [
      {
        field: IC.INVOICE_NUMBER,
        label: "Numéro",
        columnType: CT.NUMBER,
        filterOperators: [FilterType.EQUALS, FilterType.MIN, FilterType.MAX],
        isSortable: true,
      },
      {
        field: IC.INVOICE_CREATONDATE,
        label: "Date de facture",
        columnType: CT.DATE,
        filterOperators: [FilterType.EQUALS, FilterType.MIN, FilterType.MAX],
        isSortable: true,
        renderCell: (row: IInvoice) => {
          return (
            <Box>
              {row[IC.INVOICE_CREATONDATE] &&
                formatTimestampToFrenchDate(+row[IC.INVOICE_CREATONDATE])}
            </Box>
          );
        },
      },
      {
        field: IC.INVOICE_STARTPERIOD,
        label: "Début de période",
        columnType: CT.DATE,
        filterOperators: [FilterType.EQUALS, FilterType.MIN, FilterType.MAX],
        isSortable: true,
        renderCell: (row: IInvoice) => {
          return (
            <Box>
              {row[IC.INVOICE_STARTPERIOD] &&
                formatTimestampToFrenchDate(+row[IC.INVOICE_STARTPERIOD])}
            </Box>
          );
        },
      },
      {
        field: IC.INVOICE_ENDPERIOD,
        label: "Fin de période",
        columnType: CT.DATE,
        filterOperators: [FilterType.EQUALS, FilterType.MIN, FilterType.MAX],
        isSortable: true,
        renderCell: (row: IInvoice) => {
          return (
            <Box>
              {row[IC.INVOICE_ENDPERIOD] &&
                formatTimestampToFrenchDate(+row[IC.INVOICE_ENDPERIOD])}
            </Box>
          );
        },
      },
      {
        field: IC.INVOICE_CLIENT,
        label: "Client",
        columnType: CT.TEXT,
        filterOperators: [
          FilterType.EQUALS,
          FilterType.CONTAINS,
          FilterType.STARTS_WITH,
          FilterType.ENDS_WITH,
        ],
        isSortable: true,
        renderCell: (row: IInvoice) => {
          return (
            <StyledLink to={`/client/${row?.client?.id}`}>
              {row.client.name}
            </StyledLink>
          );
        },
      },
      {
        field: IC.INVOICE_TTCAMOUNT,
        label: "Montant TTC",
        columnType: CT.NUMBER,
        filterOperators: [FilterType.EQUALS, FilterType.MIN, FilterType.MAX],
        isSortable: true,
        renderCell: (row: IInvoice) => {
          return (
            <Box>
              {row[IC.INVOICE_TTCAMOUNT] &&
                formatNumberToEuro(+row[IC.INVOICE_TTCAMOUNT])}
            </Box>
          );
        },
      },
      {
        field: IC.INVOICE_STATUS,
        label: "Statut",
        // columnType: CT.TEXT,
        // filterOperators: [
        //   FilterType.EQUALS,
        //   FilterType.CONTAINS,
        //   FilterType.STARTS_WITH,
        //   FilterType.ENDS_WITH,
        // ],
        isSortable: true,
        renderCell: (row: IInvoice) => {
          return (
            <>
              <InvoiceStatusContainer
                status={getInvoiceStatusLabel(
                  row[IC.INVOICE_STATUS] as InvoiceStatus
                )}
                bgColor={
                  getInvoiceStatusColor(
                    row[IC.INVOICE_STATUS] as InvoiceStatus
                  )[0]
                }
                color={
                  getInvoiceStatusColor(
                    row[IC.INVOICE_STATUS] as InvoiceStatus
                  )[1]
                }
              />
            </>
          );
        },
      },
    ],
    []
  );

  const filtersOptions = useMemo(
    () => getFiltersOptionsFromColumns(invoicesColumns),
    [invoicesColumns]
  );

  const applyFiltersHandler = (filters: Filter[]) => {
    dispatch(setFilters(filters));
  };

  const resetFiltersHandler = () => {
    dispatch(setFilters([]));
  };

  const onSortHandler = (sortBy: string, sortDirection: SortDirection) => {
    console.log(sortBy, sortDirection);
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
      fetchInvoices({
        pageSize: pagination.pageSize,
        pageNumber: pagination.page,
        criteria: filters,
        sort: sort,
        status: invoiceStatusFilter
      })
    );
  }, [dispatch, pagination, filters, sort, invoiceStatusFilter]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axiosInstance.post("/api/invoice/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
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
            <PageTitle title="Mes factures" />
          </Grid>
          <Grid item>
            {/* <Input type="file" onChange={handleFileChange} />
            <Button variant="contained" color="primary" onClick={handleUpload}>
              Upload File
            </Button> */}
            <Button onClick={() => setUploadDialogOpen(true)}>
              Importer des factures
            </Button>
            {/* <MuiButton startIcon={<AddOutlinedIcon />} label="Ajouter un client" color="primary" onClick={() => addClientClickHandler()} /> */}
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
          <Grid item mr={2}>
            <StatusFilterButton
            />
          </Grid>
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
            columns={invoicesColumns}
            rows={invoices}
            status={invoicesStatus}
            sort={sort || null}
            onSort={onSortHandler}
            pagination={pagination}
            onPageChange={onPageChangeHandler}
            onRowsPerPageChange={onRowsPerPageChangeHandler}
          />
        </Grid>
      </Box>
      {uploadDialogOpen && (
        <UploadInvoicesDialog
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
        />
      )}
    </Box>
  );
}

export default Invoices;
