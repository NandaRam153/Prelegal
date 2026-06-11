// Stub for @react-pdf/renderer — canvas/Worker APIs are unavailable in jsdom.
const noop = () => null;

export const Document = noop;
export const Page = noop;
export const Text = noop;
export const View = noop;
export const StyleSheet = { create: (styles: object) => styles };
export const Font = { register: jest.fn() };
export const pdf = jest.fn().mockReturnValue({
  toBlob: jest.fn().mockResolvedValue(new Blob(['%PDF-1.4'], { type: 'application/pdf' })),
});
