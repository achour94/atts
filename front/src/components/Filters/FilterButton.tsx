import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import { Box, Grid } from "@mui/material";
import FilterItem from "./FilterItem";
import { AddOutlined, FilterAltOutlined } from "@mui/icons-material";
import { Filter, IFilterOptions } from "../../lib/constants/utilsConstants";
import { SubmitHandler, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const filterSchema = yup.object().shape({
  column: yup.string().required("Champ requis"),
  operator: yup.string().required("Opérateur requis"),
  value: yup.string().required("Valeur requise"),
});

const filterFormSchema = yup.object().shape({
  filters: yup.array().of(filterSchema),
});

interface IFilterButtonProps {
  filters: Filter[];
  filtersOptions: IFilterOptions[];
  applyFilters: (filters: Filter[]) => void;
  resetFilters: () => void;
}

export default function FilterButton({
  filters,
  applyFilters,
  resetFilters,
  filtersOptions,
}: IFilterButtonProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const methods = useForm({
    resolver: yupResolver(filterFormSchema),
    defaultValues: {
      filters: filters as any,
    },
  });

  const handleToggle = () => {
    methods.reset({
      filters: filters as any,
    });
    setOpen((prevOpen) => !prevOpen);
  };

  const { watch, setValue, handleSubmit, reset } = methods;
  const watchedFilters = watch("filters"); // Watch the filters array

  const addFilterHandler = () => {
    const oldFilters = watchedFilters || [];
    setValue("filters", [
      ...oldFilters,
      { column: "", operator: "", value: "" },
    ]);
  };

  const deleteFilterHandler = (index: number) => {
    const oldFilters = watchedFilters || [];
    const newFilters = oldFilters.filter((_, i) => i !== index);
    setValue("filters", [...newFilters]);

    // Trigger validation after updating the field
    methods.trigger("filters");
  };

  const onSubmit: SubmitHandler<any> = (data) => {
    console.log(data);
    const filters = data.filters;
    applyFilters(filters);
    setOpen(false);
  };

  const resetFiltersHandler = () => {
    reset({
      filters: [],
    });
    resetFilters();
    setOpen(false);
  };
  useEffect(() => {
    console.log("form values", methods.getValues());
  }, [methods.getValues()]);

  return (
    <React.Fragment>
      <ButtonGroup
        variant={watchedFilters?.length ? "contained" : "outlined"}
        ref={anchorRef}
        aria-label="split button"
        size="small"
        sx={{
            boxShadow: "none"
        }}
      >
        <Button
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
          startIcon={<FilterAltOutlined />}
          endIcon={<ArrowDropDownIcon />}
          sx={{
            borderRadius: "2rem",
            px: "1rem",
            textTransform: "none",
            // py: "0.5rem"
          }}
          size="small"
        >
          Filtres
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 5,
          minWidth: 400,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement="bottom-start"
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper sx={{ width: "100%", p: 1, backgroundColor: "#FFF" }}>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box id="split-button-menu" sx={{ width: "100%" }}>
                    <Grid
                      container
                      sx={{
                        width: "100%",
                        flexDirection: "column",
                      }}
                      spacing={1}
                    >
                      {methods.getValues().filters?.map((filter, index) => (
                        <Grid item key={index} mt={1}>
                          <FilterItem
                            filtersOptions={filtersOptions}
                            index={index}
                            deleteFilter={deleteFilterHandler}
                          />
                        </Grid>
                      ))}
                    </Grid>
                    {/* filters actions */}
                    <Grid
                      container
                      sx={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                      spacing={1}
                    >
                      <Grid item xs={2}>
                        <Button
                          variant="text"
                          size="small"
                          startIcon={<AddOutlined />}
                          onClick={addFilterHandler}
                        >
                          Ajouter
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="text"
                          size="small"
                          sx={{ mr: 1 }}
                          type="submit"
                          disabled={!!methods.formState.errors.filters}
                        >
                          Appliquer
                        </Button>
                        <Button
                          variant="text"
                          size="small"
                          onClick={resetFiltersHandler}
                        >
                          Réinitialiser
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </form>
              </FormProvider>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}
