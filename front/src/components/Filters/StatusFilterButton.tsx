import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import { ClickAwayListener, Grid, MenuItem, MenuList, Typography } from "@mui/material";
import {  FilterAltOutlined } from "@mui/icons-material";
import { InvoiceStatus } from "../../lib/constants/InvoiceConstants";
import { getInvoiceStatusColor, getInvoiceStatusLabel } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { selectInvoicesStatusFilter, setStatusFilter } from "../../features/invoices/invoiceSlice";


export default function StatusFilterButton() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const invoiceStatusFilter = useSelector(selectInvoicesStatusFilter)

  const options = useMemo(() => Object.values(InvoiceStatus), []);

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    const status = options[index];
    console.log(status);
    dispatch(setStatusFilter(status));
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup
        variant={"outlined"}
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
          startIcon={<FilterAltOutlined  />}
          endIcon={<ArrowDropDownIcon />}
          sx={{
            borderRadius: "2rem",
            px: "1rem",
            textTransform: "none",
            // py: "0.5rem"
          }}
          size="small"
        >
          Statut : <Typography sx={{ fontWeight: "bold", pl: 1, fontSize: '0.8rem', color: getInvoiceStatusColor(invoiceStatusFilter)[1] }}>{getInvoiceStatusLabel(invoiceStatusFilter)}</Typography>
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 5,
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
            <Paper sx={{backgroundColor: "#FFF" }}>
            <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      disabled={option === invoiceStatusFilter}
                      selected={option === invoiceStatusFilter}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {getInvoiceStatusLabel(option)}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}
