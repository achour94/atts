import { IconButton, Checkbox, Button, ButtonGroup } from "@mui/material/";
import DownloadIcon from '@mui/icons-material/Download';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { EURO, FILTER_TYPES_NAMES } from "../../constants";
import { GridValueFormatterParams } from "@mui/x-data-grid";
import { format } from 'date-fns';

const dateValueFormater = (params: GridValueFormatterParams<Date>) => {
    if (params.value == null) {
      return '';
    }
    return format(params.value, 'd MMM yyyy')
}

export const INVOICES_DATA = (translator: Function, checkerCallBack: Function) => ({
    columns: [
        {
            field: "checkmark",
            headerAlign: 'center',
            align:'center',
            flex: 0.5,
            sortable: false,
            disableColumnMenu: true,
            renderHeader: () => {
                return <PlaylistAddCheckIcon />;
            },
            renderCell: (params: any) => {
                const id = params.id;
                return <Checkbox onChange={(e) => checkerCallBack(e, id)}/>;
            },
        },
        {
            field: "invoiceNumber",
            headerName: translator("invoices_table_column_number"),
            headerAlign: 'center',
            align:'center',
            type: FILTER_TYPES_NAMES.NUMBER,
            flex: 1,
            valueFormatter: (params: GridValueFormatterParams<number>) => {
                if (params.value == null) {
                  return '';
                }
                return `# ${params.value.toLocaleString()}`;
            },
        },
        {
            field: "createDate",
            headerName: translator("invoices_table_column_issue_date"),
            headerAlign: 'center',
            align:'center',
            type: FILTER_TYPES_NAMES.DATE,
            flex: 1,
            valueFormatter: dateValueFormater,
        },
        {
            field: "startPeriod",
            headerName: translator("invoices_table_column_start_date"),
            headerAlign: 'center',
            align:'center',
            type: FILTER_TYPES_NAMES.DATE,
            flex: 1,
            valueFormatter: dateValueFormater,
        },
        {
            field: "endPeriod",
            headerName: translator("invoices_table_column_end_date"),
            headerAlign: 'center',
            align:'center',
            type: FILTER_TYPES_NAMES.DATE,
            flex: 1,
            valueFormatter: dateValueFormater,
        },
        {
            field: "client.name",
            headerName: translator("invoices_table_column_client"),
            headerAlign: 'center',
            align:'center',
            type: FILTER_TYPES_NAMES.STRING,
            flex: 1.5,
        },
        // {
        //     "field": "specialNumber",
        //     flex: 1,
        //     "headerName": translator("invoices_table_column_special_number"),
        //     "headerAlign": 'center'
        // },
        {
            field: "ttcAmount",
            headerName: translator("invoices_table_column_ttc"),
            headerAlign: 'center',
            align:'center',
            type: FILTER_TYPES_NAMES.NUMBER,
            flex: 1,
            valueFormatter: (params: GridValueFormatterParams<number>) => {
                if (params.value == null) {
                  return '';
                }
                return `${params.value.toLocaleString()} ${EURO}`;
            },
        },
        // {
        //     "field": "status",
        //     "headerName": translator("invoices_table_column_status"),
        //     "headerAlign": 'center'
        // },
        {
            "field": "download",
            "headerName": translator("invoices_table_column_download"),
            headerAlign: 'center',
            align:'center',
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params: any) => {
                return (
                    <ButtonGroup
                        color='primary'
                        orientation='horizontal'
                        variant='contained'
                        sx={{borderRadius: '23px'}}
                    >
                    <Button sx={{borderRadius: '23px'}}><DownloadIcon /></Button>
                    
                    <Button sx={{borderRadius: '23px'}}>
                        <ArrowDropDownOutlinedIcon />
                    </Button>
                </ButtonGroup>)
            }
        },
    ],
});
