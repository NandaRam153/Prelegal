import {
  getMndaTermText,
  getConfidentialityTermText,
  formatDate,
  getCoverPageFields,
  getStandardTermsHtml,
  getStandardTermsPlainText,
} from '@/lib/ndaTemplate';
import type { MndaFormValues } from '@/lib/types';

const BASE: MndaFormValues = {
  purpose: 'Evaluating a business relationship.',
  effectiveDate: '2024-06-15',
  mndaTermType: 'years',
  mndaTermYears: 2,
  confidentialityTermType: 'years',
  confidentialityTermYears: 3,
  governingLaw: 'Delaware',
  jurisdiction: 'courts located in New Castle, DE',
  modifications: '',
};

// ---------------------------------------------------------------------------
// getMndaTermText
// ---------------------------------------------------------------------------

describe('getMndaTermText', () => {
  it('returns singular year', () => {
    expect(getMndaTermText({ ...BASE, mndaTermType: 'years', mndaTermYears: 1 }))
      .toBe('1 year from Effective Date');
  });

  it('returns plural years', () => {
    expect(getMndaTermText({ ...BASE, mndaTermType: 'years', mndaTermYears: 5 }))
      .toBe('5 years from Effective Date');
  });

  it('returns termination text for until-terminated type', () => {
    expect(getMndaTermText({ ...BASE, mndaTermType: 'until-terminated' }))
      .toBe('continuing until terminated');
  });
});

// ---------------------------------------------------------------------------
// getConfidentialityTermText
// ---------------------------------------------------------------------------

describe('getConfidentialityTermText', () => {
  it('returns singular year with trade-secrets clause', () => {
    const result = getConfidentialityTermText({ ...BASE, confidentialityTermType: 'years', confidentialityTermYears: 1 });
    expect(result).toContain('1 year from Effective Date');
    expect(result).toContain('trade secrets');
  });

  it('returns plural years with trade-secrets clause', () => {
    const result = getConfidentialityTermText({ ...BASE, confidentialityTermType: 'years', confidentialityTermYears: 4 });
    expect(result).toContain('4 years from Effective Date');
  });

  it('returns perpetuity text', () => {
    expect(getConfidentialityTermText({ ...BASE, confidentialityTermType: 'perpetuity' }))
      .toBe('in perpetuity');
  });
});

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------

describe('formatDate', () => {
  it('formats a valid ISO date', () => {
    const result = formatDate('2024-06-15');
    expect(result).toContain('June');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });

  it('returns empty string for empty input', () => {
    expect(formatDate('')).toBe('');
  });

  it('returns the original string for invalid input', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });
});

// ---------------------------------------------------------------------------
// getCoverPageFields
// ---------------------------------------------------------------------------

describe('getCoverPageFields', () => {
  it('returns all required field labels', () => {
    const labels = getCoverPageFields(BASE).map(([l]) => l);
    expect(labels).toContain('Purpose');
    expect(labels).toContain('Effective Date');
    expect(labels).toContain('MNDA Term');
    expect(labels).toContain('Term of Confidentiality');
    expect(labels).toContain('Governing Law');
    expect(labels).toContain('Jurisdiction');
  });

  it('omits MNDA Modifications when modifications is empty', () => {
    const labels = getCoverPageFields({ ...BASE, modifications: '' }).map(([l]) => l);
    expect(labels).not.toContain('MNDA Modifications');
  });

  it('includes MNDA Modifications when provided', () => {
    const fields = getCoverPageFields({ ...BASE, modifications: 'Section 5 is modified.' });
    const row = fields.find(([l]) => l === 'MNDA Modifications');
    expect(row?.[1]).toBe('Section 5 is modified.');
  });

  it('formats the effective date in the output', () => {
    const fields = getCoverPageFields(BASE);
    const row = fields.find(([l]) => l === 'Effective Date');
    expect(row?.[1]).toContain('June');
    expect(row?.[1]).toContain('2024');
  });

  it('prefixes MNDA Term with "Expires" for years type', () => {
    const fields = getCoverPageFields(BASE);
    const row = fields.find(([l]) => l === 'MNDA Term');
    expect(row?.[1]).toMatch(/^Expires/);
    expect(row?.[1]).toContain('2 years');
  });

  it('uses "Continues until terminated" text for until-terminated type', () => {
    const fields = getCoverPageFields({ ...BASE, mndaTermType: 'until-terminated' });
    const row = fields.find(([l]) => l === 'MNDA Term');
    expect(row?.[1]).toContain('terminated');
  });

  it('shows "In perpetuity" for perpetuity confidentiality term', () => {
    const fields = getCoverPageFields({ ...BASE, confidentialityTermType: 'perpetuity' });
    const row = fields.find(([l]) => l === 'Term of Confidentiality');
    expect(row?.[1]).toBe('In perpetuity');
  });

  it('propagates governing law and jurisdiction values', () => {
    const fields = getCoverPageFields(BASE);
    expect(fields.find(([l]) => l === 'Governing Law')?.[1]).toBe('Delaware');
    expect(fields.find(([l]) => l === 'Jurisdiction')?.[1]).toBe('courts located in New Castle, DE');
  });
});

// ---------------------------------------------------------------------------
// getStandardTermsHtml
// ---------------------------------------------------------------------------

describe('getStandardTermsHtml', () => {
  it('injects the purpose value', () => {
    const html = getStandardTermsHtml(BASE);
    expect(html).toContain('Evaluating a business relationship.');
  });

  it('injects the governing law', () => {
    expect(getStandardTermsHtml(BASE)).toContain('Delaware');
  });

  it('injects the jurisdiction', () => {
    expect(getStandardTermsHtml(BASE)).toContain('courts located in New Castle, DE');
  });

  it('HTML-escapes user input to prevent XSS injection', () => {
    const xss = { ...BASE, purpose: '<script>alert("xss")</script>' };
    const html = getStandardTermsHtml(xss);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('HTML-escapes angle brackets in governing law', () => {
    const html = getStandardTermsHtml({ ...BASE, governingLaw: 'State<X>' });
    expect(html).not.toContain('<X>');
    expect(html).toContain('&lt;X&gt;');
  });

  it('converts **bold** markdown to <strong> tags', () => {
    expect(getStandardTermsHtml(BASE)).toContain('<strong>');
  });

  it('wraps paragraphs in <p> tags', () => {
    expect(getStandardTermsHtml(BASE)).toMatch(/<p\b/);
  });

  it('leaves no unresolved coverpage_link spans', () => {
    expect(getStandardTermsHtml(BASE)).not.toContain('class="coverpage_link"');
  });
});

// ---------------------------------------------------------------------------
// getStandardTermsPlainText
// ---------------------------------------------------------------------------

describe('getStandardTermsPlainText', () => {
  it('replaces the Purpose marker with the actual purpose', () => {
    expect(getStandardTermsPlainText(BASE)).toContain('Evaluating a business relationship.');
  });

  it('leaves no coverpage_link markers in the output', () => {
    expect(getStandardTermsPlainText(BASE)).not.toContain('coverpage_link');
  });

  it('strips ** bold markdown markers', () => {
    expect(getStandardTermsPlainText(BASE)).not.toContain('**');
  });

  it('strips markdown link syntax, keeping link text', () => {
    const text = getStandardTermsPlainText(BASE);
    // No [text](url) patterns should remain
    expect(text).not.toMatch(/\[[^\]]+\]\([^)]+\)/);
  });

  it('injects governing law and jurisdiction', () => {
    const text = getStandardTermsPlainText(BASE);
    expect(text).toContain('Delaware');
    expect(text).toContain('courts located in New Castle, DE');
  });
});
