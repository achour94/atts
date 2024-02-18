import { ClientConstants as CC } from '../constants/ClientConstants';
import { IUser } from './IUser';

export interface ISubscription {
    [CC.CLIENT_SUBSCRIPTION_ID]?: number;
    [CC.CLIENT_SUBSCRIPTION_NAME]: string;
    [CC.CLIENT_SUBSCRIPTION_DATA]: string;
    [CC.CLIENT_SUBSCRIPTION_PRICE]: number;
}

export interface IClient {
    [CC.CLIENT_ID]?: number;
    [CC.CLIENT_ACTIVEDIVERSE]: boolean;
    [CC.CLIENT_ADDRESS]: string;
    [CC.CLIENT_CITY]: string;
    [CC.CLIENT_CLIENTREFERENCE]: string;
    [CC.CLIENT_DEFAULTSUBSCRIPTION]: number;
    [CC.CLIENT_DIVERSESUBSCRIPTION]: number;
    [CC.CLIENT_NAME]: string;
    [CC.CLIENT_POSTALCODE]: string;
    [CC.CLIENT_SUBSCRIPTIONS]: any[];
    [CC.CLIENT_USERS]?: IUser[];
}
