export enum InvoiceConstants {
    CONSUMPTION_ID = 'consumptionId',
    CONSUMPTION_COUNT = 'consumptionCount',
    CONSUMPTION_DURATION = 'consumptionDuration',
    CONSUMPTION_ENDDATE = 'endDate',
    CONSUMPTION_HTAMOUNT = 'htAmount',
    CONSUMPTION_STARTDATE = 'startDate',
    CONSUMPTION_TYPE = 'type',
    INVOICE_CREATONDATE = 'creationDate',
    INVOICE_ENDPERIOD = 'endPeriod',
    INVOICE_FILEURI = 'fileUri',
    INVOICE_HTAMOUNT = 'htAmount',
    INVOICE_NUMBER = 'invoiceNumber',
    INVOICE_PROFORMA = 'proforma',
    INVOICE_STARTPERIOD = 'startPeriod',
    INVOICE_STATUS = 'status',
    INVOICE_TTCAMOUNT = 'ttcAmount',
    INVOICE_TVA = 'tva',
    INVOICE_CONSUMPTIONS = 'consumptions',
    INVOICE_CLIENT = 'client',
}

export enum InvoiceStatus {
    DRAFT = 'DRAFT',
    SHARED = 'SHARED',
}


export enum ConsumptionType {
    CDR_MOBILES = "CDR_MOBILES",
    CDR_NATIONAUX = "CDR_NATIONAUX",
    CDR_INTERNATIONAUX = "CDR_INTERNATIONAUX",
    CDR_SVA_A = "CDR_SVA_A",
    CDR_SVA_B = "CDR_SVA_B",
    CDR_SVA_D = "CDR_SVA_D",
    CDR_SVA_G = "CDR_SVA_G",
}
