import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

interface PDFViewerProps {
  file: string | Uint8Array; // URL or a Uint8Array of the PDF
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
  // You might want to use a state to manage the number of pages
  const [numPages, setNumPages] = React.useState<number | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <Document
      file={file}
      onLoadSuccess={onDocumentLoadSuccess}
      // options={{ workerSrc: `/pdf.worker.js` }}
    >
      {Array.from(new Array(numPages), (el, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} renderTextLayer={false} />
      ))}
    </Document>
  );
};

export default PDFViewer;
