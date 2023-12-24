import { ClientConstants as CC } from "../lib/constants/ClientConstants";
import { IFilterOptions, TableColumn } from "../lib/constants/utilsConstants";
import { IClient, ISubscription } from "../lib/interfaces/IClient";

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
    [CC.CLIENT_EMAIL]: data[CC.CLIENT_EMAIL],
    [CC.CLIENT_ID]: data[CC.CLIENT_ID],
    [CC.CLIENT_NAME]: data[CC.CLIENT_NAME],
    [CC.CLIENT_PHONE]: data[CC.CLIENT_PHONE],
    [CC.CLIENT_POSTALCODE]: data[CC.CLIENT_POSTALCODE],
    [CC.CLIENT_SUBSCRIPTIONS]: formatClientSubscriptionsData(data[CC.CLIENT_SUBSCRIPTIONS]),
    // [CC.CLIENT_USERS]: data[CC.CLIENT_USERS],
  };
}

export const formatClientSubscriptionData = (data: any): ISubscription => {
  return {
    [CC.CLIENT_SUBSCRIPTION_ID]: data?.id,
    [CC.CLIENT_SUBSCRIPTION_NAME]: data?.name,
    [CC.CLIENT_SUBSCRIPTION_DATA]: data[CC.CLIENT_SUBSCRIPTION_DATA],
    [CC.CLIENT_SUBSCRIPTION_PRICE]: data[CC.CLIENT_SUBSCRIPTION_PRICE],
  };
}

export const formatClientSubscriptionsData = (data: any): ISubscription[] => {
  return data.map((row: any) => {
    return formatClientSubscriptionData(row);
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
