import { GridSortModel } from "@mui/x-data-grid";
import _axios from "./axios";

const BASE_URL = "http://localhost:8081";
const INVOICES_API = `${BASE_URL}/api/invoice/`;

interface apiOptions {
    pageInfo: {
        pageNumber: number;
        pageSize: number;
    },
    filterInfo?: Array<any>
    sortInfo?: GridSortModel
}

interface Invoice {
    id: number;
    invoiceNumber: number;
    issueDate: Date;
    startDate: Date;
    endDate: Date;
    clientName: string;
    // specialNumber: number;
    ttc: number;
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
    const filters = options ? Object.assign({}, ...(options.filterInfo || [])) : {};

    return _axios.get(INVOICES_API, {
        params: {
            ...options?.pageInfo,
            ...options?.sortInfo,
            ...filters, 
        }
    })
        .then((response) => {
            console.log('Api invoices data', response.data);
            const pageInfo = {totalRowCount: response.data.totalElements, pageNumber: response.data.pageable.pageNumber};
            const invoices = response.data.content.map((invoice: any) => ({
                id: invoice.invoiceNumber,
                invoiceNumber: invoice.invoiceNumber,
                issueDate: invoice.creationDate,
                startDate: invoice.startPeriod,
                endDate: invoice.endPeriod,
                clientName: invoice.client.name,
                // specialNumber: invoice.specialNumber,
                ttc: invoice.ttcAmount,
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
    clientReference: number;
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
    const filters = options ? Object.assign({}, ...(options.filterInfo || [])) : {};
    
    return _axios.get(INVOICES_API, {
        params: {
            ...options?.pageInfo,
            ...options?.sortInfo,
            ...filters, 
        }
    })
        .then((response) => {
            console.log('Api clients data', response.data);
            const pageInfo = {totalRowCount: response.data.totalElements, pageNumber: response.data.pageable.pageNumber};
            const clients = response.data.content.map((client: any) => ({
                id: client.id,
                clientReference: client.clientReference,
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
