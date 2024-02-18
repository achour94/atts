export interface TableColumn {
    field: string;
    label?: string;
    columnType?: ColumnType;
    filterOperators?: FilterType[];
    renderHeader?: (label?: string) => JSX.Element;
    renderCell?: (value?: any, row?: any) => JSX.Element;
    isSortable?: boolean;
}

export enum ColumnType {
    TEXT = 'text',
    NUMBER = 'number',
    DATE = 'date',
    BOOLEAN = 'boolean',
    LINK = 'link',
    SELECT = 'select',
}

export interface IFilterOptions {
    column: string;
    columnLabel: string;
    columnType: ColumnType;
    filterOperators: FilterType[];
}

export enum FetchStatus {
    IDLE = 'idle',
    LOADING = 'loading',
    SUCCESS = 'success',
    FAILED = 'failed',
}

export enum FilterType {
    STARTS_WITH = 'startsWith',
    EQUALS = 'equals',
    CONTAINS = 'contains',
    ENDS_WITH = 'endsWith',
    MIN = 'min',
    MAX = 'max',
    IS_EMPTY = 'isEmpty',
}

export enum FilterTypeLabel {
    startsWith = 'Commence par',
    equals = 'Egal à',
    contains = 'Contient',
    endsWith = 'Finit par',
    min = 'Minimum',
    max = 'Maximum',
    isEmpty = 'Est vide',
}

export const FILTER_COLUMN: string = 'column';

export enum SortDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}

export interface Pagination {
    page: number;
    pageSize: number;
    totalElements: number;
}

export type CriteriaType = Record<FilterType, string | number | boolean>;

export type Filter = {
    column: string;
    operator: FilterType | null;
    value: string | number | boolean;
};

export const enum ROLES {
    ADMIN = "admin",
    CLIENT = "client",
  }
