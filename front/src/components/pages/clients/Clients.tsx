import React from "react";
import Box from "@mui/material/Box";
import GenericDataTable from "../../Table/GenericDataTable";
import { getClientsList } from "../../../services/actions";
import { CLIENTS_DATA } from "../../Table/structures/ClientsTableStructure";
import { useTranslation } from "react-i18next";
import ClientsToolbar from "../../Table/Toolbars/ClientsToolbar";
import { FilterModelItem } from "../../Table/MultiColumnFilter/FilterItem";

export default function Clients(props: any) {
    const { t } = useTranslation();
    const data = CLIENTS_DATA(t);
    const filterModel: Array<FilterModelItem> = data.columns.filter(item => item.filterOperators).map((item: any) => {
        return {
            column: item.field,
            headerName: item.headerName,
            operators: item.filterOperators,
        };
    });

    return (
        <Box
            sx={{
                flexGrow: 1, bgcolor: 'background.default', p: 3, position: 'relative',
                left: '290px', width: 'calc(100% - 290px)', height: '100vh'
            }}>
            <GenericDataTable
                componentName={"table"}
                getItemsFunction={getClientsList}
                columns={data.columns}
                width="100%"
                height="90%"
                toolbar={ClientsToolbar}
                toolbarProps={{filterModel: filterModel}}
            ></GenericDataTable></Box>
    );
}
