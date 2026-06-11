# Manual Test Plan — Mutual NDA Creator (PL-3)

## Setup

```bash
cd frontend
npm install
npm run dev   # runs on http://localhost:3000
```

---

## Test Cases

### TC-01 · Form renders on load

**Steps:** Navigate to `/`  
**Expected:** Form displays with Purpose (pre-filled default), Effective Date, MNDA Term, Term of Confidentiality, Governing Law, Jurisdiction, MNDA Modifications fields and a "Generate NDA →" button.

---

### TC-02 · Required field validation

**Steps:** Clear Purpose, click "Generate NDA →"  
**Expected:** Red error banner "Purpose is required." — no navigation to preview.

**Steps:** Restore Purpose, leave Effective Date blank, click submit  
**Expected:** "Effective Date is required."

**Steps:** Set date, leave Governing Law blank, click submit  
**Expected:** "Governing Law is required."

**Steps:** Set Governing Law, leave Jurisdiction blank, click submit  
**Expected:** "Jurisdiction is required."

---

### TC-03 · Successful generation and preview

**Steps:**
1. Fill in all required fields (e.g. Purpose: "Evaluating a partnership", Date: today, Governing Law: "Delaware", Jurisdiction: "courts in New Castle, DE")
2. Click "Generate NDA →"

**Expected:**
- Navigates to preview with "← Edit" and "↓ Download PDF" buttons
- Cover page table shows all entered values
- Effective Date is formatted (e.g. "June 15, 2024")
- Standard Terms section is visible and fully rendered with values highlighted in yellow
- PARTY 1 / PARTY 2 signature table is present

---

### TC-04 · Edit button restores form values

**Steps:** Generate a preview, click "← Edit"  
**Expected:** Returns to form with all previously entered values preserved exactly — no fields reset.

---

### TC-05 · MNDA Term — years

**Steps:** Select "Expires after N year(s)" radio, enter 3  
**Expected:** Cover page "MNDA Term" row shows "Expires 3 years from Effective Date". Standard Terms section 5 shows the same text.

**Steps:** Enter 1  
**Expected:** "Expires 1 year from Effective Date" (singular).

---

### TC-06 · MNDA Term — until terminated

**Steps:** Select "Continues until terminated"  
**Expected:** Cover page "MNDA Term" shows "Continues until terminated...". Number input is disabled.

---

### TC-07 · Term of Confidentiality — years / perpetuity

**Steps:** Set confidentiality to 2 years  
**Expected:** Cover page row shows "2 years from Effective Date, but in the case of trade secrets...".

**Steps:** Set confidentiality to "In perpetuity"  
**Expected:** Cover page shows "In perpetuity". Standard Terms section 5 shows "in perpetuity".

---

### TC-08 · Optional MNDA Modifications

**Steps:** Leave Modifications blank  
**Expected:** "MNDA Modifications" row is absent from the cover page table.

**Steps:** Enter "Section 9 is amended to remove forum selection."  
**Expected:** "MNDA Modifications" row appears with the text.

---

### TC-09 · PDF download

**Steps:** Complete form, go to preview, click "↓ Download PDF"  
**Expected:**
- Button shows "Generating PDF…" while working
- A file `mutual-nda.pdf` is downloaded
- PDF opens with cover page (field table + signature block) on page 1 and Standard Terms on following pages

---

### TC-10 · XSS / injection safety

**Steps:** Enter `<script>alert(1)</script>` as the Purpose  
**Expected:** Preview renders the literal text `<script>alert(1)</script>` — no script executes. No alert fires.

---

### TC-11 · Number input — prevents invalid values

**Steps:** Clear the MNDA Term years input entirely  
**Expected:** Input value does not snap to 1 mid-edit; shows empty or retains last valid value until a valid number ≥ 1 is entered.

**Steps:** Type 0 or a negative number  
**Expected:** Value is not accepted.
