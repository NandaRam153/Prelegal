'use client';

import { useState } from 'react';
import type { MndaFormValues } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const DEFAULTS: MndaFormValues = {
  purpose: 'Evaluating whether to enter into a business relationship with the other party.',
  effectiveDate: '',
  mndaTermType: 'years',
  mndaTermYears: 1,
  confidentialityTermType: 'years',
  confidentialityTermYears: 1,
  governingLaw: '',
  jurisdiction: '',
  modifications: '',
};

export default function NdaForm({
  initialValues,
  onSubmit,
}: {
  initialValues?: MndaFormValues;
  onSubmit: (values: MndaFormValues) => void;
}) {
  const [values, setValues] = useState<MndaFormValues>(initialValues ?? DEFAULTS);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof MndaFormValues>(key: K, value: MndaFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.purpose.trim()) return setError('Purpose is required.');
    if (!values.effectiveDate) return setError('Effective Date is required.');
    if (!values.governingLaw.trim()) return setError('Governing Law is required.');
    if (!values.jurisdiction.trim()) return setError('Jurisdiction is required.');
    if (values.mndaTermType === 'years' && values.mndaTermYears < 1)
      return setError('MNDA Term must be at least 1 year.');
    if (values.confidentialityTermType === 'years' && values.confidentialityTermYears < 1)
      return setError('Confidentiality Term must be at least 1 year.');
    setError(null);
    onSubmit(values);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 space-y-6"
    >
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Purpose */}
      <div className="space-y-1.5">
        <Label htmlFor="purpose">
          Purpose <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-gray-500">How Confidential Information may be used</p>
        <Textarea
          id="purpose"
          rows={3}
          value={values.purpose}
          onChange={(e) => set('purpose', e.target.value)}
          placeholder="Evaluating whether to enter into a business relationship with the other party."
        />
      </div>

      {/* Effective Date */}
      <div className="space-y-1.5">
        <Label htmlFor="effectiveDate">
          Effective Date <span className="text-red-500">*</span>
        </Label>
        <Input
          id="effectiveDate"
          type="date"
          value={values.effectiveDate}
          onChange={(e) => set('effectiveDate', e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* MNDA Term */}
      <div className="space-y-2">
        <Label>
          MNDA Term <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-gray-500">The length of this MNDA</p>
        <RadioGroup
          value={values.mndaTermType}
          onValueChange={(v) => set('mndaTermType', v as MndaFormValues['mndaTermType'])}
          className="gap-3"
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem value="years" id="mnda-years" />
            <div className="flex items-center gap-2 flex-wrap">
              <Label htmlFor="mnda-years" className="font-normal cursor-pointer">
                Expires after
              </Label>
              <Input
                type="number"
                min={1}
                max={99}
                value={values.mndaTermYears}
                onChange={(e) => {
                  const n = parseInt(e.target.value);
                  if (!isNaN(n) && n >= 1) set('mndaTermYears', n);
                }}
                onClick={() => set('mndaTermType', 'years')}
                className="w-20 h-8 text-sm"
                disabled={values.mndaTermType !== 'years'}
              />
              <span className="text-sm text-gray-700">year(s) from Effective Date</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="until-terminated" id="mnda-terminated" />
            <Label htmlFor="mnda-terminated" className="font-normal cursor-pointer">
              Continues until terminated in accordance with the terms of the MNDA
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Term of Confidentiality */}
      <div className="space-y-2">
        <Label>
          Term of Confidentiality <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-gray-500">How long Confidential Information is protected</p>
        <RadioGroup
          value={values.confidentialityTermType}
          onValueChange={(v) =>
            set('confidentialityTermType', v as MndaFormValues['confidentialityTermType'])
          }
          className="gap-3"
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem value="years" id="conf-years" />
            <div className="flex items-center gap-2 flex-wrap">
              <Input
                type="number"
                min={1}
                max={99}
                value={values.confidentialityTermYears}
                onChange={(e) => {
                  const n = parseInt(e.target.value);
                  if (!isNaN(n) && n >= 1) set('confidentialityTermYears', n);
                }}
                onClick={() => set('confidentialityTermType', 'years')}
                className="w-20 h-8 text-sm"
                disabled={values.confidentialityTermType !== 'years'}
              />
              <Label htmlFor="conf-years" className="font-normal cursor-pointer">
                year(s) from Effective Date
              </Label>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="perpetuity" id="conf-perpetuity" />
            <Label htmlFor="conf-perpetuity" className="font-normal cursor-pointer">
              In perpetuity
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Governing Law */}
      <div className="space-y-1.5">
        <Label htmlFor="governingLaw">
          Governing Law <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-gray-500">
          U.S. state governing this agreement (e.g. &quot;Delaware&quot;)
        </p>
        <Input
          id="governingLaw"
          value={values.governingLaw}
          onChange={(e) => set('governingLaw', e.target.value)}
          placeholder="Delaware"
          className="max-w-xs"
        />
      </div>

      {/* Jurisdiction */}
      <div className="space-y-1.5">
        <Label htmlFor="jurisdiction">
          Jurisdiction <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-gray-500">Courts where disputes will be resolved</p>
        <Input
          id="jurisdiction"
          value={values.jurisdiction}
          onChange={(e) => set('jurisdiction', e.target.value)}
          placeholder="courts located in New Castle, DE"
        />
      </div>

      {/* MNDA Modifications */}
      <div className="space-y-1.5">
        <Label htmlFor="modifications">MNDA Modifications</Label>
        <p className="text-xs text-gray-500">
          Any modifications to the standard terms (optional)
        </p>
        <Textarea
          id="modifications"
          rows={3}
          value={values.modifications}
          onChange={(e) => set('modifications', e.target.value)}
          placeholder="List any modifications here, or leave blank to use the standard terms."
        />
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full text-base h-12">
          Generate NDA →
        </Button>
      </div>
    </form>
  );
}
