import * as React from 'react';
import Box from '@mui/material/Box';
import FilterItem, { FilterModelItem } from './FilterItem';
import { Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useTranslation } from 'react-i18next';

export interface ColumnsFileds {
    column: string;
    operator: string;
    value: string | number | Date ;
}

interface MultiColumnFilterProps {
    filterModel: Array<FilterModelItem>;
    currentFilters?: Array<ColumnsFileds>;
    setCurrentFilters: Function;
}

const getEmptyFilter = (): ColumnsFileds => ({ column: '', operator: '', value: '' });

export default function MultiColumnFilter(props: MultiColumnFilterProps) {
    const { t } = useTranslation();

    const updateFilters = (filter: ColumnsFileds, idx: number) => {
        const oldFilters = props.currentFilters || [];

        if (idx < 0) {
            console.error("Invalid index in updateFilters", idx);
            return;
        }

        if (idx < oldFilters.length) {
            filter.column && (oldFilters[idx].column = filter.column);
            filter.operator && (oldFilters[idx].operator = filter.operator);
            oldFilters[idx].value = filter.value;
        } else {
            oldFilters.push(filter);
        }

        props.setCurrentFilters([...oldFilters]);
    }

    const deleteFilter = (idx: number) => {
        const oldFilters = props.currentFilters || [];

        if (idx < 0 || idx >= oldFilters.length) {
            console.error("Invalid index in deleteFilter", idx);
            return;
        }

        if (oldFilters.length === 1) {
            oldFilters[0] = { column: '', operator: '', value: '' };
        } else {
            oldFilters.splice(idx, 1);
        }

        props.setCurrentFilters([...oldFilters]);
    }

    return (
        <Box sx={{ 
            width: 600,
            height: 'auto',
            minWidth: 'min-content',
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {
                props.currentFilters?.map((item: ColumnsFileds, index: number) => {
                    return (
                        <FilterItem
                            key={index}
                            index={index}
                            model={props.filterModel}
                            chosenColumn={item.column}
                            chosenOperator={item.operator}
                            value={item.value}
                            updateFilter={updateFilters}
                            deleteFilter={deleteFilter}
                        />
                    );
                })
            }
            <Stack direction="row" spacing={10} sx={{paddingTop: '20px'}}>
                <Button
                    variant="text"
                    startIcon={<AddIcon />}
                    onClick={() => updateFilters(getEmptyFilter(), (props.currentFilters?.length ?? 0) + 1)}
                >
                    {t("multi_column_filter_add_filter")}
                </Button>
                <Button
                    variant='text'
                    startIcon={<DeleteForeverIcon />}
                    onClick={() => props.setCurrentFilters([getEmptyFilter()])}
                >
                    {t("multi_column_filter_delete_filters")}
                </Button>
            </Stack>
        </Box>
    );
}
