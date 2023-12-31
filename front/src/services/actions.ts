import { GridSortModel } from "@mui/x-data-grid";
import _axios from "./axios";

let HOST, PORT;
if (process.env.NODE_ENV === 'development') {
    HOST = process.env.REACT_APP_HOST_DEV;
    PORT = process.env.REACT_APP_PORT_DEV;
}

const BASE_URL = `http://${HOST}:${PORT}`;
const INVOICES_API = `${BASE_URL}/api/invoice`;
const PUT_INVOICES_API = `${BASE_URL}/api/invoice/upload`;
const CLIENTS_API = `${BASE_URL}/api/client`;

interface apiOptions {
    pageInfo: {
        pageNumber: number;
        pageSize: number;
    },
    filterInfo?: Array<any>
    sortInfo?: {
        sortBy: string;
        sortDirection: string;
    }
}

const formURL = (BASE_URL: string, options: apiOptions | undefined) => {
    if (!options) return BASE_URL;

    let url = BASE_URL + "?";

    if (options.pageInfo) {
        url += `pageNumber=${options.pageInfo.pageNumber}&pageSize=${options.pageInfo.pageSize}`;
    }
    if (options.sortInfo?.sortBy && options.sortInfo?.sortDirection) {
        url += `&sortBy=${options.sortInfo.sortBy}&sortDirection=${options.sortInfo.sortDirection}`;
    }
    
    if (!options.filterInfo?.length) {
        return url;
    }
    
    return url + `&criteria=${encodeURI(JSON.stringify(options.filterInfo))}`;
}

interface Invoice {
    id: number;
    invoiceNumber: number;
    createDate: Date;
    startPeriod: Date;
    endPeriod: Date;
    'client.name': string;
    // specialNumber: number;
    ttcAmount: number;
    // status: string;
}

interface InvoiceList {
    pageInfo: {
        pageNumber: number
        totalRowCount: number
    }
    rows: Invoice[];
}

export function getInvoiceList(options: apiOptions | undefined): Promise<InvoiceList> {
    return _axios.get(formURL(INVOICES_API, options))
        .then((response) => {
            console.log('Api invoices data', response.data);
            const pageInfo = {totalRowCount: response.data.totalElements, pageNumber: response.data.pageable.pageNumber};
            const invoices = response.data.content.map((invoice: any) => ({
                id: invoice.invoiceNumber,
                invoiceNumber: invoice.invoiceNumber,
                createDate: new Date(invoice.creationDate),
                startPeriod: new Date(invoice.startPeriod),
                endPeriod: new Date(invoice.endPeriod),
                'client.name': invoice.client.name,
                // specialNumber: invoice.specialNumber,
                ttcAmount: invoice.ttcAmount,
                // status: invoice.status
            }));
            return { pageInfo: pageInfo, rows: invoices };
        })
        .catch((error) => {
            console.log(error);
            return {pageInfo: {pageNumber: 0, totalRowCount: 0}, rows: []};
        });
}

interface Clients {
    id: number;
    'clientReference.reference': number;
    name: string;
    address: string;
    defaultSubscription: number;
}

interface ClientsList {
    pageInfo: {
        pageNumber: number
        totalRowCount: number
    }
    rows: Clients[];
}

export function getClientsList(options: apiOptions | undefined): Promise<ClientsList> {    
    return _axios.get(formURL(CLIENTS_API, options))
        .then((response) => {
            console.log('Api clients data', response.data);
            const pageInfo = {totalRowCount: response.data.totalElements, pageNumber: response.data.pageable.pageNumber};
            const clients = response.data.content.map((client: any) => ({
                id: client.id,
                'clientReference.reference': client.clientReference.reference,
                name: client.name,
                address: client.address,
                defaultSubscription: client.defaultSubscription
            }));
            return { pageInfo: pageInfo, rows: clients };
        })
        .catch((error) => {
            console.log(error);
            return {pageInfo: {pageNumber: 0, totalRowCount: 0}, rows: []};
        });
}


export const handleUploadInvoices = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("uploaded file");

    if (!event.target.files?.length) {
        console.warn("no file uploaded");
        return;
    }

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    _axios.post(PUT_INVOICES_API, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}