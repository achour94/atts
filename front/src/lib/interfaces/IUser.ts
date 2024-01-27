import { UserConstants as UC } from '../constants/UserConstants';
import { EmailTemplateConstants as ETC } from '../constants/EmailTemplateConstants';

export interface IEmailTemplate {
    [ETC.EMAILTEMPLATE_ID]?: number;
    [ETC.EMAILTEMPLATE_NAME]: string;
    [ETC.EMAILTEMPLATE_CONTENT]: string;
}

export interface IUser {
    [UC.USER_ID]?: number;
    [UC.USER_FIRSTNAME]: string;
    [UC.USER_LASTNAME]: string;
    [UC.USER_PASSWORD]?: string;
    [UC.USER_EMAIL]: string;
    [UC.USER_ROLES]?: string[];
    [UC.USER_PHONE]: string;
    [UC.USER_EMAILTEMPLATES]?: IEmailTemplate[];
}
