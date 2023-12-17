import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import GenericDataTable from "../../Table/GenericDataTable";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import _axios from "../../../services/axios";
import { getInvoiceList } from "../../../services/actions";
import { INVOICES_DATA } from "../../Table/structures/InvoicesTableStructure";
import { useTranslation } from "react-i18next";
import InvoiceToolbar from "../../Table/Toolbars/InvoicesToolbar";
import { FilterModelItem } from "../../Table/MultiColumnFilter/FilterItem";

export default function Invoices(props: any) {
    const { t } = useTranslation();
    // const data = INVOICES_DATA(t);
    // const filterModel: Array<FilterModelItem> = data.columns.filter(item => item.filterOperators).map((item: any) => {
    //     return {
    //         column: item.field,
    //         headerName: item.headerName,
    //         operators: item.filterOperators,
    //     };
    // });

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("uploaded file");
        if (!event.target.files?.length) {
            console.warn("no file uploaded");
            return;
        }

        for (let i = 0; i < event.target.files.length; i++) {
            const file = event.target.files[i];
            const formData = new FormData();
            formData.append("file", file);
            _axios.post("http://localhost:8082/api/invoice/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        }
    }

    return (
        <Box
            sx={{
                flexGrow: 1, bgcolor: 'background.default', p: 3, position: 'relative',
                left: '290px', width: 'calc(100% - 290px)', height: '100vh'
            }}>
            <Button
                component="label"
                variant="outlined"
                startIcon={<FileUploadIcon />}
                sx={{ marginRight: "1rem" }}
            >
                Upload
                <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" hidden onChange={handleUpload} />
            </Button>
            {/* <GenericDataTable
                componentName={"table"}
                getItemsFunction={getInvoiceList}
                columns={data.columns}
                width="100%"
                height="90%"
                toolbar={InvoiceToolbar}
                toolbarProps={{filterModel: filterModel}}
            ></GenericDataTable> */}
            </Box>
    );
}