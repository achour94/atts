import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import Switch from "@mui/material/Switch";
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Button from "@mui/material/Button";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import GetAppOutlinedIcon from '@mui/icons-material/GetAppOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import TextField from "@mui/material/TextField";
import { StaticDatePicker } from "@mui/x-date-pickers";
import Popover from "@mui/material/Popover";

interface InvoiceDetailsProps {
    invoiceNumber: number;
    clientName: string;
    issueDate: Date;
    createDate: Date;
    dueDate: Date;
    client: {
        name: string;
        userName: string;
        email: string;
        phone: string;
    }
    consumptions: Array<{
        type: string;
        hcAmmount: number;
        ttcAmount: number;
    }>;
}

const iconsFill = { fill: '#157EB5' };
const invoiceDetailsPaperText = { fontWeight: 'bold' };
const titles = { fontFamily: 'Inter', fontWeight: 700, fontSize: '18px', lineHeight: '30px', color: '#092C4C' };
const dateFont = { fontFamily: 'Roboto', fontWeight: 400, fontSize: '16px', lineHeight: '27px', color: '#7E92A2' };

interface DatePickerPopoverProps {
    dateType: string;
    anchorEl: HTMLButtonElement | null;
    id: string | undefined;
    open: boolean;
    handleClick: Function
    handleClose: Function;
    handleDateChange: Function;
}

const datePickerPopover = (props: DatePickerPopoverProps) => {
    return (<Box>
        <IconButton onClick={(e) => props.handleClick(e, props.dateType)}>
            <CalendarTodayOutlinedIcon sx={{ ...iconsFill }} />
        </IconButton>
        <Popover
            id={props.id}
            open={props.open}
            anchorEl={props.anchorEl}
            onClose={() => props.handleClose(props.dateType)}
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
            }}
        >
            <StaticDatePicker 
                onChange={(value) => props.handleDateChange(value)} 
                onClose={() => props.handleClose(props.dateType)} 
                onAccept={() => props.handleClose(props.dateType)}
            />
        </Popover>
    </Box>);
}

export default function InvoiceDetails(props: InvoiceDetailsProps) {
    const { t } = useTranslation();
    const [invoiceDetails, setInvoiceDetails] = React.useState(props);
    const [editing, setEditing] = React.useState<number | null>(null);
    const [anchorElIssueDate, setAnchorElIssueDate] = React.useState<HTMLButtonElement | null>(null);
    const [anchorElCreateDate, setAnchorElCreateDate] = React.useState<HTMLButtonElement | null>(null);
    const [anchorElDueDate, setAnchorElDueDate] = React.useState<HTMLButtonElement | null>(null);

    const handleClickDate = (event: React.MouseEvent<HTMLButtonElement>, type: string) => {
        switch (type) {
            case 'issue':
                setAnchorElIssueDate(event.currentTarget);
                break;
            case 'create':
                setAnchorElCreateDate(event.currentTarget);
                break;
            case 'due':
                setAnchorElDueDate(event.currentTarget);
                break;
            default:
                console.log('Unknown date type on click: ', type);
        }
    };

    const handleCloseDate = (type: string) => {
        switch (type) {
            case 'issue':
                setAnchorElIssueDate(null);
                break;
            case 'create':
                setAnchorElCreateDate(null);
                break;
            case 'due':
                setAnchorElDueDate(null);
                break;
            default:
                console.log('Unknown date type on close: ', type);
        }
    };

    const isPopoverOpen = (type: string) => {
        switch (type) {
            case 'issue':
                return Boolean(anchorElIssueDate);
            case 'create':
                return Boolean(anchorElCreateDate);
            case 'due':
                return Boolean(anchorElDueDate);
            default:
                console.log('Unknown date type on open: ', type);
                return false;
        }
    }

    const popoverId = (type: string) => isPopoverOpen(type) ? `invoice-details-popover-${type}` : undefined;

    const handleConsumptionDelete = (e: any, index: number) => {
        const oldConsumptions = invoiceDetails.consumptions || [];
        oldConsumptions.splice(index, 1);
        setInvoiceDetails({ ...invoiceDetails, consumptions: oldConsumptions });
    }

    const handleConsumptionChange = (value: number, consumptionType: string) => {
        if (editing === null) {
            return;
        }

        const oldConsumptions = invoiceDetails.consumptions || [];
        const updatedConsumptions = oldConsumptions.map((consumption, index) => {
            if (index === editing) {
                return {
                    ...consumption,
                    [consumptionType]: value
                };
            }
            return consumption;
        });

        setInvoiceDetails({ ...invoiceDetails, consumptions: updatedConsumptions });
    }

    const handleEditing = (e: any, index: number) => {
        if (editing === index) {
            setEditing(null);
        } else {
            setEditing(index);
        }
    }

    const invoiceDetailsPaper = () => {
        return (
            <Box sx={{ width: '719px' }}>
                <Typography variant="h5" {...titles}>
                    {t("invoice_details_title")}
                </Typography>
                <Paper sx={{
                    height: '64px',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    alignContent: 'center'
                }} >
                    <Box>
                        <Typography variant="subtitle1" color={"#868DA6"} fontFamily={'Roboto'}>
                            {t("invoices_table_column_number")}
                        </Typography>
                        <Typography variant="subtitle2" sx={invoiceDetailsPaperText}>
                            N°{invoiceDetails.invoiceNumber}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" color={"#868DA6"} fontFamily={'Roboto'}>
                            {t("invoices_table_column_client")}
                        </Typography>
                        <Typography variant="subtitle2" sx={invoiceDetailsPaperText}>
                            {invoiceDetails.clientName}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" color={"#868DA6"} fontFamily={'Roboto'}>
                            {t("invoice_details_invoice_due_date")}
                        </Typography>
                        <Typography variant="subtitle2" sx={invoiceDetailsPaperText}>
                            {invoiceDetails.dueDate.toLocaleDateString()}
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        );
    }

    const invoiceDetailsProforma = () => {
        const dateType = 'issue';

        const handleIssueDateChange = (date: Date | null) => {
            setInvoiceDetails({ ...invoiceDetails, issueDate: date || invoiceDetails.issueDate });
        }

        return (
            <Stack spacing={2} sx={{ width: '719px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                    <Typography variant="h5" {...titles}>
                        {t("invoice_details_proforma")}
                    </Typography>
                    <Switch />
                </Box>
                <Paper sx={{
                    height: '50px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    alignContent: 'center',
                    border: "1px",
                    borderRadius: "8px",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    backgroundColor: "#F6F8FC",
                }}>
                    <Typography {...dateFont}>
                        {invoiceDetails.issueDate.toLocaleDateString()}
                    </Typography>
                    {datePickerPopover({
                        id: popoverId(dateType),
                        open: isPopoverOpen(dateType),
                        anchorEl: anchorElIssueDate,
                        dateType: dateType,
                        handleClick: handleClickDate,
                        handleClose: handleCloseDate,
                        handleDateChange: handleIssueDateChange
                    })}
                </Paper>
            </Stack>
        )
    }

    const editableTableCell = (value: number, index: number, consumptionType: string) => {
        return editing === index ? (
            <TableCell align="right">
                <TextField 
                    sx={{ color: '#7E92A2' }} 
                    variant="standard" 
                    defaultValue={value} 
                    label={'€'} 
                    onChange={(e) => handleConsumptionChange(Number(e.target.value), consumptionType)}    
                />
            </TableCell>
        ) : (<TableCell align="right">
            <Typography color={'#7E92A2'}>
                {value} €
            </Typography>
        </TableCell>);
    }

    const invoiceDetailsConsumptions = () => {
        const tableHeaderTypographyStyle = { fontWeight: 'bold', fontFamily: 'Roboto', fontSize: '12px', lineHeight: '12px' };
        return (
            <Stack spacing={2} sx={{ width: '719px' }}>
                <Typography variant="h3" {...titles}>
                    {t("invoice_details_consumption")}
                </Typography>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow >
                                <TableCell>
                                    <Typography {...tableHeaderTypographyStyle}>
                                        {t("invoice_details_consumtptions_table_column_type")}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography {...tableHeaderTypographyStyle}>
                                        {t("invoice_details_consumtptions_table_column_hc")}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography {...tableHeaderTypographyStyle}>
                                        {t("invoice_details_consumtptions_table_column_ttc")}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography {...tableHeaderTypographyStyle}>
                                        {t("invoice_details_consumtptions_table_column_options")}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{ backgroundColor: '#F6F8FC' }}>
                            {invoiceDetails.consumptions?.map((row, index: number) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.type}
                                    </TableCell>
                                    { editableTableCell(row.hcAmmount, index, 'hcAmount') }
                                    { editableTableCell(row.ttcAmount, index, 'ttcAmount') }
                                    <TableCell align="right">
                                        <IconButton sx={{ paddingRight: '0px !important' }}>
                                            <EditOutlinedIcon sx={{ ...iconsFill }} onClick={(e) => handleEditing(e, index)}/>
                                        </IconButton>
                                        <IconButton sx={{ paddingLeft: '0px !important' }} onClick={(e: any) => handleConsumptionDelete(e, index)}>
                                            <DeleteOutlineIcon sx={{ ...iconsFill }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle1" fontFamily={'Inter'} fontWeight={400} fontSize={'8px'} lineHeight={'10px'} color={'#868DA6'}>
                        {t("invoice_details_comsumptions_total")}
                    </Typography>
                    <Typography fontFamily={'Roboto'} fontWeight={700} fontSize={'24px'} lineHeight={'28px'} color={'#EE7F01'}>
                        {invoiceDetails.consumptions?.reduce((acc, curr) => acc + curr.ttcAmount + curr.hcAmmount, 0)} €
                    </Typography>
                </Box>
            </Stack>
        );
    }

    const clientInfo = () => {
        return (
            <Paper sx={{ height: '303px', width: '435px', borderRadius: '12px', border: '1px', borderColor: '#EAEEF4' }}>
                <Stack spacing={2}>
                    <Box sx={{ height: '78px' }}>
                        <Typography variant="h5" {...titles} sx={{ padding: '20px' }}>
                            {t("invoice_details_client_info")}
                        </Typography>
                    </Box>


                    <Stack direction={"row"} spacing={1} sx={{ paddingLeft: '20px' }}>
                        <AccountCircleIcon sx={{ fill: '#BDBDBD', width: '45px', height: '45px' }} />
                        <Stack direction={"column"} spacing={0.1}>
                            <Typography fontFamily={'Inter'} fontWeight={700} fontSize={'18px'} lineHeight={'27px'} color={'#092C4C'}>
                                {invoiceDetails.client.name}
                            </Typography>
                            <Typography fontFamily={'Roboto'} fontWeight={500} fontSize={'16px'} lineHeight={'27px'} color={'#092C4C'}>
                                {invoiceDetails.client.userName}
                            </Typography>
                            <Typography fontFamily={'Inter'} fontWeight={400} fontSize={'16px'} lineHeight={'27px'} color={'#7E92A2'}>
                                {invoiceDetails.client.email}
                            </Typography>
                            <Typography fontFamily={'Roboto'} fontWeight={400} fontSize={'16px'} lineHeight={'27px'} color={'#7E92A2'}>
                                {invoiceDetails.client.phone}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Button startIcon={<KeyboardBackspaceIcon />} variant="contained" sx={{
                        width: '371px',
                        borderRadius: "33px",
                        padding: "8px, 20px, 8px, 20px",
                        position: 'relative',
                        left: '40px',
                        top: '25px'
                    }}>
                        {t("invoice_details_client_info_go_to_profile")}
                    </Button>
                </Stack>
            </Paper>
        );
    }

    const invoiceInfoDate = (title: string, date: Date, dateType: string, anchorEl: any, handleChange: Function) => {
        return (<Box sx={{ height: '50px', width: '378px' }}>
            <Typography fontFamily={'Inter'} fontWeight={500} fontSize={'17px'} lineHeight={'30px'} color={'#092C4C'}>
                {t(title)}
            </Typography>
            <Box sx={{ display: 'flex', backgroundColor: '#EAEEF4', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '20px', paddingRight: '10px' }} >
                <Typography {...dateFont}>
                    {date.toLocaleDateString()}
                </Typography>
                {datePickerPopover({
                        id: popoverId(dateType),
                        open: isPopoverOpen(dateType),
                        anchorEl: anchorEl,
                        dateType: dateType,
                        handleClick: handleClickDate,
                        handleClose: handleCloseDate,
                        handleDateChange: handleChange
                })}
            </Box>
        </Box>);
    }

    const invoiceInfo = () => {
        const handleCreateDateChange = (date: Date | null) => {
            setInvoiceDetails({ ...invoiceDetails, createDate: date || invoiceDetails.createDate });
        }

        const handleDueDateChange = (date: Date | null) => {
            setInvoiceDetails({ ...invoiceDetails, dueDate: date || invoiceDetails.dueDate });
        }

        return (
            <Paper sx={{ width: '435px', height: '479px', borderRadius: '12px', border: '1px', borderColor: '#EAEEF4' }}>
                <Box sx={{ height: '78px' }}>
                    <Typography variant="h5" {...titles} sx={{ padding: '20px' }}>
                        {t("invoice_details_info")}
                    </Typography>
                </Box>

                <Stack spacing={5} sx={{ paddingLeft: '20px', height: '208px' }}>
                    {invoiceInfoDate(
                        "invoice_details_info_creation_date", 
                        invoiceDetails.createDate, 
                        'create',  
                        anchorElCreateDate, 
                        handleCreateDateChange)}
                    {invoiceInfoDate(
                        "invoice_details_invoice_due_date", 
                        invoiceDetails.dueDate, 
                        'due', 
                        anchorElDueDate, 
                        handleDueDateChange)}
                </Stack>

                <Stack spacing={2} sx={{ paddingLeft: '20px', position: 'relative', bottom: '-33px' }}>
                    <Stack direction={"row"} spacing={1} >
                        <Button variant="outlined" startIcon={<VisibilityOutlinedIcon />} sx={{ borderRadius: '23px', height: '35px', width: '183px' }}>
                            {t("invoice_details_info_visualise_button")}
                        </Button>
                        <Button variant="outlined" startIcon={<GetAppOutlinedIcon />} sx={{ borderRadius: '23px', height: '35px', width: '183px' }}>
                            {t("invoice_details_info_download_button")}
                        </Button>
                    </Stack>
                    <Button variant="contained" startIcon={<SendOutlinedIcon />} sx={{ borderRadius: '33px', width: '373px' }}>
                        {t("invoice_details_info_send_by_email_button")}
                    </Button>
                </Stack>
            </Paper>
        );
    }

    return (
        <Box sx={{
            flexGrow: 1, bgcolor: 'background.default', p: 3, position: 'relative',
            left: '320px', width: 'calc(100% - 320px)', height: '100vh', backgroundColor: '#F6FAFD'
        }}>
            <Stack spacing={4} direction={"row"}>
                <Paper sx={{ width: '758px', height: '809px' }}>
                    <Stack spacing={4} direction={"column"} sx={{ width: '100%', height: '100%', paddingLeft: '20px', paddingRight: '10px' }}>
                        <IconButton sx={{ left: '0px', width: '35px', height: '35px' }}>
                            <ArrowBackIosNewIcon />
                        </IconButton>
                        {invoiceDetailsPaper()}
                        {invoiceDetailsProforma()}
                        {invoiceDetailsConsumptions()}
                        <Paper sx={{ width: '719px', padding: '12px', backgroundColor: '#FFFFFF', border: '0.6px', borderRadius: '10px', borderColor: '#EBEFF6' }}>
                            <Typography fontFamily={'Roboto'} fontWeight={600} lineHeight={'12px'} fontSize={'8px'} color={'#5D6481'}>
                                {t("invoice_details_disclaimer_title")}
                            </Typography>
                            <Typography fontFamily={'Roboto'} fontWeight={400} lineHeight={'12px'} fontSize={'8px'} color={'#868DA6'}>
                                {t("invoice_details_disclaimer_content")}
                            </Typography>
                        </Paper>
                    </Stack>
                </Paper>

                <Stack spacing={3.3} direction={"column"} sx={{ width: '435px' }}>
                    {clientInfo()}
                    {invoiceInfo()}
                </Stack>
            </Stack>
        </Box>
    );
}