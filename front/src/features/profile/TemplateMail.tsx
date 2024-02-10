import { ExpandCircleDownOutlined } from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary, TextField, Typography } from "@mui/material"

export const TemplateMail: React.FC = () => {

    return (<> <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
    Templates de Mail
  </Typography>
  <Accordion>
    <AccordionSummary
      expandIcon={<ExpandCircleDownOutlined />}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <Typography>Email envoie de facture automatique</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <TextField
        fullWidth
        label="Notes"
        multiline
        rows={4}
        variant="outlined"
        //value={notes} // Assurez-vous que `notes` est correctement défini
        // onChange={(e) => setNotes(e.target.value)} // Assurez-vous que cette fonction est définie
      />
    </AccordionDetails>
  </Accordion></>)

    }