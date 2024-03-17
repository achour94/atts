import { HistoryConstants as HC } from "../constants/HistoryConstants";

export interface IHistory {
    [HC.HISTORY_ID]?: number;
    [HC.HISTORY_CREATEDAT]: number;
    [HC.HISTORY_SOURCE]: string;
    [HC.HISTORY_LEVEL]: string;
    [HC.HISTORY_MESSAGE]: string;
}