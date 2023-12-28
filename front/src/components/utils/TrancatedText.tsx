import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

interface TruncatedTextProps {
  text: string;
  maxLength: number;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({ text, maxLength }) => {
  const truncate = (input: string) => {
    if (input.length <= maxLength) {
      return input;
    }
    const start = input.substring(0, maxLength / 2 - 2); // Adjust for the ellipsis and half-length
    const end = input.substring(input.length - (maxLength / 2 - 3));
    return `${start}...${end}`;
  };

  const truncatedText = truncate(text);

  return (
    <Tooltip title={text} placement="top">
      <Typography>
        {truncatedText}
      </Typography>
    </Tooltip>
  );
};

export default TruncatedText;
