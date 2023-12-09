import { IconButton, Checkbox } from "@mui/material/";
import DownloadIcon from '@mui/icons-material/Download';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { GridColDef } from "@mui/x-data-grid";

export const INVOICES_DATA = (translator: Function) => ({
    columns: [
        {
            field: "checkmark",
            renderHeader: () => {
                return <PlaylistAddCheckIcon />;
            },
            renderCell: (params: any) => {
                return <Checkbox />;
            },
        },
        {
            field: "invoiceNumber",
            headerName: translator("invoices_table_column_number"),
            headerAlign: 'center',
            filterOperators: ["equals", "notEquals", "contains", "notContains", "startsWith", "endsWith"],
        },
        {
            field: "issueDate",
            headerName: translator("invoices_table_column_issue_date"),
            headerAlign: 'center',
            filterOperators: ["equals", "notEquals", "contains", "notContains", "startsWith", "endsWith"],
        },
        {
            field: "startDate",
            headerName: translator("invoices_table_column_start_date"),
            headerAlign: 'center',
            filterOperators: ["equals", "notEquals", "contains", "notContains", "startsWith", "endsWith"],
        },
        {
            field: "endDate",
            headerName: translator("invoices_table_column_end_date"),
            headerAlign: 'center',
            filterOperators: ["equals", "notEquals", "contains", "notContains", "startsWith", "endsWith"],
        },
        {
            field: "client",
            headerName: translator("invoices_table_column_client"),
            headerAlign: 'center',
            filterOperators: ["equals", "notEquals", "contains", "notContains", "startsWith", "endsWith"],
        },
        // {
        //     "field": "specialNumber",
        //     flex: 1,
        //     "headerName": translator("invoices_table_column_special_number"),
        //     "headerAlign": 'center'
        // },
        {
            field: "ttc",
            headerName: translator("invoices_table_column_ttc"),
            headerAlign: 'center',
            filterOperators: ["equals", "notEquals", "contains", "notContains", "startsWith", "endsWith"],
        },
        // {
        //     "field": "status",
        //     "headerName": translator("invoices_table_column_status"),
        //     "headerAlign": 'center'
        // },
        {
            "field": "download",
            "headerName": translator("invoices_table_column_download"),
            "headerAlign": 'center',
            renderCell: (params: any) => {
                return <IconButton>
                    <DownloadIcon />
                </IconButton>
            }
        },
    ] as GridColDef[],
});