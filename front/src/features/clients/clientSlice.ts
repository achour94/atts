import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/axios'; 
import { FetchStatus, Filter, Pagination, SortDirection } from '../../lib/constants/utilsConstants';
import { formatClientsData } from '../../utils/utils';
import { IClient } from '../../lib/interfaces/IClient';

export const CLIENT_API_URL = '/api/client';

interface ClientsState {
  clients: IClient[];
  status: FetchStatus;
  error: string | null | undefined;
  filters: Filter[];
  pagination: Pagination;
  sort: { sortBy: string; sortDirection: SortDirection } | null;
}

interface FetchClientsParams {
  pageSize: number;
  pageNumber: number;
  criteria: any[]; // Define the structure of criteria or leave as any
  sort: { sortBy: string; sortDirection: SortDirection } | null;
}

// Define the initial state with type
const initialState: ClientsState = {
  clients: [],
  status: FetchStatus.IDLE,
  error: null,
  filters: [],
  pagination: { page: 0, pageSize: 25, totalElements: 0 },
  sort: null,
};

// Async thunk for fetching clients
export const fetchClients = createAsyncThunk(
  'client/fetchClients',
  async ({pageSize, pageNumber, criteria, sort}: FetchClientsParams) => {
    try {
      const mappedCriteria = criteria.map((c) => {
        return {
          column : c.column,
          [c.operator]: c.value
        }
      });
     const encodedCriteria = encodeURIComponent(JSON.stringify(mappedCriteria));
     let url = `${CLIENT_API_URL}?pageSize=${pageSize}&pageNumber=${pageNumber}&criteria=${encodedCriteria}`;
     if (sort) {
       url += `&sortBy=${sort.sortBy}&sortDirection=${sort.sortDirection}`;
     }
     const response = await axios.get(url);
     return [formatClientsData(response.data.content), response.data.totalElements];
    } catch (error: any) {
      return error?.response?.data;
    }
  }
);

// Create the slice
export const clientSlice = createSlice({
  name: 'client',
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = FetchStatus.LOADING;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        const clients = action?.payload && action.payload.length > 0 ? action.payload[0] : [];
        const totalElements = action?.payload && action.payload.length > 0 ? action.payload[1] : 0;
        state.status = FetchStatus.SUCCESS;
        state.clients = clients;
        state.pagination.totalElements = totalElements;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = FetchStatus.FAILED;
        state.error = action.error.message;
      });
  },
});

// export selectors
export const selectClients = (state: any): IClient[] => state.client.clients;
export const selectStatus = (state: any): FetchStatus => state.client.status;
export const selectError = (state: any): string | null | undefined => state.client.error;
export const selectFilters = (state: any): Filter[] => state.client.filters;
export const selectPagination = (state: any): Pagination => state.client.pagination;
export const selectSort = (state: any): { sortBy: string; sortDirection: SortDirection } | null => state.client.sort;

export const { setFilters, setPagination, setSort } = clientSlice.actions;
export default clientSlice.reducer;
