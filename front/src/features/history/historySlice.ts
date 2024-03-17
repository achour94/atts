import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchStatus, Filter, Pagination, SortDirection } from "../../lib/constants/utilsConstants";
import { IHistory } from "../../lib/interfaces/IHistory";
import axiosInstance from "../../services/axios";

export const HISTORY_API_URL = '/api/log';

interface HistoryState {
  history: IHistory[];
  status: FetchStatus;
  error: string | null | undefined;
  filters: Filter[];
  pagination: Pagination;
  sort: { sortBy: string; sortDirection: SortDirection } | null;
}

interface FetchHistoryParams {
  pageSize: number;
  pageNumber: number;
  criteria: any[]; // Define the structure of criteria or leave as any
  sort: { sortBy: string; sortDirection: SortDirection } | null;
}

// Define the initial state with type
const initialState: HistoryState = {
  history: [],
  status: FetchStatus.IDLE,
  error: null,
  filters: [],
  pagination: { page: 0, pageSize: 25, totalElements: 0 },
  sort: null,
};

// Async thunk for fetching history
export const fetchHistory = createAsyncThunk(
  'history/fetchHistory',
  async ({pageSize, pageNumber, criteria, sort}: FetchHistoryParams) => {
    try {
      const mappedCriteria = criteria.map((c) => {
        return {
          column : c.column,
          [c.operator]: c.value
        }
      });
      const encodedCriteria = encodeURIComponent(JSON.stringify(mappedCriteria));
      let url = `${HISTORY_API_URL}?pageSize=${pageSize}&pageNumber=${pageNumber}&criteria=${encodedCriteria}`;
      if (sort) {
        url += `&sortBy=${sort.sortBy}&sortDirection=${sort.sortDirection}`;
      }
      const response = await axiosInstance.get(url);
      return [response.data.content, response.data.totalElements];
    } catch (error: any) {
      return error?.response?.data;
    }
  }
);

// Create the slice
export const historySlice = createSlice({
  name: 'history',
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.status = FetchStatus.LOADING;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        const history = action?.payload && action.payload.length > 0 ? action.payload[0] : [];
        const totalElements = action?.payload && action.payload.length > 0 ? action.payload[1] : 0;
        state.status = FetchStatus.SUCCESS;
        state.history = history;
        state.pagination.totalElements = totalElements;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.status = FetchStatus.FAILED;
        state.error = action.error.message;
      });
  },
});

// Export the actions
export const selectHistory = (state: { history: HistoryState }): IHistory[] => state.history.history;
export const selectStatus = (state: { history: HistoryState }): FetchStatus => state.history.status;
export const selectError = (state: { history: HistoryState }): string | null | undefined => state.history.error;
export const selectFilters = (state: { history: HistoryState }): Filter[] => state.history.filters;
export const selectPagination = (state: { history: HistoryState }): Pagination => state.history.pagination;
export const selectSort = (state: { history: HistoryState }): { sortBy: string; sortDirection: SortDirection } | null => state.history.sort;

export const { setFilters, setPagination, setSort } = historySlice.actions;
export default historySlice.reducer;
