import React, { FC } from "react";
import { MenuItem } from "react-pro-sidebar";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import useRole from "../../../hooks/useRole";

export interface IMenuElement {
  label: string;
  icon: JSX.Element;
  path: string;
  allowedRoles: string[];
}

const MenuElement: FC<IMenuElement> = ({ label, icon, path, allowedRoles }) => {

  const isAllowed = useRole(allowedRoles);

  if (!isAllowed) {
    return null;
  }
  
  return (
    <MenuItem icon={icon} component={<NavLink to={path} />}>
      {label}
    </MenuItem>
  );
};

export default MenuElement;
