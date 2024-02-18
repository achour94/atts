import { CloseOutlined } from "@mui/icons-material";
import {
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import {
  ColumnType,
  Filter,
  FilterType,
  FilterTypeLabel,
  IFilterOptions,
} from "../../lib/constants/utilsConstants";
import {
  Controller,
  FieldError,
  FieldValues,
  useFormContext,
  useWatch,
} from "react-hook-form";
import MuiSelect from "../Form/MuiSelect";
import MuiDatePicker from "../Form/MuiDatePicker";
import { fi } from "date-fns/locale";

interface IFilterItemProps {
  filter: Filter;
  filtersOptions: IFilterOptions[];
  deleteFilter: (index: number) => void;
  index: number;
}

function FilterItem({ filtersOptions, deleteFilter, index }: IFilterItemProps) {
  const { watch, getValues, control } = useFormContext();

  const filters = useWatch({ control, name: "filters" });
  const filter = useWatch({ control, name: `filters.${index}` });

  const shouldDisableOperator = (column: string, operator: string) => {
    // check if we already have a filter with the same column and operator
    const filter = filters.find(
      (filter: Filter) =>
        filter.column === column && filter.operator === operator
    );
    return !!filter;
  };

  const getColumnType = (): ColumnType => {
    const column = filtersOptions.find(
      (filterOption) => filterOption.column === filter.column
    );
    return column?.columnType || ColumnType.TEXT;
  };

  const getValueField = (
    field: FieldValues,
    error: FieldError | undefined
  ): JSX.Element => {
    switch (getColumnType()) {
      case ColumnType.TEXT:
        return (
          <TextField
            variant="outlined"
            label="Valeur"
            size="small"
            {...field}
            error={!!error}
            helperText={error ? error.message : null}
            disabled={filter?.operator === ""}
          />
        );
      case ColumnType.NUMBER:
        return (
          <TextField
            type="number"
            InputProps={{
              inputProps: { min: 0, step: "0.01" },
            }}
            variant="outlined"
            label="Valeur"
            size="small"
            {...field}
            error={!!error}
            helperText={error ? error.message : null}
            disabled={filter?.operator === ""}
          />
        );
      case ColumnType.DATE:
        return (
          <MuiDatePicker
            field={field}
            error={error}
            label="Valeur"
            disabled={filter?.operator === ""}
          />
        );
      case ColumnType.BOOLEAN:
        return (
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-helper-label">Valeur</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              {...field}
              label="Valeur"
              disabled={filter?.operator === ""}
              error={!!error}
              size="small"
              fullWidth
            >
              <MenuItem value="true">Oui</MenuItem>
              <MenuItem value="false">Non</MenuItem>
            </Select>
            <FormHelperText sx={{ color: "red" }}>
              {error ? error.message : null}
            </FormHelperText>
          </FormControl>
        );
      default:
        return (
          <TextField
            variant="outlined"
            label="Valeur"
            size="small"
            {...field}
            error={!!error}
            helperText={error ? error.message : null}
            disabled={filter?.operator === ""}
          />
        );
    }
  };

  return (
    <Grid container spacing={2} pr={1} sx={{ flexWrap: "nowrap" }}>
      {/* filter */}
      <Grid item flexGrow={1}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <MuiSelect
              name={`filters.${index}.column`}
              label="Colonne"
              placeholder="Colonne"
              size="small"
            >
              {filtersOptions.map(
                (filterOption: IFilterOptions, index: number) => {
                  return (
                    <MenuItem key={index} value={filterOption.column}>
                      {filterOption.columnLabel}
                    </MenuItem>
                  );
                }
              )}
            </MuiSelect>
          </Grid>
          <Grid item xs={4}>
            <MuiSelect
              name={`filters.${index}.operator`}
              label="Opérateur"
              placeholder="Opérateur"
              disabled={filter?.column === ""}
              size="small"
            >
              {filtersOptions
                .find((filterOption) => filterOption.column === filter?.column)
                ?.filterOperators.map((operator: FilterType, index: number) => {
                  return (
                    <MenuItem
                      key={index}
                      value={operator}
                      disabled={shouldDisableOperator(filter?.column, operator)}
                    >
                      {FilterTypeLabel[operator]}
                    </MenuItem>
                  );
                })}
            </MuiSelect>
          </Grid>
          <Grid item xs={4}>
            <Controller
              name={`filters.${index}.value`}
              control={control}
              render={({ field, fieldState: { error } }) =>
                getValueField(field, error)
              }
            />
          </Grid>
        </Grid>
      </Grid>
      {/* filter delete */}
      <Grid item xs={1}>
        <IconButton aria-label="delete" onClick={() => deleteFilter(index)}>
          <CloseOutlined />
        </IconButton>
      </Grid>
    </Grid>
  );
}

export default FilterItem;
