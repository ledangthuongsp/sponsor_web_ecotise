import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

const PDFViewer = ({ url }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Đặt workerSrc cho PDF.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const loadPDF = async () => {
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1); // Hiển thị trang đầu tiên
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      page.render({ canvasContext: context, viewport: viewport });
    };

    loadPDF();
  }, [url]);

  return <canvas ref={canvasRef} />;
};

export default PDFViewer;
