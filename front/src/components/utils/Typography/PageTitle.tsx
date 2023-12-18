import { Typography } from "@mui/material";
import React from "react";

interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <Typography variant="h4" sx={{ fontSize: '1.5rem', fontStyle: 'normal', fontWeight: 600, color: 'text.primary' }}>
      {title}
    </Typography>
  );
};

export default PageTitle;
