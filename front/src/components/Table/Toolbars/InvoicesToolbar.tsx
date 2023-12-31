import { GridToolbarColumnsButton, GridToolbarContainer } from "@mui/x-data-grid";
import React from "react";
import CachedIcon from '@mui/icons-material/Cached';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Popover from '@mui/material/Popover';
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Badge from '@mui/material/Badge';
import MultiColumnFilter, { ColumnsFileds } from "../MultiColumnFilter/MultiColumnFilter";
import { FilterModelItem } from "../MultiColumnFilter/FilterItem";
import { useTranslation } from "react-i18next";

interface InvoiceToolbarProps {
    filterModel: Array<FilterModelItem>;
    currentFilters?: Array<ColumnsFileds>;
    setCurrentFilters: Function;
    refreshData: Function;
}

export default function InvoiceToolbar(props: InvoiceToolbarProps) {
    const { t } = useTranslation();
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
            <Badge badgeContent={props.currentFilters?.filter(f => f.column && f.operator && f.value).length} color="primary">
                <Button onClick={handleClick} variant="text" startIcon={<FilterAltIcon/>}>
                    { t("multi_column_filter_button") }
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

            <IconButton color="primary" aria-label="upload picture" component="span" onClick={() => props.refreshData()}>
                <CachedIcon />
            </IconButton>
        </GridToolbarContainer>
    );
}
