import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarContainerProps, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, useGridRootProps } from "@mui/x-data-grid";
import React from "react";
import InfoIcon from '@mui/icons-material/Info';
import CachedIcon from '@mui/icons-material/Cached';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export const ClientsToolbar = React.forwardRef<
  HTMLDivElement,
  GridToolbarContainerProps
>(function GridToolbar(props, ref) {
  const { className, ...other } = props;
  const rootProps = useGridRootProps();

  if (
    rootProps.disableColumnFilter &&
    rootProps.disableColumnSelector &&
    rootProps.disableDensitySelector
  ) {
    return null;
  }

  return (
    <GridToolbarContainer ref={ref} {...other}>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
});