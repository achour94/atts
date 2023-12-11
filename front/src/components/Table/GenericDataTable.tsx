import { DataGrid, GridColDef, GridFilterModel, GridRowSpacingParams, GridRowsProp, GridSortModel, gridClasses } from '@mui/x-data-grid';
// import { UseDemoDataOptions, createFakeServer } from '@mui/x-data-grid-generator';
import * as React from 'react';
import { ColumnsFileds } from './MultiColumnFilter/MultiColumnFilter';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

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
    columns: Array<any>;
    width: string;
    height: string;
    toolbar?: any;
    toolbarProps?: any;
    componentName: string;
    getItemsFunction: Function;
    handleOpenItem?: Function;
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
        pageSize: 10,
    });
    const [currentFilters, setCurrentFilters] = React.useState<Array<ColumnsFileds>>([{ column: '', operator: '', value: '' }]);
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

    const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
        return {
          top: params.isFirstVisible ? 0 : 7,
          bottom: params.isLastVisible ? 0 : 7,
        };
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
            filterInfo: currentFilters.filter(f => f.column && f.operator && f.value).map((f) => {
                return {
                    column: f.column,
                    [f.operator]: f.value
                }
            })
        }
    }, [paginationModel, queryOptions, currentFilters]);

    React.useEffect(() => {
        console.log("paginationModel", paginationModel, apiQueryOptions);
        setIsLoading(true);
        props.getItemsFunction(apiQueryOptions).then((res: any) => {
            setIsLoading(false);
            setRows(res.rows);
            setPageInfo({ totalRowCount: res.pageInfo.totalRowCount });
        });
    }, [paginationModel, queryOptions, currentFilters]);

    const handleRefreshData = () => {
        setIsLoading(true);
        props.getItemsFunction(paginationModel).then((res: any) => {
            setIsLoading(false);
            setRows(res.rows);
            setPageInfo({ totalRowCount: res.pageInfo.totalRowCount });
        });
    }

    return (
        <div id={`data_table_${props.componentName}`} style={{ width: props.width, height: props.height, overflow: 'hidden' }}>
            <DataGrid 
            rows={rows} 
            columns={props.columns}
            // {...data}
            rowCount={pageInfo.totalRowCount}
            loading={isLoading}
            pageSizeOptions={[10, 25, 100]}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={setPaginationModel} 
            sortingMode="server"
            onSortModelChange={handleSortModelChange}
            filterMode="server"
            onFilterModelChange={onFilterChange}
            getRowSpacing={getRowSpacing}
            onRowDoubleClick={(params) => props.handleOpenItem?.(params)}
            slots={{ toolbar: props.toolbar }}
            slotProps={{ toolbar: { ...props.toolbarProps, currentFilters: currentFilters, setCurrentFilters: setCurrentFilters, refreshData: handleRefreshData } }}
            sx={{
                '&, [class^=MuiDataGrid-root]': { border: 'none', backgroundColor: '#F6FAFD' },
                [`& .${gridClasses.row}`]: {
                    bgcolor: '#FFFFFF !important'
                  },
              }}
            />
        </div>
    );
}
