import type { NDAFields } from "./ndaTypes";
import { emptyNDA } from "./ndaTypes";

export type DocumentTypeId =
  | "mutual-nda"
  | "csa"
  | "pilot"
  | "design-partner"
  | "sla"
  | "psa"
  | "dpa"
  | "software-license"
  | "partnership"
  | "baa"
  | "ai-addendum";

export type DocumentFields = Record<string, string>;

export interface DocumentTypeConfig {
  id: DocumentTypeId;
  name: string;
  previewStyle: "nda" | "provider-customer" | "generic";
  fieldNames: string[];
  defaults: DocumentFields;
}

const PROVIDER_CUSTOMER = [
  "providerCompany",
  "providerName",
  "providerTitle",
  "providerAddress",
  "customerCompany",
  "customerName",
  "customerTitle",
  "customerAddress",
];

const GOVERNANCE = ["effectiveDate", "governingLaw", "chosenCourts"];

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function pcDefaults(extra: DocumentFields = {}): DocumentFields {
  const base: DocumentFields = {};
  [...PROVIDER_CUSTOMER, ...GOVERNANCE].forEach((key) => {
    base[key] = "";
  });
  base.effectiveDate = today();
  return { ...base, ...extra };
}

export const DOCUMENT_TYPES: Record<DocumentTypeId, DocumentTypeConfig> = {
  "mutual-nda": {
    id: "mutual-nda",
    name: "Mutual NDA",
    previewStyle: "nda",
    fieldNames: [
      "party1Company",
      "party1Name",
      "party1Title",
      "party1Address",
      "party2Company",
      "party2Name",
      "party2Title",
      "party2Address",
      "purpose",
      "effectiveDate",
      "mndaTerm",
      "termOfConfidentiality",
      "governingLaw",
      "jurisdiction",
    ],
    defaults: emptyNDA() as unknown as DocumentFields,
  },
  csa: {
    id: "csa",
    name: "Cloud Service Agreement",
    previewStyle: "provider-customer",
    fieldNames: [
      ...PROVIDER_CUSTOMER,
      "effectiveDate",
      "subscriptionPeriod",
      "cloudServiceDescription",
      "fees",
      "governingLaw",
      "chosenCourts",
    ],
    defaults: pcDefaults({
      subscriptionPeriod: "1 year",
      cloudServiceDescription: "",
      fees: "",
    }),
  },
  pilot: {
    id: "pilot",
    name: "Pilot Agreement",
    previewStyle: "provider-customer",
    fieldNames: [
      ...PROVIDER_CUSTOMER,
      "effectiveDate",
      "pilotPeriod",
      "productDescription",
      "generalCapAmount",
      "governingLaw",
      "chosenCourts",
    ],
    defaults: pcDefaults({
      pilotPeriod: "30 days",
      productDescription: "",
      generalCapAmount: "$1,000",
    }),
  },
  "design-partner": {
    id: "design-partner",
    name: "Design Partner Agreement",
    previewStyle: "generic",
    fieldNames: [
      ...PROVIDER_CUSTOMER,
      "effectiveDate",
      "programDescription",
      "designPartnerTerm",
      "governingLaw",
      "chosenCourts",
    ],
    defaults: pcDefaults({ programDescription: "", designPartnerTerm: "6 months" }),
  },
  sla: {
    id: "sla",
    name: "Service Level Agreement",
    previewStyle: "generic",
    fieldNames: [
      ...PROVIDER_CUSTOMER,
      "effectiveDate",
      "uptimeCommitment",
      "serviceCredits",
      "governingLaw",
      "chosenCourts",
    ],
    defaults: pcDefaults({ uptimeCommitment: "99.9%", serviceCredits: "" }),
  },
  psa: {
    id: "psa",
    name: "Professional Services Agreement",
    previewStyle: "generic",
    fieldNames: [
      ...PROVIDER_CUSTOMER,
      "effectiveDate",
      "servicesDescription",
      "projectScope",
      "fees",
      "governingLaw",
      "chosenCourts",
    ],
    defaults: pcDefaults({ servicesDescription: "", projectScope: "", fees: "" }),
  },
  dpa: {
    id: "dpa",
    name: "Data Processing Agreement",
    previewStyle: "generic",
    fieldNames: [
      ...PROVIDER_CUSTOMER,
      "effectiveDate",
      "processingPurpose",
      "dataCategories",
      "governingLaw",
      "chosenCourts",
    ],
    defaults: pcDefaults({ processingPurpose: "", dataCategories: "" }),
  },
  "software-license": {
    id: "software-license",
    name: "Software License Agreement",
    previewStyle: "generic",
    fieldNames: [
      ...PROVIDER_CUSTOMER,
      "effectiveDate",
      "subscriptionPeriod",
      "permittedUses",
      "licenseLimits",
      "governingLaw",
      "chosenCourts",
    ],
    defaults: pcDefaults({
      subscriptionPeriod: "1 year",
      permittedUses: "Internal business purposes",
      licenseLimits: "",
    }),
  },
  partnership: {
    id: "partnership",
    name: "Partnership Agreement",
    previewStyle: "generic",
    fieldNames: [
      ...PROVIDER_CUSTOMER,
      "effectiveDate",
      "partnershipType",
      "referralTerms",
      "governingLaw",
      "chosenCourts",
    ],
    defaults: pcDefaults({ partnershipType: "", referralTerms: "" }),
  },
  baa: {
    id: "baa",
    name: "Business Associate Agreement",
    previewStyle: "generic",
    fieldNames: [
      ...PROVIDER_CUSTOMER,
      "effectiveDate",
      "hipaaServices",
      "permittedUses",
      "governingLaw",
      "chosenCourts",
    ],
    defaults: pcDefaults({ hipaaServices: "", permittedUses: "" }),
  },
  "ai-addendum": {
    id: "ai-addendum",
    name: "AI Addendum",
    previewStyle: "generic",
    fieldNames: [
      ...PROVIDER_CUSTOMER,
      "effectiveDate",
      "aiFeatures",
      "modelTrainingPolicy",
      "governingLaw",
      "chosenCourts",
    ],
    defaults: pcDefaults({ aiFeatures: "", modelTrainingPolicy: "" }),
  },
};

export const FIELD_LABELS: Record<string, string> = {
  party1Company: "Party 1 Company",
  party1Name: "Party 1 Signatory",
  party1Title: "Party 1 Title",
  party1Address: "Party 1 Notice Address",
  party2Company: "Party 2 Company",
  party2Name: "Party 2 Signatory",
  party2Title: "Party 2 Title",
  party2Address: "Party 2 Notice Address",
  providerCompany: "Provider Company",
  providerName: "Provider Signatory",
  providerTitle: "Provider Title",
  providerAddress: "Provider Notice Address",
  customerCompany: "Customer Company",
  customerName: "Customer Signatory",
  customerTitle: "Customer Title",
  customerAddress: "Customer Notice Address",
  purpose: "Purpose",
  effectiveDate: "Effective Date",
  mndaTerm: "MNDA Term",
  termOfConfidentiality: "Term of Confidentiality",
  governingLaw: "Governing Law",
  jurisdiction: "Jurisdiction",
  chosenCourts: "Chosen Courts",
  subscriptionPeriod: "Subscription Period",
  cloudServiceDescription: "Cloud Service Description",
  fees: "Fees",
  pilotPeriod: "Pilot Period",
  productDescription: "Product Description",
  generalCapAmount: "General Cap Amount",
  programDescription: "Program Description",
  designPartnerTerm: "Design Partner Term",
  uptimeCommitment: "Uptime Commitment",
  serviceCredits: "Service Credits",
  servicesDescription: "Services Description",
  projectScope: "Project Scope",
  processingPurpose: "Processing Purpose",
  dataCategories: "Data Categories",
  permittedUses: "Permitted Uses",
  licenseLimits: "License Limits",
  partnershipType: "Partnership Type",
  referralTerms: "Referral Terms",
  hipaaServices: "HIPAA Services",
  aiFeatures: "AI Features",
  modelTrainingPolicy: "Model Training Policy",
};

export function emptyFields(documentType: DocumentTypeId): DocumentFields {
  return { ...DOCUMENT_TYPES[documentType].defaults };
}

export function isDocumentComplete(
  documentType: DocumentTypeId,
  fields: DocumentFields
): boolean {
  return DOCUMENT_TYPES[documentType].fieldNames.every(
    (key) => (fields[key] ?? "").trim().length > 0
  );
}

export function getDocumentName(documentType: DocumentTypeId | null): string {
  if (!documentType) return "Select Document";
  return DOCUMENT_TYPES[documentType].name;
}

export function toNDAFields(fields: DocumentFields): NDAFields {
  const base = emptyNDA();
  return { ...base, ...fields } as NDAFields;
}

export function getDownloadFilename(
  documentType: DocumentTypeId,
  fields: DocumentFields
): string {
  const config = DOCUMENT_TYPES[documentType];
  if (documentType === "mutual-nda") {
    return [
      fields.party1Company || "Party1",
      fields.party2Company || "Party2",
      "Mutual-NDA.pdf",
    ]
      .join("_")
      .replace(/\s+/g, "-");
  }
  return [
    fields.providerCompany || "Provider",
    fields.customerCompany || "Customer",
    `${config.name.replace(/\s+/g, "-")}.pdf`,
  ]
    .join("_")
    .replace(/\s+/g, "-");
}
