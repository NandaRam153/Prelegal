import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NdaPreview from '@/components/NdaPreview';
import type { MndaFormValues } from '@/lib/types';

const VALUES: MndaFormValues = {
  purpose: 'Evaluating a potential business partnership.',
  effectiveDate: '2024-06-15',
  mndaTermType: 'years',
  mndaTermYears: 1,
  confidentialityTermType: 'years',
  confidentialityTermYears: 2,
  governingLaw: 'Delaware',
  jurisdiction: 'courts located in New Castle, DE',
  modifications: '',
};

describe('NdaPreview', () => {
  it('renders the document title', () => {
    render(<NdaPreview values={VALUES} onBack={jest.fn()} />);
    expect(screen.getByText('Mutual Non-Disclosure Agreement')).toBeInTheDocument();
  });

  it('renders the Edit button', () => {
    render(<NdaPreview values={VALUES} onBack={jest.fn()} />);
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('renders the Download PDF button', () => {
    render(<NdaPreview values={VALUES} onBack={jest.fn()} />);
    expect(screen.getByRole('button', { name: /download pdf/i })).toBeInTheDocument();
  });

  it('calls onBack when the Edit button is clicked', () => {
    const onBack = jest.fn();
    render(<NdaPreview values={VALUES} onBack={onBack} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders the Standard Terms section heading', () => {
    render(<NdaPreview values={VALUES} onBack={jest.fn()} />);
    expect(screen.getByRole('heading', { name: 'Standard Terms' })).toBeInTheDocument();
  });

  it('renders the user-entered purpose in the cover page table', () => {
    render(<NdaPreview values={VALUES} onBack={jest.fn()} />);
    // Purpose appears in the cover page field table as the row value.
    const matches = screen.getAllByText('Evaluating a potential business partnership.');
    expect(matches.length).toBeGreaterThan(0);
  });

  it('renders the governing law in the document', () => {
    render(<NdaPreview values={VALUES} onBack={jest.fn()} />);
    const matches = screen.getAllByText(/delaware/i);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('renders PARTY 1 and PARTY 2 signature columns', () => {
    render(<NdaPreview values={VALUES} onBack={jest.fn()} />);
    expect(screen.getByText('PARTY 1')).toBeInTheDocument();
    expect(screen.getByText('PARTY 2')).toBeInTheDocument();
  });

  it('renders all signature row labels', () => {
    render(<NdaPreview values={VALUES} onBack={jest.fn()} />);
    expect(screen.getByText('Signature')).toBeInTheDocument();
    expect(screen.getByText('Print Name')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
  });

  it('shows modifications row when modifications are provided', () => {
    render(
      <NdaPreview
        values={{ ...VALUES, modifications: 'Section 5 is amended.' }}
        onBack={jest.fn()}
      />
    );
    expect(screen.getByText('MNDA Modifications')).toBeInTheDocument();
    expect(screen.getByText('Section 5 is amended.')).toBeInTheDocument();
  });

  it('omits modifications row when modifications is empty', () => {
    render(<NdaPreview values={{ ...VALUES, modifications: '' }} onBack={jest.fn()} />);
    expect(screen.queryByText('MNDA Modifications')).not.toBeInTheDocument();
  });
});
