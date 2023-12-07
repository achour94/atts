import { DataGrid, GridColDef, GridFilterModel, GridRowsProp, GridSortModel, GridToolbar } from '@mui/x-data-grid';
// import { UseDemoDataOptions, createFakeServer } from '@mui/x-data-grid-generator';
import * as React from 'react';
import { ColumnsFileds } from './MultiColumnFilter';

// const SERVER_OPTIONS = {
//     useCursorPagination: false
// };

// const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];
// const DATASET_OPTION: UseDemoDataOptions = {
//   dataSet: 'Employee',
//   visibleFields: VISIBLE_FIELDS,
//   rowLength: 100,
// };

// const { useQuery, ...data } = createFakeServer(DATASET_OPTION, SERVER_OPTIONS);

interface GenericDataTableProps {
    columns: Array<GridColDef>;
    width: string;
    height: string;
    toolbar?: any;
    toolbarProps?: any;
    componentName: string;
    getItemsFunction: Function;
}

interface QueryOptions {
    sortModel?: GridSortModel,
    filterModel?: GridFilterModel
}

export default function GenericDataTable(props: GenericDataTableProps) {
    const [rows, setRows] = React.useState([]);
    const [pageInfo, setPageInfo] = React.useState({ totalRowCount: 0 });
    const [isLoading, setIsLoading] = React.useState(false);
    const [paginationModel, setPaginationModel] = React.useState({
        page: 0,
        pageSize: 5,
    });
    const [currentFilters, setCurrentFilter] = React.useState<Array<ColumnsFileds>>([{ column: '', operator: '', values: [] }]);
    const [queryOptions, setQueryOptions] = React.useState<QueryOptions>({sortModel: undefined, filterModel: undefined});

    const handleSortModelChange = React.useCallback((sortModel: GridSortModel) => {
        // Here you save the data you need from the sort model
        setQueryOptions(queryOptions => ({...queryOptions, sortModel: [...sortModel] }));
        console.log("queryOptions", queryOptions, sortModel);
    }, []);
    
    const onFilterChange = React.useCallback((filterModel: GridFilterModel) => {
        // Here you save the data you need from the filter model
        setQueryOptions(queryOptions => ({ ...queryOptions, filterModel: { ...filterModel } }));
        console.log("queryOptions", queryOptions, filterModel);
    }, []);

    // const useQueryOptions = React.useMemo(() => ({...paginationModel, ...queryOptions}), [paginationModel, queryOptions]);
    // const { isLoading, rows, pageInfo } = useQuery(useQueryOptions);

    const apiQueryOptions = React.useMemo(() => {
        return {
            pageInfo: {
                pageNumber: paginationModel.page, 
                pageSize: paginationModel.pageSize
            }, 
            sortInfo: {
                sortDirection: queryOptions.sortModel?.[0]?.sort?.toUpperCase(),
                sortBy: queryOptions.sortModel?.[0]?.field
            },
            filterModel: null
        }
    }, [paginationModel, queryOptions]);

    React.useEffect(() => {
        console.log("paginationModel", paginationModel);
        setIsLoading(true);
        props.getItemsFunction(apiQueryOptions).then((res: any) => {
            setIsLoading(false);
            setRows(res.rows);
            setPageInfo({ totalRowCount: res.pageInfo.totalRowCount });
        });;
    }, [paginationModel, queryOptions]);

    return (
        <div id={`data_table_${props.componentName}`} style={{ width: props.width, height: props.height }}>
            <DataGrid 
            rows={rows} 
            columns={props.columns}
            // {...data}
            rowCount={pageInfo.totalRowCount}
            loading={isLoading}
            pageSizeOptions={[5, 50, 100]}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={setPaginationModel} 
            sortingMode="server"
            onSortModelChange={handleSortModelChange}
            filterMode="server"
            onFilterModelChange={onFilterChange}
            slots={{ toolbar: props.toolbar }}
            slotProps={{ toolbar: {...props.toolbarProps, currentFilters: currentFilters, setCurrentFilters: setCurrentFilter} }}
            />
        </div>
    );
}
