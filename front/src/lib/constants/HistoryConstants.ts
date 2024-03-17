export enum HistoryConstants {
    HISTORY_ID = 'logId',
    HISTORY_CREATEDAT = 'createdAt',
    HISTORY_SOURCE = 'source',
    HISTORY_LEVEL = 'level',
    HISTORY_MESSAGE = 'message',
}

export enum LogSource {
    INVOICE = 'invoice',
    INVOICE_FILE_PROCESSING = 'invoice_file_processing',
    CLIENT = 'client',
    USER = 'user',
    GENERAL = 'general',
    EMAIL = 'email',
}

export enum SecurityLevel {
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info',
}
