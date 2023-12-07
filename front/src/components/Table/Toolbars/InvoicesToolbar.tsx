import { GridToolbarColumnsButton, GridToolbarContainer } from "@mui/x-data-grid";
import React from "react";
import CachedIcon from '@mui/icons-material/Cached';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Popover from '@mui/material/Popover';
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Badge from '@mui/material/Badge';
import MultiColumnFilter, { ColumnsFileds } from "../MultiColumnFilter";
import { FilterModelItem } from "../FilterItem";

interface InvoiceToolbarProps {
    filterModel: Array<FilterModelItem>;
    currentFilters?: Array<ColumnsFileds>;
    setCurrentFilters: Function;
}

export default function InvoiceToolbar(props: InvoiceToolbarProps) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const popoverId = open ? 'invoice-filter-popover' : undefined;

    return (
        <GridToolbarContainer>
            <Badge badgeContent={props.currentFilters?.filter(f => f.column && f.operator && f.values?.length).length} color="primary">
                <Button onClick={handleClick} variant="text" startIcon={<FilterAltIcon/>}>
                    Filter by
                </Button>
            </Badge>
            
            <Popover
                id={popoverId}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
            >
                <MultiColumnFilter 
                    filterModel={props.filterModel} 
                    currentFilters={props.currentFilters} 
                    setCurrentFilters={props.setCurrentFilters} />
            </Popover>

            <GridToolbarColumnsButton />

            <IconButton color="primary" aria-label="upload picture" component="span">
                <CachedIcon />
            </IconButton>
        </GridToolbarContainer>
    );
}

// export const ClientsToolbar = React.forwardRef<
//   HTMLDivElement,
//   GridToolbarContainerProps
// >(function GridToolbar(props, ref) {
//   const { className, ...other } = props;
//   const rootProps = useGridRootProps();

//   // if (
//   //   rootProps.disableColumnFilter &&
//   //   rootProps.disableColumnSelector &&
//   //   rootProps.disableDensitySelector
//   // ) {
//   //   return null;
//   // }

//   return (
//     <GridToolbarContainer ref={ref} {...other}>
//       <MultiColumnFilter />
//       <GridToolbarColumnsButton />
//       <IconButton>
//         <CachedIcon/>
//       </IconButton>
//     </GridToolbarContainer>
//   );
// });