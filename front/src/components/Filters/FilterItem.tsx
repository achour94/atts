import { CloseOutlined } from "@mui/icons-material";
import { Grid, IconButton, MenuItem, TextField } from "@mui/material";
import React from "react";
import {
  Filter,
  FilterType,
  FilterTypeLabel,
  IFilterOptions,
} from "../../lib/constants/utilsConstants";
import { Controller, useFormContext } from "react-hook-form";
import MuiSelect from "../Form/MuiSelect";

interface IFilterItemProps {
  filtersOptions: IFilterOptions[];
  deleteFilter: (index: number) => void;
  index: number;
}

function FilterItem({ filtersOptions, deleteFilter, index }: IFilterItemProps) {
  const { watch, getValues, control } = useFormContext();

  const columnValue = watch(`filters[${index}].column`);
  const operatorValue = watch(`filters[${index}].operator`);

  const shouldDisableOperator = (column: string, operator: string) => {
    // check if we already have a filter with the same column and operator
    const filters = getValues("filters");
    const filter = filters.find(
      (filter: Filter) =>
        filter.column === column && filter.operator === operator
    );
    return !!filter;
  };

  return (
    <Grid container spacing={2} pr={1} sx={{ flexWrap: "nowrap" }}>
      {/* filter */}
      <Grid item flexGrow={1}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <MuiSelect
              name={`filters[${index}].column`}
              label="Colonne"
              placeholder="Colonne"
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
              name={`filters[${index}].operator`}
              label="Opérateur"
              placeholder="Opérateur"
              disabled={columnValue === ""}
            >
              {filtersOptions
                .find((filterOption) => filterOption.column === columnValue)
                ?.filterOperators.map((operator: FilterType, index: number) => {
                  return (
                    <MenuItem
                      key={index}
                      value={operator}
                      disabled={shouldDisableOperator(columnValue, operator)}
                    >
                      {FilterTypeLabel[operator]}
                    </MenuItem>
                  );
                })}
            </MuiSelect>
          </Grid>
          <Grid item xs={4}>
            <Controller
              name={`filters[${index}].value`}
              control={control}
              render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { error },
              }) => (
                <TextField
                  variant="outlined"
                  label="Valeur"
                  size="small"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  inputRef={ref}
                  error={!!error}
                  helperText={error ? error.message : null}
                  disabled={operatorValue === ""}
                />
              )}
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
