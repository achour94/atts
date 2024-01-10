import { InvoiceConstants as IC } from "../constants/InvoiceConstants";
import { IClient } from "./IClient";

export interface IConsumption {
    [IC.CONSUMPTION_COUNT]: number;
    [IC.CONSUMPTION_DURATION]: number;
    [IC.CONSUMPTION_ENDDATE]: number;
    [IC.CONSUMPTION_HTAMOUNT]: number;
    [IC.CONSUMPTION_ID]?: number | undefined;
    [IC.CONSUMPTION_STARTDATE]: number;
    [IC.CONSUMPTION_TYPE]: string;
}

export interface IInvoice {
    [IC.INVOICE_CREATONDATE]: number;
    [IC.INVOICE_ENDPERIOD]: number;
    [IC.INVOICE_FILEURI]: string | null;
    [IC.INVOICE_HTAMOUNT]: number;
    [IC.INVOICE_NUMBER]: number;
    [IC.INVOICE_PROFORMA]: boolean;
    [IC.INVOICE_STARTPERIOD]: number;
    [IC.INVOICE_STATUS]: string;
    [IC.INVOICE_TTCAMOUNT]: number;
    [IC.INVOICE_TVA]: number;
    [IC.INVOICE_CONSUMPTIONS]: IConsumption[];
    [IC.INVOICE_CLIENT]: IClient;
}

export interface IInvoiceForm extends Omit<IInvoice, typeof IC.INVOICE_CLIENT> {
    // You can add additional properties specific to the form if needed
}