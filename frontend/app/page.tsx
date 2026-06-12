'use client';

import { useState } from 'react';
import NdaForm from '@/components/NdaForm';
import NdaPreview from '@/components/NdaPreview';
import type { MndaFormValues } from '@/lib/types';

type View = 'form' | 'preview';

export default function Home() {
  const [view, setView] = useState<View>('form');
  const [formValues, setFormValues] = useState<MndaFormValues | null>(null);

  function handleSubmit(values: MndaFormValues) {
    setFormValues(values);
    setView('preview');
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Mutual NDA Creator
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Common Paper Mutual Non-Disclosure Agreement — fill in, preview, and download
          </p>
        </header>

        {view === 'form' ? (
          <NdaForm initialValues={formValues ?? undefined} onSubmit={handleSubmit} />
        ) : (
          <NdaPreview
            values={formValues!}
            onBack={() => setView('form')}
          />
        )}
      </div>
    </main>
  );
}
