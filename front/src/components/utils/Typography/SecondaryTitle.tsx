import { Typography } from "@mui/material";
import React from "react";

interface SecondaryTitleProps {
  title: string;
  style?: React.CSSProperties;
}

function SecondaryTitle({ title, style }: SecondaryTitleProps) {
  return (
    <Typography
      sx={{
        fontSize: "1rem",
        fontStyle: "normal",
        fontWeight: "700",
        mb: 2,
        color: "#092C4C",
        ...style,
      }}
    >
      {title}
    </Typography>
  );
}

export default SecondaryTitle;
