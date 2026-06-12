import {
  DOCUMENT_TYPES,
  emptyFields,
  getDocumentName,
  isDocumentComplete,
} from "@/lib/documentTypes";

describe("documentTypes", () => {
  it("defines eleven document types", () => {
    expect(Object.keys(DOCUMENT_TYPES)).toHaveLength(11);
  });

  it("returns empty fields with defaults", () => {
    const fields = emptyFields("csa");
    expect(fields.effectiveDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(fields.providerCompany).toBe("");
  });

  it("checks completeness per type", () => {
    const fields = emptyFields("pilot");
    expect(isDocumentComplete("pilot", fields)).toBe(false);
    DOCUMENT_TYPES.pilot.fieldNames.forEach((key) => {
      fields[key] = "value";
    });
    expect(isDocumentComplete("pilot", fields)).toBe(true);
  });

  it("returns document display name", () => {
    expect(getDocumentName(null)).toBe("Select Document");
    expect(getDocumentName("mutual-nda")).toBe("Mutual NDA");
  });
});
