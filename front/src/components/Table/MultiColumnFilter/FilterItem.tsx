import React from 'react';
import Stack from '@mui/material/Stack';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { FILTER_TYPES, FILTER_TYPES_NAMES } from '../../constants';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export interface FilterModelItem {
    field: string;
    type: string;
    headerName: string;
}

export interface FilterItemProps {
    index: number;
    model: Array<FilterModelItem>;
    chosenColumn?: string;
    chosenOperator?: string;
    value?: string | number | Date;
    updateFilter: Function;
    deleteFilter: Function;
}

export default function FilterItem(props: FilterItemProps) {
    const [chosenColumn, setChosenColumn] = React.useState(props.chosenColumn);
    const [chosenOperator, setChosenOperator] = React.useState(props.chosenOperator);
    const [value, setValue] = React.useState(props.value);

    React.useEffect(() => {
        setChosenColumn(props.chosenColumn);
        setChosenOperator(props.chosenOperator);
        setValue(props.value);
    }, [props]);

    const handleColumnChange = (event: SelectChangeEvent) => {
        setChosenColumn(event.target.value);
        props.updateFilter({ column: event.target.value }, props.index);
    };

    const handleOperatorChange = (event: SelectChangeEvent) => {
        setChosenOperator(event.target.value);
        props.updateFilter({ operator: event.target.value }, props.index);
    };

    const handleValueChange = (event: any) => {
        const _value = event.target?.value ?? event.getTime() ?? '';
        setValue(_value);
        props.updateFilter({ value: _value}, props.index);
    };

    const handleClear = () => {
        props.deleteFilter(props.index);
        setChosenColumn('');
        setChosenOperator('');
        setValue(undefined);
    }

    const selectedColumn = props.model.find(item => item.field === chosenColumn);

    const operatorSelector = () => {
        if (!selectedColumn) {
            return null;
        }

        return FILTER_TYPES[selectedColumn.type].map((operator: string, index: number) => {
            return (
                <MenuItem key={index} value={operator}>{operator}</MenuItem>
            );
        })
    }

    const valueSelector = () => {
        if (!selectedColumn) {
            return <TextField
                variant='standard'
                defaultValue={props.value}
                value={value}
                onChange={handleValueChange}
            />
        }

        switch (selectedColumn.type) {
            case FILTER_TYPES_NAMES.STRING:
                return <TextField
                    variant='standard'
                    defaultValue={props.value}
                    value={value}
                    onChange={(e) => handleValueChange(e)}
                />
            case FILTER_TYPES_NAMES.NUMBER:
                return <TextField
                    variant='standard'
                    defaultValue={props.value}
                    value={value}
                    type='number'
                    onChange={(e) => handleValueChange(e)}
                />
            case FILTER_TYPES_NAMES.DATE:
                return <DatePicker onChange={(e) => handleValueChange(e)} slotProps={{ textField: {variant: "standard"}}}/>
        }
    }

    return (
        <Stack direction="row" spacing={2} sx={{
            paddingLeft: '1rem',
            paddingRight: '1rem',
            paddingTop: '0.2rem',
            alignItems: 'center'
        }}>
            <Select
                variant='standard'
                value={chosenColumn}
                onChange={handleColumnChange}
            >
                {
                    props.model.map((item: any, index: number) => {
                        return (
                            <MenuItem key={index} value={item.field}>{item.headerName}</MenuItem>
                        );
                    })
                }
            </Select>
            <Select
                variant='standard'
                value={chosenOperator}
                onChange={handleOperatorChange}
            >
                {
                    operatorSelector()
                }
            </Select>
            {
                valueSelector()
            }
            <IconButton onClick={handleClear}>
                <CloseIcon />
            </IconButton>
        </Stack>
    );
}
