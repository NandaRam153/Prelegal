export interface MndaFormValues {
  purpose: string;
  effectiveDate: string;
  mndaTermType: 'years' | 'until-terminated';
  mndaTermYears: number;
  confidentialityTermType: 'years' | 'perpetuity';
  confidentialityTermYears: number;
  governingLaw: string;
  jurisdiction: string;
  modifications: string;
}

export const SIG_FIELDS = [
  'Signature',
  'Print Name',
  'Title',
  'Company',
  'Notice Address',
  'Date',
] as const;
