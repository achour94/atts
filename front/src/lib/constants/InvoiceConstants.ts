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
    INVOICE_HTAMOUNT = 'httAmount',
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
    CDR_NATIONAUX = "CDR Nationaux",
    CDR_INTERNATIONAUX = "CDR Internationaux",
    CDR_SVA_A = "CDR SVA A",
    CDR_SVA_B = "CDR SVA B",
    CDR_SVA_D = "CDR SVA D",
    ABONNEMENT_PERIODIQUE = "Abonnement périodique",
}
