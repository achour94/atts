import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import GenericDataTable from "./Table/GenericDataTable";
import CachedIcon from '@mui/icons-material/Cached';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
    GridRowsProp, GridColDef, GridToolbarContainer,
    GridToolbarColumnsButton, GridToolbarFilterButton,
    GridToolbarDensitySelector, GridToolbarExport, GridApi
} from '@mui/x-data-grid';
import { Button, Icon, IconButton, Input } from "@mui/material";
import { INVOICES_DATA } from "./Table/TablesData";
import { useTranslation } from "react-i18next";
import UserService from "../services/UserService";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { ChangeEvent } from "react";
import _axios from "../services/axios";
import { set } from "react-hook-form";
import React from "react";
import { getInvoiceList } from "../services/actions";

// import { CustomToolbar } from "./Table/Toolbars/ClientsToolbar";

const mokcClientsRows = [
    { id: 1, number: 1, issueDate: "2021-10-01", startDate: "2021-10-01", endDate: "2021-10-01", client: "Client 1", specialNumber: "1", ttc: "1000", status: "Paid" },
    { id: 2, number: 2, issueDate: "2021-10-01", startDate: "2021-10-01", endDate: "2021-10-01", client: "Client 2", specialNumber: "2", ttc: "2000", status: "Paid" },
    { id: 3, number: 3, issueDate: "2021-10-01", startDate: "2021-10-01", endDate: "2021-10-01", client: "Client 3", specialNumber: "3", ttc: "3000", status: "Paid" },
    { id: 4, number: 4, issueDate: "2021-10-01", startDate: "2021-10-01", endDate: "2021-10-01", client: "Client 4", specialNumber: "4", ttc: "4000", status: "Paid" },
    { id: 5, number: 5, issueDate: "2021-10-01", startDate: "2021-10-01", endDate: "2021-10-01", client: "Client 5", specialNumber: "5", ttc: "5000", status: "Paid" },
    { id: 6, number: 6, issueDate: "2021-10-01", startDate: "2021-10-01", endDate: "2021-10-01", client: "Client 6", specialNumber: "6", ttc: "6000", status: "Paid" },
    { id: 7, number: 7, issueDate: "2021-10-01", startDate: "2021-10-01", endDate: "2021-10-01", client: "Client 7", specialNumber: "7", ttc: "7000", status: "Paid" },
    { id: 8, number: 8, issueDate: "2021-10-01", startDate: "2021-10-01", endDate: "2021-10-01", client: "Client 8", specialNumber: "8", ttc: "8000", status: "Paid" },
    { id: 9, number: 9, issueDate: "2021-10-01", startDate: "2021-10-01", endDate: "2021-10-01", client: "Client 9", specialNumber: "9", ttc: "9000", status: "Paid" },
];

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarFilterButton />
            <GridToolbarColumnsButton />
            <IconButton color="primary" aria-label="upload picture" component="span">
                <CachedIcon />
            </IconButton>
            {/* <GridToolbarExport /> */}
        </GridToolbarContainer>
    );
}

// THIS CLASS IS JUST FOR TESTING
export default function ContentPlaceholder(props: any) {
    const { t } = useTranslation();
    const [rows, setRows] = React.useState(mokcClientsRows);
    const [pageInfo, setPageInfo] = React.useState({ totalRowCount: 0 });
    const [isLoading, setIsLoading] = React.useState(false);

    const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
        console.log("uploaded file");
        if (!event.target.files?.length) {
            console.warn("no file uploaded");
            return;
        }

        for (let i = 0; i < event.target.files.length; i++) {
            const file = event.target.files[i];
            const formData = new FormData();
            formData.append("file", file);
            _axios.post("http://localhost:8081/api/invoice/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        }

        setTimeout(() => {
            callInvoices();
        }, 2000);
    }

    const callInvoices = () => {
        setIsLoading(true);
        getInvoiceList(undefined).then((res: any) => {
            setIsLoading(false);
            setRows(res.rows);
            setPageInfo({ totalRowCount: res.totalRowCount });
        });
    }

    React.useEffect(() => {
        callInvoices();
    }, []);
    
    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1, bgcolor: 'background.default', p: 3, position: 'relative',
                left: '290px', width: 'calc(100% - 290px)', height: '100vh'
            }}
        >
            <h1> {props.name} </h1>
            {(props.name.toLowerCase() !== "clients" && props.name.toLowerCase() !== "invoices") ? (<Box>
                <Button onClick={() => UserService.doLogin()}>Login</Button>
                <Typography paragraph>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
                    enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
                    imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
                    Convallis convallis tellus id interdum velit laoreet id donec ultrices.
                    Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                    adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
                    nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
                    leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
                    feugiat vivamus at augue. At augue eget arcu dictum varius duis at
                    consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
                    sapien faucibus et molestie ac.
                </Typography>
                <Typography paragraph>
                    Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
                    eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
                    neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
                    tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
                    sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
                    tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
                    gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
                    et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
                    tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
                    eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
                    posuere sollicitudin aliquam ultrices sagittis orci a.
                </Typography></Box>) :
                (<Box>
                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={<FileUploadIcon />}
                        sx={{ marginRight: "1rem" }}
                    >
                        Upload
                        <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" hidden onChange={handleUpload} />
                    </Button>
                    <GenericDataTable
                    componentName={"table"}
                    getItemsFunction={getInvoiceList}
                    columns={INVOICES_DATA(t).columns}
                    width="100%"
                    height="90%"
                    toolbar={CustomToolbar}
                ></GenericDataTable></Box>)}
        </Box>
    )
}
