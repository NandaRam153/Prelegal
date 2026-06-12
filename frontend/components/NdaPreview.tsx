'use client';

import React, { useState } from 'react';
import type { MndaFormValues } from '@/lib/types';
import { SIG_FIELDS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { getCoverPageFields, getStandardTermsHtml } from '@/lib/ndaTemplate';

export default function NdaPreview({
  values,
  onBack,
}: {
  values: MndaFormValues;
  onBack: () => void;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  async function handleDownload() {
    setIsDownloading(true);
    setDownloadError(null);
    try {
      const [{ pdf }, { NdaPdfDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/NdaPdfDocument'),
      ]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const element = React.createElement(NdaPdfDocument, { values }) as any;
      const blob = await pdf(element).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mutual-nda.pdf';
      a.click();
      // Defer revocation so the browser has time to read the blob URL.
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setDownloadError('PDF generation failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }

  const coverPageFields = getCoverPageFields(values);
  const standardTermsHtml = getStandardTermsHtml(values);

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 shadow-sm px-6 py-4">
        <Button variant="outline" onClick={onBack}>
          ← Edit
        </Button>
        <div className="flex flex-col items-end gap-1">
          <Button onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? 'Generating PDF…' : '↓ Download PDF'}
          </Button>
          {downloadError && (
            <p className="text-xs text-red-600">{downloadError}</p>
          )}
        </div>
      </div>

      {/* Document */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-12 py-10 font-serif text-gray-900">
        {/* ── Cover Page ── */}
        <div className="pb-8 border-b border-gray-300 space-y-5">
          <h1 className="text-2xl font-bold text-center">
            Mutual Non-Disclosure Agreement
          </h1>

          <p className="text-sm leading-relaxed text-gray-700">
            This Mutual Non-Disclosure Agreement (the &quot;MNDA&quot;) consists of: (1) this
            Cover Page (&quot;<strong>Cover Page</strong>&quot;) and (2) the Common Paper Mutual
            NDA Standard Terms Version 1.0 (&quot;<strong>Standard Terms</strong>&quot;) identical
            to those posted at{' '}
            <a
              href="https://commonpaper.com/standards/mutual-nda/1.0"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              commonpaper.com/standards/mutual-nda/1.0
            </a>
            . Any modifications of the Standard Terms should be made on the Cover Page, which
            will control over conflicts with the Standard Terms.
          </p>

          {/* Field table */}
          <table className="w-full text-sm border-collapse">
            <tbody>
              {coverPageFields.map(([label, value]) => (
                <tr key={label} className="border-b border-gray-200">
                  <td className="py-3 pr-6 font-semibold text-gray-700 align-top w-52">
                    {label}
                  </td>
                  <td className="py-3 text-gray-900 whitespace-pre-wrap">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Signature block */}
          <p className="text-sm text-gray-700">
            By signing this Cover Page, each party agrees to enter into this MNDA as of the
            Effective Date.
          </p>
          <table className="w-full text-sm border border-gray-300 border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 px-3 py-2 text-left text-gray-700 w-36 bg-gray-50" />
                <th className="border border-gray-300 px-3 py-2 text-center text-gray-700 bg-gray-50">
                  PARTY 1
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center text-gray-700 bg-gray-50">
                  PARTY 2
                </th>
              </tr>
            </thead>
            <tbody>
              {SIG_FIELDS.map((field) => (
                <tr key={field}>
                  <td className="border border-gray-300 px-3 py-4 text-xs font-medium text-gray-700">
                    {field}
                  </td>
                  <td className="border border-gray-300 px-3 py-4" />
                  <td className="border border-gray-300 px-3 py-4" />
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-xs text-gray-500">
            Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under{' '}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY 4.0
            </a>
            .
          </p>
        </div>

        {/* ── Standard Terms ── */}
        <div className="pt-8">
          <h2 className="text-xl font-bold mb-6">Standard Terms</h2>
          <div
            className="text-sm leading-relaxed [&_strong]:font-semibold [&_p]:mb-4"
            dangerouslySetInnerHTML={{ __html: standardTermsHtml }}
          />
        </div>
      </div>
    </div>
  );
}
