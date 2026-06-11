'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { MndaFormValues } from '@/lib/types';
import { SIG_FIELDS } from '@/lib/types';
import { getCoverPageFields, getStandardTermsPlainText } from '@/lib/ndaTemplate';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 11,
    paddingTop: 72,
    paddingBottom: 72,
    paddingLeft: 72,
    paddingRight: 72,
    lineHeight: 1.5,
    color: '#111111',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    marginBottom: 14,
  },
  introText: {
    fontSize: 10,
    marginBottom: 14,
    lineHeight: 1.6,
  },
  fieldRow: {
    flexDirection: 'row',
    paddingBottom: 6,
    marginBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc',
  },
  fieldLabel: {
    width: 130,
    fontSize: 10,
    fontFamily: 'Times-Bold',
    color: '#444444',
  },
  fieldValue: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.4,
  },
  sigTable: {
    marginTop: 14,
    borderWidth: 0.5,
    borderColor: '#aaaaaa',
  },
  sigHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 0.5,
    borderBottomColor: '#aaaaaa',
  },
  sigLabelHeader: {
    width: 90,
    fontSize: 9,
    fontFamily: 'Times-Bold',
    padding: 5,
    borderRightWidth: 0.5,
    borderRightColor: '#aaaaaa',
  },
  sigPartyHeader: {
    flex: 1,
    fontSize: 9,
    fontFamily: 'Times-Bold',
    padding: 5,
    textAlign: 'center',
    borderRightWidth: 0.5,
    borderRightColor: '#aaaaaa',
  },
  sigPartyHeaderLast: {
    flex: 1,
    fontSize: 9,
    fontFamily: 'Times-Bold',
    padding: 5,
    textAlign: 'center',
  },
  sigRow: {
    flexDirection: 'row',
    minHeight: 32,
    borderBottomWidth: 0.5,
    borderBottomColor: '#aaaaaa',
  },
  sigRowLast: {
    flexDirection: 'row',
    minHeight: 32,
  },
  sigFieldLabel: {
    width: 90,
    fontSize: 9,
    fontFamily: 'Times-Bold',
    padding: 5,
    borderRightWidth: 0.5,
    borderRightColor: '#aaaaaa',
  },
  sigFieldCell: {
    flex: 1,
    padding: 5,
    borderRightWidth: 0.5,
    borderRightColor: '#aaaaaa',
  },
  sigFieldCellLast: {
    flex: 1,
    padding: 5,
  },
  attribution: {
    fontSize: 9,
    color: '#666666',
    marginTop: 16,
  },
  standardTermsTitle: {
    fontSize: 15,
    fontFamily: 'Times-Bold',
    marginBottom: 14,
  },
  paragraph: {
    fontSize: 11,
    marginBottom: 9,
    lineHeight: 1.6,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 9,
    bottom: 36,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#888888',
  },
});

export function NdaPdfDocument({ values }: { values: MndaFormValues }) {
  const coverFields = getCoverPageFields(values);

  const paragraphs = getStandardTermsPlainText(values)
    .split('\n\n')
    .filter((p) => p.trim());

  return (
    <Document>
      {/* Cover Page */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>Mutual Non-Disclosure Agreement</Text>

        <Text style={styles.introText}>
          This Mutual Non-Disclosure Agreement (the "MNDA") consists of: (1) this Cover Page
          ("Cover Page") and (2) the Common Paper Mutual NDA Standard Terms Version 1.0
          ("Standard Terms") identical to those posted at
          commonpaper.com/standards/mutual-nda/1.0. Any modifications of the Standard Terms
          should be made on the Cover Page, which will control over conflicts with the Standard
          Terms.
        </Text>

        {coverFields.map(([label, value]) => (
          <View key={label} style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <Text style={styles.fieldValue}>{value}</Text>
          </View>
        ))}

        <Text style={[styles.introText, { marginTop: 14 }]}>
          By signing this Cover Page, each party agrees to enter into this MNDA as of the
          Effective Date.
        </Text>

        <View style={styles.sigTable}>
          <View style={styles.sigHeaderRow}>
            <Text style={styles.sigLabelHeader}> </Text>
            <Text style={styles.sigPartyHeader}>PARTY 1</Text>
            <Text style={styles.sigPartyHeaderLast}>PARTY 2</Text>
          </View>
          {SIG_FIELDS.map((field, i) => (
            <View
              key={field}
              style={i < SIG_FIELDS.length - 1 ? styles.sigRow : styles.sigRowLast}
            >
              <Text style={styles.sigFieldLabel}>{field}</Text>
              <View style={styles.sigFieldCell}>
                <Text> </Text>
              </View>
              <View style={styles.sigFieldCellLast}>
                <Text> </Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.attribution}>
          Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under CC BY
          4.0.
        </Text>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>

      {/* Standard Terms */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.standardTermsTitle}>Standard Terms</Text>
        {paragraphs.map((para, i) => (
          <Text key={i} style={styles.paragraph}>
            {para}
          </Text>
        ))}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}
