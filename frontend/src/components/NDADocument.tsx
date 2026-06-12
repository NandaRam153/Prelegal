"use client";

import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { NDAFields } from "@/lib/ndaTypes";

Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10, fontFamily: "Helvetica", color: "#1a1a2e" },
  title: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#032147", textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 9, color: "#888888", textAlign: "center", marginBottom: 24 },
  sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#032147", marginBottom: 8, marginTop: 16 },
  row: { flexDirection: "row", marginBottom: 6 },
  label: { fontFamily: "Helvetica-Bold", width: 160, color: "#032147" },
  value: { flex: 1, color: "#1a1a2e" },
  tableHeader: { flexDirection: "row", backgroundColor: "#f3f4f6", borderBottom: "1px solid #e5e7eb", paddingVertical: 6, paddingHorizontal: 4 },
  tableRow: { flexDirection: "row", borderBottom: "1px solid #e5e7eb", paddingVertical: 6, paddingHorizontal: 4 },
  tableCell: { flex: 1, fontSize: 9 },
  tableCellHeader: { flex: 1, fontSize: 9, fontFamily: "Helvetica-Bold", color: "#032147" },
  tableCellLabel: { width: 120, fontSize: 9, fontFamily: "Helvetica-Bold", color: "#888888" },
  divider: { borderBottom: "1px solid #e5e7eb", marginVertical: 12 },
  footer: { position: "absolute", bottom: 32, left: 48, right: 48, fontSize: 8, color: "#888888", textAlign: "center" },
  signatureBox: { flex: 1, marginRight: 16 },
  signatureLine: { borderBottom: "1px solid #9ca3af", height: 32, marginBottom: 8 },
});

function row(label: string, val: string | undefined, ph: string) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{val?.trim() || ph}</Text>
    </View>
  );
}

export default function NDADocument({ fields }: { fields: NDAFields }) {
  return (
    <Document title="Mutual Non-Disclosure Agreement">
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>Mutual Non-Disclosure Agreement</Text>
        <Text style={styles.subtitle}>Common Paper Standard — Version 1.0</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Cover Page</Text>

        {/* Parties table */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableCellLabel}></Text>
          <Text style={styles.tableCellHeader}>Party 1</Text>
          <Text style={styles.tableCellHeader}>Party 2</Text>
        </View>
        {[
          ["Company", fields.party1Company, fields.party2Company, "Acme Corp", "Beta LLC"],
          ["Signatory Name", fields.party1Name, fields.party2Name, "Jane Smith", "John Doe"],
          ["Title", fields.party1Title, fields.party2Title, "CEO", "CTO"],
          ["Notice Address", fields.party1Address, fields.party2Address, "123 Main St…", "456 Market St…"],
        ].map(([label, v1, v2, ph1, ph2]) => (
          <View key={label} style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>{label}</Text>
            <Text style={styles.tableCell}>{v1?.trim() || ph1}</Text>
            <Text style={styles.tableCell}>{v2?.trim() || ph2}</Text>
          </View>
        ))}

        <View style={{ marginTop: 16 }}>
          {row("Purpose", fields.purpose, "Evaluating a potential business relationship.")}
          {row("Effective Date", fields.effectiveDate, "YYYY-MM-DD")}
          {row("MNDA Term", fields.mndaTerm, "1 year from Effective Date")}
          {row("Term of Confidentiality", fields.termOfConfidentiality, "1 year from Effective Date")}
          {row("Governing Law", fields.governingLaw, "Delaware")}
          {row("Jurisdiction", fields.jurisdiction, "New Castle, DE")}
        </View>

        <View style={styles.divider} />

        <Text style={{ fontSize: 8, color: "#888888", marginBottom: 12 }}>
          By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.
        </Text>

        {/* Signatures */}
        <View style={{ flexDirection: "row" }}>
          {[
            { label: "Party 1", name: fields.party1Name, title: fields.party1Title, company: fields.party1Company },
            { label: "Party 2", name: fields.party2Name, title: fields.party2Title, company: fields.party2Company },
          ].map((p) => (
            <View key={p.label} style={styles.signatureBox}>
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, marginBottom: 8, color: "#032147" }}>
                {p.label}
              </Text>
              <View style={styles.signatureLine} />
              <Text style={{ fontSize: 8 }}>Signature</Text>
              <Text style={{ fontSize: 8, marginTop: 6 }}>Name: {p.name || "_______________"}</Text>
              <Text style={{ fontSize: 8, marginTop: 4 }}>Title: {p.title || "_______________"}</Text>
              <Text style={{ fontSize: 8, marginTop: 4 }}>Company: {p.company || "_______________"}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Common Paper Mutual Non-Disclosure Agreement Version 1.0 — free to use under CC BY 4.0
        </Text>
      </Page>
    </Document>
  );
}
