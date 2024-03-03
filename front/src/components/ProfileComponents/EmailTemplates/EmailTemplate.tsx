import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Box,
  styled,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IEmailTemplate } from "../../../lib/interfaces/IUser";
import { EmailTemplateConstants as ETC } from "../../../lib/constants/EmailTemplateConstants";
import HtmlRenderer from "../../utils/HtmlRenderer";

interface EmailTemplateProps {
  emailTemplate: IEmailTemplate;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: "none",
  border: `1px solid #EAEEF4`,
  borderRadius: "0.75rem",
  borderBottomLeftRadius: "0.5rem !important",
  borderBottomRightRadius: "0.5rem !important",
  borderTopLeftRadius: "0.5rem !important",
  borderTopRightRadius: "0.5rem !important",
  overflow: "hidden",
//   "&:not(:last-child)": {
//     borderBottom: 0,
//   },
  "&:before": {
    display: "none",
  },
  marginBottom: "0.5rem",
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  "&.Mui-expanded": {
    backgroundColor: theme.palette.action.hover,
  },
  justifyContent: "space-between",
  alignItems: "center",
  margin: 0,
  "& .MuiAccordionSummary-content.Mui-expanded": {
    margin: "12px 0",
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)({
    backgroundColor: "#FFFFFF",
});

const StyledIconButton = styled(IconButton)({
  color: "#A3AED0",
  padding: "0",
  marginRight: "0.125rem",
});

const EmailTemplate: React.FC<EmailTemplateProps> = ({
  emailTemplate,
  onEdit,
  onDelete,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <StyledAccordion onChange={(event, isExpanded) => setExpanded(isExpanded)}>
      <StyledAccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel-content"
        id="panel-header"
        aria-expanded={expanded}
      >
        <Box sx={{ width: "100%" }}>
          <Grid
            container
            sx={{
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Grid item flex={1}>
              <Typography m={0}>
                {emailTemplate[ETC.EMAILTEMPLATE_NAME]}
              </Typography>
            </Grid>
            <Grid item mr={1}>
              <StyledIconButton
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(emailTemplate?.[ETC.EMAILTEMPLATE_ID] as number);
                }}
              >
                <EditIcon />
              </StyledIconButton>
              <StyledIconButton
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(emailTemplate?.[ETC.EMAILTEMPLATE_ID] as number);
                }}
              >
                <DeleteIcon />
              </StyledIconButton>
            </Grid>
          </Grid>
        </Box>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <HtmlRenderer htmlContent={emailTemplate[ETC.EMAILTEMPLATE_CONTENT]} />
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default EmailTemplate;
