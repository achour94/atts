import { IconButton, Checkbox } from "@mui/material/";
import DownloadIcon from '@mui/icons-material/Download';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { GridColDef } from "@mui/x-data-grid";
import MoreVertIcon from '@mui/icons-material/MoreVert';

export const CLIENTS_DATA = (translator: Function) => ({
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
            field: "clientReference.reference",
            headerName: translator("clients_table_column_reference"),
            headerAlign: 'center',
            filterOperators: ["equals", "notEquals", "contains", "notContains", "startsWith", "endsWith"],
        },
        {
            field: "name",
            headerName: translator("clients_table_column_name"),
            headerAlign: 'center',
            filterOperators: ["equals", "notEquals", "contains", "notContains", "startsWith", "endsWith"],
        },
        {
            field: "address",
            headerName: translator("clients_table_column_address"),
            headerAlign: 'center',
            filterOperators: ["equals", "notEquals", "contains", "notContains", "startsWith", "endsWith"],
        },
        {
            field: "defaultSubscription",
            headerName: translator("clients_table_column_subscription"),
            headerAlign: 'center',
            filterOperators: ["equals", "notEquals", "contains", "notContains", "startsWith", "endsWith"],
        },
        {
            "field": "options",
            "headerName": translator("clients_table_column_option"),
            "headerAlign": 'center',
            renderCell: (params: any) => {
                return <IconButton>
                    <MoreVertIcon />
                </IconButton>
            }
        },
    ] as GridColDef[],
});
