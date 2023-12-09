import React from 'react';
import Stack from '@mui/material/Stack';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

export interface FilterModelItem {
    column: string;
    headerName: string;
    operators: Array<string>;
}

export interface FilterItemProps {
    index: number;
    model: Array<FilterModelItem>;
    chosenColumn?: string;
    chosenOperator?: string;
    values?: Array<string | number | Date>;
    updateFilter: Function;
    deleteFilter: Function;
}

export default function FilterItem(props: FilterItemProps) {
    const [chosenColumn, setChosenColumn] = React.useState(props.chosenColumn);
    const [chosenOperator, setChosenOperator] = React.useState(props.chosenOperator);
    const [values, setValues] = React.useState(props.values);

    React.useEffect(() => {
        setChosenColumn(props.chosenColumn);
        setChosenOperator(props.chosenOperator);
        setValues(props.values);
    }, [props]);

    const handleColumnChange = (event: SelectChangeEvent) => {
        setChosenColumn(event.target.value);
        props.updateFilter({ column: event.target.value }, props.index);
    };

    const handleOperatorChange = (event: SelectChangeEvent) => {
        setChosenOperator(event.target.value);
        props.updateFilter({ operator: event.target.value }, props.index);
    };

    const handleValueChange = (event: any, index: number) => {
        const oldValues = values || [];

        if (oldValues.length > index) {
            oldValues[index] = event.target.value;
        } else {
            oldValues.push(event.target.value);
        }

        setValues(oldValues);
        props.updateFilter({ values: oldValues }, props.index);
    };

    const handleClear = () => {
        props.deleteFilter(props.index);
        setChosenColumn('');
        setChosenOperator('');
        setValues([]);
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
                            <MenuItem key={index} value={item.column}>{item.headerName}</MenuItem>
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
                    props.model.find(item => item.column === chosenColumn)?.operators.map((operator: string, index: number) => {
                        return (
                            <MenuItem key={index} value={operator}>{operator}</MenuItem>
                        );
                    })
                }
            </Select>
            {
                chosenOperator === "between" ? (
                    <Stack direction="row">
                        <TextField
                            variant='standard'
                            defaultValue={props.values?.[0]}
                            value={values?.[0] ?? ''}
                            onChange={(e) => handleValueChange(e, 0)}
                        />
                        <TextField
                            variant='standard'
                            defaultValue={props.values?.[1]}
                            value={values?.[1] ?? ''}
                            onChange={(e) => handleValueChange(e, 1)} />

                    </Stack>) : (
                    <TextField
                        variant='standard'
                        defaultValue={props.values?.[0]}
                        value={values?.[0] ?? ''}
                        onChange={(e) => handleValueChange(e, 0)}
                    />
                )
            }
            <IconButton onClick={handleClear}>
                <CloseIcon />
            </IconButton>
        </Stack>
    );
}
