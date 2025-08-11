import React from "react";

export const PencilIcon = (props) => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 3.487a2.25 2.25 0 113.182 3.182l-10.5 10.5a2 2 0 01-.878.513l-4 1a.5.5 0 01-.606-.606l1-4a2 2 0 01.513-.878l10.5-10.5z" />
  </svg>
);

export const CrossIcon = (props) => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const TrashIcon = (props) => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

export const ExcelIcon = (props) => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" fill="#21A366"/>
    <path d="M7 8l4 8M11 8l-4 8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="13" y="7" width="4" height="10" rx="1" fill="#fff"/>
    <text x="15" y="16" textAnchor="middle" fontSize="7" fill="#21A366" fontWeight="bold">X</text>
  </svg>
);

export const PdfIcon = (props) => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" fill="#E2574C"/>
    <path d="M8 8h8v8H8z" fill="#fff"/>
    <text x="12" y="16" textAnchor="middle" fontSize="7" fill="#E2574C" fontWeight="bold">PDF</text>
  </svg>
);

export const ExportIcon = (props) => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
  </svg>
);

export const EyeIcon = (props) => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12s-4 7.5-10.5 7.5S1.5 12 1.5 12z" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} />
  </svg>
);

export const PrinterIcon = (props) => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <rect x="6" y="9" width="12" height="7" rx="2" stroke="currentColor" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 17v2a2 2 0 002 2h8a2 2 0 002-2v-2M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2" />
    <circle cx="17" cy="13" r="1" fill="currentColor" />
  </svg>
);
