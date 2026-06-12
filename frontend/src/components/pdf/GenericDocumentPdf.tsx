"use client";

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { DocumentFields, DocumentTypeId } from "@/lib/documentTypes";
import { DOCUMENT_TYPES, FIELD_LABELS } from "@/lib/documentTypes";

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10, fontFamily: "Helvetica", color: "#1a1a2e" },
  title: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#032147", textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 9, color: "#888888", textAlign: "center", marginBottom: 24 },
  sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#032147", marginBottom: 8 },
  row: { flexDirection: "row", marginBottom: 6 },
  label: { fontFamily: "Helvetica-Bold", width: 160, color: "#032147" },
  value: { flex: 1, color: "#1a1a2e" },
});

function row(label: string, val: string | undefined, ph: string) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{val?.trim() || ph}</Text>
    </View>
  );
}

export default function GenericDocumentPdf({
  documentType,
  fields,
}: {
  documentType: DocumentTypeId;
  fields: DocumentFields;
}) {
  const config = DOCUMENT_TYPES[documentType];

  return (
    <Document title={config.name}>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>{config.name}</Text>
        <Text style={styles.subtitle}>Common Paper Standard — Cover Page</Text>
        <Text style={styles.sectionTitle}>Document Details</Text>
        {config.fieldNames.map((key) =>
          row(FIELD_LABELS[key] ?? key, fields[key], `Enter ${FIELD_LABELS[key] ?? key}`)
        )}
      </Page>
    </Document>
  );
}
