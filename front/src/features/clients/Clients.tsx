import { Box, Checkbox, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import MuiButton from '../../components/Form/MuiButton'
import PageTitle from '../../components/utils/Typography/PageTitle'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MuiTable from '../../components/MuiTable/MuiTable';
import { FetchStatus, Filter, FilterType, SortDirection, TableColumn } from '../../lib/constants/utilsConstants';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import axios from '../../services/axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients, selectClients, selectError, selectFilters, selectPagination, selectSort, selectStatus, setFilters, setPagination, setSort } from './clientSlice';
import { ThunkDispatch } from 'redux-thunk';
import { ClientConstants as CC } from '../../lib/constants/ClientConstants';
import { toast } from 'react-toastify';
import FilterButton from '../../components/Filters/FilterButton';
import { ColumnType as CT } from '../../lib/constants/utilsConstants';
import { getFiltersOptionsFromColumns } from '../../utils/utils';
import { Link, useNavigate } from 'react-router-dom';
import StyledLink from '../../components/utils/Typography/StyledLink';
import { IClient } from '../../lib/interfaces/IClient';
import DeleteModifyOptions from '../../components/utils/DeleteModifyOptions';

function Clients() {
    const columns: TableColumn[] = useMemo(() => [
        // {
        //     field: "checkmark",
        //     renderHeader: () => {
        //         return <PlaylistAddCheckOutlinedIcon />;
        //     },
        //     renderCell: (value: any) => {
        //         return <Checkbox sx={{padding: 0}} />;
        //     },
        // },
        {
            field: CC.CLIENT_CLIENTREFERENCE,
            label: "Référence",
            columnType: CT.TEXT,
            filterOperators: [FilterType.EQUALS, FilterType.CONTAINS, FilterType.STARTS_WITH, FilterType.ENDS_WITH],
            isSortable: true,
        },
        {
            field: CC.CLIENT_NAME,
            label: "Nom",
            columnType: CT.TEXT,
            filterOperators: [FilterType.EQUALS, FilterType.CONTAINS, FilterType.STARTS_WITH, FilterType.ENDS_WITH],
            isSortable: true,
            renderCell: (row: IClient) => {
                return <StyledLink to={`/client/${row.clientId}`}>{row.name}</StyledLink>
            }
        },
        {
            field: CC.CLIENT_ADDRESS,
            label: "Adresse",
            columnType: CT.TEXT,
            filterOperators: [FilterType.EQUALS, FilterType.CONTAINS, FilterType.STARTS_WITH, FilterType.ENDS_WITH],
            isSortable: true,
        },
        {
            field: CC.CLIENT_DEFAULTSUBSCRIPTION,
            label: "Abonnement par défaut",
            columnType: CT.NUMBER,
            filterOperators: [FilterType.EQUALS, FilterType.MIN, FilterType.MAX],
            isSortable: true,
        },
        // {
        //     field: "options",
        //     label: "Options",
        //     renderCell: (value: any) => {
        //         return <DeleteModifyOptions onDelete={() => {}} onModify={() => {}} />
        //     }
        // },
    ], []);
    
    const filtersOptions = useMemo(() => getFiltersOptionsFromColumns(columns), [columns]);

    const dispatch: ThunkDispatch<any, void, any> = useDispatch();
    const clients: IClient[] = useSelector(selectClients);
    const status: FetchStatus = useSelector(selectStatus);
    const error = useSelector(selectError);
    const filters = useSelector(selectFilters);
    const pagination = useSelector(selectPagination);
    const sort = useSelector(selectSort);
    const navigate = useNavigate()


    const applyFiltersHandler = (filters: Filter[]) => {
        dispatch(setFilters(filters));
    }

    const resetFiltersHandler = () => {
        dispatch(setFilters([]));
    }

    const onSortHandler = (sortBy: string, sortDirection: SortDirection) => {
        console.log(sortBy, sortDirection);
        dispatch(setSort({sortBy, sortDirection}))
    }

    const onRowsPerPageChangeHandler = (rowsPerPage: number) => {
        dispatch(setPagination({...pagination ,page: 0, pageSize: rowsPerPage}));
    }

    const onPageChangeHandler = (page: number) => {
        dispatch(setPagination({...pagination , page}));
    }


    useEffect(() => {
        dispatch(fetchClients({
            pageSize: pagination.pageSize,
            pageNumber: pagination.page,
            criteria: filters,
            sort: sort,
          }))
    }, [dispatch, pagination, filters, sort])

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const addClientClickHandler = () => {
        //navigate to /client/add
        navigate('/client/add')
    }

  return (
    <Box sx={{
        width: "100%",
    }} >
        <Box>
            <Grid container sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 7
            }} >
                <Grid item flex={1}>
                    <PageTitle title='Mes Clients' />
                </Grid>
                <Grid item>
                    <MuiButton startIcon={<AddOutlinedIcon />} label="Ajouter un client" color="primary" onClick={() => addClientClickHandler()} />
                </Grid>
            </Grid>
            <Grid container sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                mt: 2
            }} >
                <Grid item>
                    <FilterButton 
                        filters={filters} 
                        applyFilters={applyFiltersHandler}  
                        resetFilters={resetFiltersHandler}
                        filtersOptions={filtersOptions}
                    />
                </Grid>
            </Grid>
            <Grid mt={2} >
                <MuiTable 
                    columns={columns} 
                    rows={clients} 
                    status={status} 
                    sort={sort || null} 
                    onSort={onSortHandler}
                    pagination={pagination}
                    onPageChange={onPageChangeHandler}
                    onRowsPerPageChange={onRowsPerPageChangeHandler}
                />
            </Grid>
        </Box>
    </Box>
  )
}

export default Clients
