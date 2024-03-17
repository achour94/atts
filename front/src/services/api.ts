import { INVOICE_API_URL } from "../features/invoices/invoiceSlice";
import { SendInvoiceByMailRequest } from "../lib/interfaces/IInvoice";
import axiosInstance from "./axios";


// Function to send invoices by email with the updated structure
export const sendInvoicesByEmail = async (request: SendInvoiceByMailRequest): Promise<void> => {
    try {
      await axiosInstance.put(`${INVOICE_API_URL}/email`, request, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Invoices sent successfully');
    } catch (error) {
      console.error('Error sending invoices:', error);
      throw error; // Re-throw the error for further handling
    }
  };