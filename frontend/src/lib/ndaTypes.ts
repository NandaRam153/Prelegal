export interface NDAFields {
  // Party 1
  party1Company: string;
  party1Name: string;
  party1Title: string;
  party1Address: string;
  // Party 2
  party2Company: string;
  party2Name: string;
  party2Title: string;
  party2Address: string;
  // Agreement terms
  purpose: string;
  effectiveDate: string;
  mndaTerm: string;
  termOfConfidentiality: string;
  governingLaw: string;
  jurisdiction: string;
}

export const emptyNDA = (): NDAFields => ({
  party1Company: "",
  party1Name: "",
  party1Title: "",
  party1Address: "",
  party2Company: "",
  party2Name: "",
  party2Title: "",
  party2Address: "",
  purpose: "Evaluating whether to enter into a business relationship with the other party.",
  effectiveDate: new Date().toISOString().split("T")[0],
  mndaTerm: "1 year from Effective Date",
  termOfConfidentiality: "1 year from Effective Date",
  governingLaw: "",
  jurisdiction: "",
});

const REQUIRED_FIELDS: (keyof NDAFields)[] = [
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
];

export function isNDAComplete(fields: NDAFields): boolean {
  return REQUIRED_FIELDS.every((key) => fields[key].trim().length > 0);
}
