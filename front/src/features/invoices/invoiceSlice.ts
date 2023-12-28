import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios";
import { IInvoice } from "../../lib/interfaces/IInvoice";
import {
  FetchStatus,
  Filter,
  Pagination,
  SortDirection,
} from "../../lib/constants/utilsConstants";
import { formatInvoiceData, formatInvoicesData } from "../../utils/utils";
import { InvoiceStatus } from "../../lib/constants/InvoiceConstants";

export const INVOICE_API_URL = "/api/invoice";

interface InvoicesState {
  invoices: IInvoice[];
  status: FetchStatus;
  error: string | null | undefined;
  filters: Filter[];
  pagination: Pagination;
  sort: { sortBy: string; sortDirection: SortDirection } | null;
  statusFilter: InvoiceStatus;
}

interface FetchInvoicesParams {
  pageSize: number;
  pageNumber: number;
  criteria: any[]; // Define the structure of criteria or leave as any
  sort: { sortBy: string; sortDirection: SortDirection } | null;
  status: InvoiceStatus;
}

// Define the initial state with type
const initialState: InvoicesState = {
  invoices: [],
  status: FetchStatus.IDLE,
  error: null,
  filters: [],
  pagination: { page: 0, pageSize: 25, totalElements: 0 },
  sort: null,
  statusFilter: InvoiceStatus.DRAFT,
};

// Async thunk for fetching invoices
export const fetchInvoices = createAsyncThunk(
  "invoice/fetchInvoices",
  async ({ pageSize, pageNumber, criteria, sort, status = InvoiceStatus.DRAFT }: FetchInvoicesParams) => {
    try {
      const mappedCriteria = criteria.map((c) => {
        return {
          column: c.column,
          [c.operator]: c.value,
        };
      });
      const encodedCriteria = encodeURIComponent(
        JSON.stringify(mappedCriteria)
      );
      let url = `${INVOICE_API_URL}?pageSize=${pageSize}&pageNumber=${pageNumber}&criteria=${encodedCriteria}&status=${status}`;
      if (sort) {
        url += `&sortBy=${sort.sortBy}&sortDirection=${sort.sortDirection}`;
      }
      const response = await axiosInstance.get(url);
      return [
        formatInvoicesData(response.data.content),
        response.data.totalElements,
      ];
    } catch (error: any) {
      return error?.response?.data;
    }
  }
);

// Create the slice
export const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInvoices.pending, (state) => {
      state.status = FetchStatus.LOADING;
        state.error = null;
    });
    builder.addCase(fetchInvoices.fulfilled, (state, action) => {
        const invoices = action?.payload && action.payload.length > 0 ? action.payload[0] : [];
        const totalElements = action?.payload && action.payload.length > 0 ? action.payload[1] : 0;
      state.status = FetchStatus.SUCCESS;
      state.invoices = invoices;
      state.pagination.totalElements = totalElements;
    });
    builder.addCase(fetchInvoices.rejected, (state, action) => {
      state.status = FetchStatus.FAILED;
      state.error = action.error.message;
    });
  },
});

// export selectors
export const selectInvoices = (state: any): IInvoice[] => state.invoice.invoices;
export const selectInvoicesStatus = (state: any): FetchStatus => state.invoice.status;
export const selectInvoicesError = (state: any): string | null | undefined => state.invoice.error;
export const selectInvoicesFilters = (state: any): Filter[] => state.invoice.filters;
export const selectInvoicesPagination = (state: any): Pagination => state.invoice.pagination;
export const selectInvoicesSort = (state: any): { sortBy: string; sortDirection: SortDirection } | null => state.invoice.sort;
export const selectInvoicesStatusFilter = (state: any): InvoiceStatus => state.invoice.statusFilter;

// Export the actions
export const { setFilters, setPagination, setSort, setStatusFilter } = invoiceSlice.actions;

// Export the reducer
export default invoiceSlice.reducer;

