import { ClientConstants as CC } from '../constants/ClientConstants';

export interface ISubscrpition {
    [CC.CLIENT_SUBSCRIPTION_ID]?: number;
    [CC.CLIENT_SUBSCRIPTION_NAME]: string;
    [CC.CLIENT_SUBSCRIPTION_DATA]: string;
    [CC.CLIENT_SUBSCRIPTION_PRICE]: number;
}

export interface IClient {
    [CC.CLIENT_ID]?: number;
    [CC.CLIENT_CLIENTREFERENCE]: string;
    [CC.CLIENT_DEFAULTSUBSCRIPTION]: number;
    [CC.CLIENT_DIVERSESUBSCRIPTION]: number;
    [CC.CLIENT_POSTALCODE]: string;
    [CC.CLIENT_ACTIVEDIVERSE]: boolean;
    [CC.CLIENT_NAME]: string;
    [CC.CLIENT_ADDRESS]: string;
    [CC.CLIENT_EMAIL]: string;
    [CC.CLIENT_SUBSCRIPTIONS]: ISubscrpition[];
}
