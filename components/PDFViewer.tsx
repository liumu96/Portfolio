"use client";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { HiDownload } from "react-icons/hi";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const PDFViewer = ({ pdfPath }: { pdfPath: string }) => {
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [renderNavButtons, setRenderNavButtons] = useState<Boolean>(false);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1);
    setRenderNavButtons(true);
  }
  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };
  const previousPage = () => {
    changePage(-1);
  };
  const nextPage = () => {
    changePage(+1);
  };
  return (
    <div className="text-center relative">
      <a
        href={pdfPath}
        className="text-neutral-100 font-semibold px-6 py-3 bg-purple-600 rounded shadow hover:bg-purple-700 flex items-center gap-2 w-64 justify-center mb-6 mx-auto"
      >
        <HiDownload />
        Download CV
      </a>
      <div className="border-purple-400 border rounded-sm">
        <Document
          file={pdfPath}
          className="d-flex justify-content-center"
          onLoadSuccess={onDocumentLoadSuccess}
          onMouseMove={() => {
            setRenderNavButtons(true);
          }}
          onMouseLeave={() => {
            //   setRenderNavButtons(false);
            setRenderNavButtons(true);
          }}
        >
          {/* <Page pageNumber={numPages} scale={width > 786 ? 1.5 : 0.6} /> */}
          <Page pageNumber={pageNumber} scale={width > 786 ? 1.5 : 0.6} />
          <div
            className={`page-controls text-purple-400 flex flex-row justify-between items-center ${
              renderNavButtons ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              type="button"
              disabled={pageNumber <= 1}
              onClick={previousPage}
              className="flex items-center justify-center"
            >
              {/* ‹ */}
              <FaArrowLeft />
            </button>
            <span>
              {pageNumber} of {numPages}
            </span>
            <button
              type="button"
              disabled={pageNumber === numPages}
              onClick={nextPage}
              className="flex items-center justify-center"
            >
              {/* › */}
              <FaArrowRight />
            </button>
          </div>
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;
