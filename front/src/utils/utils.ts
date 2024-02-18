import { ClientConstants as CC } from "../lib/constants/ClientConstants";
import { IFilterOptions, TableColumn } from "../lib/constants/utilsConstants";
import { IClient, ISubscription } from "../lib/interfaces/IClient";
import { ConsumptionType, InvoiceConstants as IC, InvoiceStatus } from "../lib/constants/InvoiceConstants";
import { IConsumption, IInvoice, IInvoiceForm } from "../lib/interfaces/IInvoice";
import { IEmailTemplate, IUser } from "../lib/interfaces/IUser";
import { UserConstants as UC } from "../lib/constants/UserConstants";
import { EmailTemplateConstants as ET } from "../lib/constants/EmailTemplateConstants";

export const formatClientsData = (data: any): IClient[] => {
  return data.map((row: any) => {
    return formatClientData(row);
  });
};

export const formatClientData = (data: any): IClient => {
  return {
    [CC.CLIENT_ACTIVEDIVERSE]: data[CC.CLIENT_ACTIVEDIVERSE],
    [CC.CLIENT_ADDRESS]: data[CC.CLIENT_ADDRESS],
    [CC.CLIENT_CITY]: data[CC.CLIENT_CITY],
    [CC.CLIENT_CLIENTREFERENCE]: data[CC.CLIENT_CLIENTREFERENCE],
    [CC.CLIENT_DEFAULTSUBSCRIPTION]: data[CC.CLIENT_DEFAULTSUBSCRIPTION],
    [CC.CLIENT_DIVERSESUBSCRIPTION]: data[CC.CLIENT_DIVERSESUBSCRIPTION],
    [CC.CLIENT_ID]: data[CC.CLIENT_ID],
    [CC.CLIENT_NAME]: data[CC.CLIENT_NAME],
    [CC.CLIENT_POSTALCODE]: data[CC.CLIENT_POSTALCODE] || null,
    [CC.CLIENT_SUBSCRIPTIONS]: formatClientSubscriptionsData(
      data[CC.CLIENT_SUBSCRIPTIONS]
    ),
    [CC.CLIENT_USERS]: formatClientUsersData(data[CC.CLIENT_USERS]),
  };
};

export const formatClientUserData = (data: any): IUser => {
  return {
    [UC.USER_ID]: data[UC.USER_ID],
    [UC.USER_FIRSTNAME]: data[UC.USER_FIRSTNAME],
    [UC.USER_LASTNAME]: data[UC.USER_LASTNAME],
    [UC.USER_EMAIL]: data[UC.USER_EMAIL],
    // [UC.USER_ROLES]: data[UC.USER_ROLES],
    [UC.USER_PHONE]: data[UC.USER_PHONE],
    // [UC.USER_EMAILTEMPLATES]: data[UC.USER_EMAILTEMPLATES],
  }
}

export const formatClientUsersData = (data: any): IUser[] => {
  // if (!data || data.length === 0) return [createEmptyClientUser()];
  return data.map((row: any) => {
    return formatClientUserData(row);
  });
};

export const formatMailTemplateData = (data: any): IEmailTemplate => {
  return {
    [ET.EMAILTEMPLATE_ID]: data[ET.EMAILTEMPLATE_ID],
    [ET.EMAILTEMPLATE_NAME]: data[ET.EMAILTEMPLATE_NAME],
    [ET.EMAILTEMPLATE_CONTENT]: data[ET.EMAILTEMPLATE_CONTENT],
  }
}

export const createEmptyClientUser = (): IUser => {
  return {
    [UC.USER_FIRSTNAME]: '',
    [UC.USER_LASTNAME]: '',
    [UC.USER_EMAIL]: '',
    [UC.USER_PHONE]: '',
  }
}


export const formatClientSubscriptionData = (data: any): ISubscription => {
  return {
    [CC.CLIENT_SUBSCRIPTION_ID]: data?.id,
    [CC.CLIENT_SUBSCRIPTION_NAME]: data?.name,
    [CC.CLIENT_SUBSCRIPTION_DATA]: data[CC.CLIENT_SUBSCRIPTION_DATA],
    [CC.CLIENT_SUBSCRIPTION_PRICE]: data[CC.CLIENT_SUBSCRIPTION_PRICE],
  };
};

export const formatClientSubscriptionsData = (data: any): ISubscription[] => {
  return data.map((row: any) => {
    return formatClientSubscriptionData(row);
  });
};

export const getFiltersOptionsFromColumns = (
  columns: TableColumn[]
): IFilterOptions[] => {
  return columns
    .filter(
      (column): column is Required<TableColumn> =>
        column.filterOperators !== undefined && column.columnType !== undefined
    )
    .map((column) => {
      return {
        column: column.field,
        columnLabel: column.label || column.field,
        columnType: column.columnType, // Now guaranteed to be defined
        filterOperators: column.filterOperators, // Now guaranteed to be defined
      };
    });
};

export const formatConsumptionData = (data: any): IConsumption => {
  return {
    [IC.CONSUMPTION_COUNT]: data[IC.CONSUMPTION_COUNT],
    [IC.CONSUMPTION_DURATION]: data[IC.CONSUMPTION_DURATION],
    [IC.CONSUMPTION_ENDDATE]: data[IC.CONSUMPTION_ENDDATE],
    [IC.CONSUMPTION_HTAMOUNT]: data[IC.CONSUMPTION_HTAMOUNT],
    [IC.CONSUMPTION_ID]: data?.[IC.CONSUMPTION_ID],
    [IC.CONSUMPTION_STARTDATE]: data[IC.CONSUMPTION_STARTDATE],
    [IC.CONSUMPTION_TYPE]: data[IC.CONSUMPTION_TYPE],
  };
};

export const formatConsumptionsData = (data: any): IConsumption[] => {
  return data.map((row: any) => {
    return formatConsumptionData(row);
  });
};

export const formatInvoiceData = (data: any): IInvoice => {
  return {
    [IC.INVOICE_CREATONDATE]: data[IC.INVOICE_CREATONDATE],
    [IC.INVOICE_ENDPERIOD]: data[IC.INVOICE_ENDPERIOD],
    [IC.INVOICE_FILEURI]: data[IC.INVOICE_FILEURI],
    [IC.INVOICE_HTAMOUNT]: data[IC.INVOICE_HTAMOUNT],
    [IC.INVOICE_NUMBER]: data[IC.INVOICE_NUMBER],
    [IC.INVOICE_PROFORMA]: data[IC.INVOICE_PROFORMA],
    [IC.INVOICE_STARTPERIOD]: data[IC.INVOICE_STARTPERIOD],
    [IC.INVOICE_STATUS]: data[IC.INVOICE_STATUS],
    [IC.INVOICE_TTCAMOUNT]: data[IC.INVOICE_TTCAMOUNT],
    [IC.INVOICE_TVA]: data[IC.INVOICE_TVA],
    [IC.INVOICE_CONSUMPTIONS]: formatConsumptionsData(
      data[IC.INVOICE_CONSUMPTIONS]
    ),
    [IC.INVOICE_CLIENT]: formatClientData(data[IC.INVOICE_CLIENT]),
  };
};

export const formatDataToInvoiceForm = (data: any): IInvoiceForm => {
  const invoiceData = formatInvoiceData(data);
  // Create a copy of invoiceData without the IC.INVOICE_CLIENT field
  const { [IC.INVOICE_CLIENT]: _, ...invoiceFormData } = invoiceData;
  return invoiceFormData as IInvoiceForm;
};

export const formatInvoicesData = (data: any): IInvoice[] => {
  return data.map((row: any) => {
    return formatInvoiceData(row);
  });
};

export function formatTimestampToFrenchDate(timestamp: number, monthStyle: "2-digit" | "numeric" | "long" | "short" | "narrow" | undefined = 'short'): string {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: monthStyle,
    year: "numeric",
  };
  const dateFormatter = new Intl.DateTimeFormat("fr-FR", options);
  let formattedDate = dateFormatter.format(date);

  // Split the date to get the month and capitalize its first letter
  const dateParts = formattedDate.split(" ");
  dateParts[1] =
    dateParts[1].charAt(0).toUpperCase() +
    dateParts[1].slice(1).replace(/\./g, "");

  // Reassemble the date
  formattedDate = dateParts.join(" ");
  return formattedDate;
}

export function formatNumberToEuro(value: number, digits: number = 2): string {
  return `${value.toFixed(digits).replace('.', ',')} €`;
}

export function formatSeconds(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

export function getInvoiceStatusLabel (status: InvoiceStatus): string {
  switch (status) {
    case InvoiceStatus.DRAFT:
      return 'Brouillon';
    case InvoiceStatus.SHARED:
      return 'Partagée';
    default:
      return '';
  }
}

// Returns a tuple containing the background color and the text color [backgroundColor, textColor]
export function getInvoiceStatusColor (status: InvoiceStatus): [string, string] {
  switch (status) {
    case InvoiceStatus.DRAFT:
      return ['#FFE8CE', '#EE7F01'];
    case InvoiceStatus.SHARED:
      return ['#E1FFDC', '#07A104'];
    default:
      return ['', ''];
  }
}

export function getConsumptionTypeLabel(typeId: ConsumptionType): string {
  switch (typeId) {
      case ConsumptionType.CDR_MOBILES:
          return "CDR Mobiles";
      case ConsumptionType.CDR_NATIONAUX:
          return "CDR Nationaux";
      case ConsumptionType.CDR_INTERNATIONAUX:
          return "CDR Internationaux";
      case ConsumptionType.CDR_SVA_A:
          return "CDR SVA A";
      case ConsumptionType.CDR_SVA_B:
          return "CDR SVA B";
      case ConsumptionType.CDR_SVA_D:
          return "CDR SVA D";
      case ConsumptionType.CDR_SVA_G:
          return "CDR_SVA_G";
      default:
          return "Unknown Type";
  }
}

/**
 * Triggers a download of a PDF file from a blob.
 * @param blob - The blob containing the PDF data.
 * @param filename - The name of the file to be downloaded.
 */
export const downloadFile = (blob: Blob, filename: string): void => {
  // Create a URL for the blob
  const url = window.URL.createObjectURL(blob);

  // Create a temporary link element
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;

  // Append the link to the body, click it, and then remove it
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};

// export const downloadZip = (blob: Blob, filename: string): void => {
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href =
//     url;
//   a.download = filename;
//   document.body.appendChild(a);
//   a.click();
//   window.URL.revokeObjectURL(url);
//   a.remove();
// }

/** 
 * check if an invoice have consumptions of type CDR_SVA_A, CDR_SVA_B, CDR_SVA_D or CDR_SVA_G
 * and if it's the case, calculate the total amount of these consumptions and check if it's greater than 0
 * @param invoice - The invoice to check
 * @returns true if the invoice has SVA consumptions and the total amount is greater than 0, false otherwise
 * */
export const hasSVAConsumptions = (invoice: IInvoice): boolean => {
  const svaConsumptions = invoice?.[IC.INVOICE_CONSUMPTIONS]?.filter(consumption => {
    return [ConsumptionType.CDR_SVA_A, ConsumptionType.CDR_SVA_B, ConsumptionType.CDR_SVA_D, ConsumptionType.CDR_SVA_G].includes(consumption?.[IC.CONSUMPTION_TYPE] as ConsumptionType);
  });
  const totalSVAConsumptionsAmount = svaConsumptions.reduce((acc, consumption) => acc + consumption?.[IC.CONSUMPTION_HTAMOUNT], 0);
  return totalSVAConsumptionsAmount > 0;
}
