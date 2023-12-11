import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import GenericDataTable from "../../Table/GenericDataTable";
import _axios from "../../../services/axios";
import { getInvoiceList, handleUploadInvoices } from "../../../services/actions";
import { INVOICES_DATA } from "../../Table/structures/InvoicesTableStructure";
import { useTranslation } from "react-i18next";
import InvoiceToolbar from "../../Table/Toolbars/InvoicesToolbar";
import { FilterModelItem } from "../../Table/MultiColumnFilter/FilterItem";
import { Typography } from "@mui/material";
import SystemUpdateAltOutlinedIcon from '@mui/icons-material/SystemUpdateAltOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import InvoiceDetails from "./InvoiceDetails";

export default function Invoices(props: any) {
    const { t } = useTranslation();
    const [ invoice, setInvoice ] = React.useState(null);
    const [ checkedInvoices, setCheckedInvoices] = React.useState<Array<number>>([]);

    const handleCheckInvoice = (e: any, id: number) => {
        
        const newChecked = checkedInvoices;
        if (e.target.checked) {
            newChecked.push(id);
        } else {
            const index = checkedInvoices.indexOf(id);
            newChecked.splice(index, 1);
        }

        setCheckedInvoices([...newChecked]);

        console.log(e.target.checked, id, checkedInvoices);
    }

    const data = INVOICES_DATA(t, handleCheckInvoice);
    const filterModel: Array<FilterModelItem> = data.columns.filter(item => item.type).map((item: any) => {
        return {
            field: item.field,
            type: item.type,
            headerName: item.headerName,
        };
    });

    const handleInvoiceSelect = (params: any) => {
        console.log("handleInvoiceSelect", params);
        setInvoice(params.row);
    }

    return (invoice === null ? 
        <Box
            sx={{
                flexGrow: 1, bgcolor: '#F6FAFD', p: 3, position: 'relative',
                left: '290px', width: 'calc(100% - 290px)', height: '871px',
                top: '62px', overflow: 'hidden',
            }}>
                <Box
                    sx={{
                    position: 'relative', 
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
                >
                    <Typography fontWeight={600} fontSize={'24px'} lineHeight={'28.13px'}>
                        {t("invoide_page_header")}
                    </Typography>

                    <Box>
                        <Button
                            component="label"
                            variant="contained"
                            startIcon={<SystemUpdateAltOutlinedIcon />}
                            sx={{ marginRight: "1rem", borderRadius: '33px' }}
                        >
                            {t("invoice_page_import_button")}
                            <input type="file"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                hidden
                                onChange={handleUploadInvoices} />
                        </Button>
                        <Button  
                            variant="contained" 
                            startIcon={<DeleteOutlineOutlinedIcon  />}
                            sx={{ marginRight: "1rem", borderRadius: '33px' }}
                            color="error"
                            onClick={() => console.log("Delete after API is avialable")}
                        >
                            {t("invoice_page_delete_my_invoices_button")}
                        </Button>
                    </Box>
                </Box>
                
                <Box sx={{position: 'relative', top: '20px', overflow: 'hidden'}}>
                    <GenericDataTable
                        componentName={"invoices"}
                        getItemsFunction={getInvoiceList}
                        columns={data.columns}
                        width="100%"
                        height="800px"
                        toolbar={InvoiceToolbar}
                        toolbarProps={{ filterModel: filterModel }}
                        handleOpenItem={(params: any) => handleInvoiceSelect(params)}
                    ></GenericDataTable>
                </Box>
        </Box> : <Box>
            "Invoice Details"
        </Box>
    );
}
