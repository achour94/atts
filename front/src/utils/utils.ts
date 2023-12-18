import { Client } from "../lib/constants/ClientConstants";
import { ClientConstants as CC } from "../lib/constants/ClientConstants";
import { IFilterOptions, TableColumn } from "../lib/constants/utilsConstants";

export const formatClientsData = (data: any): Client[] => {
  return data.map((row: any) => {
    return {
      [CC.CLIENT_ACTIVEDIVERSE]: row[CC.CLIENT_ACTIVEDIVERSE],
      [CC.CLIENT_ADDRESS]: row[CC.CLIENT_ADDRESS],
      [CC.CLIENT_CITY]: row[CC.CLIENT_CITY],
      [CC.CLIENT_CLIENTREFERENCE]: row[CC.CLIENT_CLIENTREFERENCE].reference,
      [CC.CLIENT_DEFAULTSUBSCRIPTION]: row[CC.CLIENT_DEFAULTSUBSCRIPTION],
      [CC.CLIENT_EMAIL]: row[CC.CLIENT_EMAIL],
      [CC.CLIENT_ID]: row[CC.CLIENT_ID],
      [CC.CLIENT_NAME]: row[CC.CLIENT_NAME],
      [CC.CLIENT_PHONE]: row[CC.CLIENT_PHONE],
      [CC.CLIENT_POSTALCODE]: row[CC.CLIENT_POSTALCODE],
      [CC.CLIENT_SUBSCRIPTIONS]: row[CC.CLIENT_SUBSCRIPTIONS],
      [CC.CLIENT_USERS]: row[CC.CLIENT_USERS],
    };
  });
};

export const getFiltersOptionsFromColumns = (
    columns: TableColumn[]
  ): IFilterOptions[] => {
    return columns
      .filter((column): column is Required<TableColumn> => 
        column.filterOperators !== undefined && column.columnType !== undefined)
      .map((column) => {
        return {
          column: column.field,
          columnLabel: column.label || column.field,
          columnType: column.columnType, // Now guaranteed to be defined
          filterOperators: column.filterOperators, // Now guaranteed to be defined
        };
      });
  };
