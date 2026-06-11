import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NdaForm from '@/components/NdaForm';
import type { MndaFormValues } from '@/lib/types';

// Radix UI RadioGroup throws in jsdom due to internal PointerEvent / focus
// management incompatibilities with React 19. Mock at the UI-component level
// so these tests verify form logic without depending on Radix internals.
jest.mock('@/components/ui/radio-group', () => ({
  RadioGroup: ({
    children,
    value: _value,
    onValueChange: _onValueChange,
    className,
  }: {
    children: React.ReactNode;
    value?: string;
    onValueChange?: (v: string) => void;
    className?: string;
  }) => <div role="radiogroup" className={className}>{children}</div>,
  RadioGroupItem: ({
    value,
    id,
    className,
  }: {
    value: string;
    id?: string;
    className?: string;
  }) => <input type="radio" role="radio" value={value} id={id} className={className} />,
}));

const INITIAL_VALUES: MndaFormValues = {
  purpose: 'Pre-filled purpose text.',
  effectiveDate: '2024-01-15',
  mndaTermType: 'years',
  mndaTermYears: 2,
  confidentialityTermType: 'years',
  confidentialityTermYears: 1,
  governingLaw: 'California',
  jurisdiction: 'San Francisco, CA',
  modifications: '',
};

describe('NdaForm', () => {
  it('renders all form sections', () => {
    render(<NdaForm onSubmit={jest.fn()} />);
    expect(screen.getByRole('button', { name: /generate nda/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/purpose/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^effective date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/governing law/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/jurisdiction/i)).toBeInTheDocument();
  });

  it('shows error when purpose is cleared and form is submitted', async () => {
    const user = userEvent.setup();
    render(<NdaForm onSubmit={jest.fn()} />);

    await user.clear(screen.getByLabelText(/purpose/i));
    await user.click(screen.getByRole('button', { name: /generate nda/i }));

    expect(screen.getByText('Purpose is required.')).toBeInTheDocument();
  });

  it('shows error when effective date is empty on submit', async () => {
    const user = userEvent.setup();
    render(<NdaForm onSubmit={jest.fn()} />);
    // Purpose has default value so that check passes; date remains empty.
    await user.click(screen.getByRole('button', { name: /generate nda/i }));

    expect(screen.getByText('Effective Date is required.')).toBeInTheDocument();
  });

  it('shows error when governing law is empty on submit', async () => {
    const user = userEvent.setup();
    render(<NdaForm onSubmit={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/^effective date/i), { target: { value: '2024-06-01' } });
    await user.click(screen.getByRole('button', { name: /generate nda/i }));

    expect(screen.getByText('Governing Law is required.')).toBeInTheDocument();
  });

  it('shows error when jurisdiction is empty on submit', async () => {
    const user = userEvent.setup();
    render(<NdaForm onSubmit={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/^effective date/i), { target: { value: '2024-06-01' } });
    await user.type(screen.getByLabelText(/governing law/i), 'Delaware');
    await user.click(screen.getByRole('button', { name: /generate nda/i }));

    expect(screen.getByText('Jurisdiction is required.')).toBeInTheDocument();
  });

  it('calls onSubmit with correct values when all required fields are filled', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<NdaForm onSubmit={onSubmit} />);

    // Purpose has a valid default; set the remaining required fields.
    fireEvent.change(screen.getByLabelText(/^effective date/i), { target: { value: '2024-06-15' } });
    await user.type(screen.getByLabelText(/governing law/i), 'Delaware');
    await user.type(screen.getByLabelText(/jurisdiction/i), 'courts in New Castle, DE');

    await user.click(screen.getByRole('button', { name: /generate nda/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const submitted: MndaFormValues = onSubmit.mock.calls[0][0];
    expect(submitted.effectiveDate).toBe('2024-06-15');
    expect(submitted.governingLaw).toBe('Delaware');
    expect(submitted.jurisdiction).toBe('courts in New Castle, DE');
  });

  it('clears error banner when a previously errored form is successfully submitted', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<NdaForm onSubmit={onSubmit} />);

    // First trigger an error.
    await user.click(screen.getByRole('button', { name: /generate nda/i }));
    expect(screen.getByText('Effective Date is required.')).toBeInTheDocument();

    // Fix and resubmit.
    fireEvent.change(screen.getByLabelText(/^effective date/i), { target: { value: '2024-06-15' } });
    await user.type(screen.getByLabelText(/governing law/i), 'Delaware');
    await user.type(screen.getByLabelText(/jurisdiction/i), 'courts in Delaware');
    await user.click(screen.getByRole('button', { name: /generate nda/i }));

    expect(screen.queryByText('Effective Date is required.')).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('restores initial values when provided via initialValues prop', () => {
    render(<NdaForm onSubmit={jest.fn()} initialValues={INITIAL_VALUES} />);
    expect(screen.getByDisplayValue('Pre-filled purpose text.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('California')).toBeInTheDocument();
    expect(screen.getByDisplayValue('San Francisco, CA')).toBeInTheDocument();
  });

  it('does not call onSubmit when there is a validation error', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<NdaForm onSubmit={onSubmit} />);

    await user.clear(screen.getByLabelText(/purpose/i));
    await user.click(screen.getByRole('button', { name: /generate nda/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
