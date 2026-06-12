import { isNDAComplete, emptyNDA } from "@/lib/ndaTypes";

describe("emptyNDA", () => {
  it("returns object with all required fields", () => {
    const nda = emptyNDA();
    expect(nda.party1Company).toBe("");
    expect(nda.party2Company).toBe("");
    expect(nda.governingLaw).toBe("");
    expect(nda.purpose).toContain("business relationship");
  });

  it("sets effectiveDate to today", () => {
    const nda = emptyNDA();
    const today = new Date().toISOString().split("T")[0];
    expect(nda.effectiveDate).toBe(today);
  });
});

describe("isNDAComplete", () => {
  it("returns false when required fields are missing", () => {
    expect(isNDAComplete(emptyNDA())).toBe(false);
  });

  it("returns true when all required fields are filled", () => {
    const fields = emptyNDA();
    (Object.keys(fields) as (keyof typeof fields)[]).forEach((key) => {
      fields[key] = "filled";
    });
    expect(isNDAComplete(fields)).toBe(true);
  });
});
