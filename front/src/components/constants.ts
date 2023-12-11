export const FILTER_CONSTANTS = {
    euqals: "equals",
    notEqual: "not equal",
    min: "min",
    max: "max",
    contains: "contains",
    startsWith: "startsWith",
    endsWith: "endsWith",
    empty: "empty",
    notEmpty: "notEmpty",
};

export const FILTER_TYPES_NAMES = {
    STRING: "string",
    NUMBER: "number",
    DATE: "date",
};

export const FILTER_TYPES = {
    [FILTER_TYPES_NAMES.STRING]: [FILTER_CONSTANTS.euqals, FILTER_CONSTANTS.notEqual, FILTER_CONSTANTS.contains, FILTER_CONSTANTS.startsWith, FILTER_CONSTANTS.endsWith, FILTER_CONSTANTS.empty, FILTER_CONSTANTS.notEmpty],
    [FILTER_TYPES_NAMES.NUMBER]: [FILTER_CONSTANTS.euqals, FILTER_CONSTANTS.notEqual, FILTER_CONSTANTS.min, FILTER_CONSTANTS.max, FILTER_CONSTANTS.empty, FILTER_CONSTANTS.notEmpty],
    [FILTER_TYPES_NAMES.DATE]: [FILTER_CONSTANTS.euqals, FILTER_CONSTANTS.notEqual, FILTER_CONSTANTS.min, FILTER_CONSTANTS.max, FILTER_CONSTANTS.empty, FILTER_CONSTANTS.notEmpty],
};

export const ICON_FILL_COLOUR = '#157EB5';
export const EURO = '€';