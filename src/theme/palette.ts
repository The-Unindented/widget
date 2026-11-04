export interface Palette {
  background: string; // screen background
  surface: string; // cards, headers, sections
  fill: string; // subtle chip / placeholder fill
  textPrimary: string;
  textSecondary: string;
  hint: string; // empty-state / disabled text
  border: string;
  primary: string; // action buttons, tint
  onPrimary: string; // text/icons on top of primary
  danger: string;
  dangerSurface: string;
}

export const palettes: Record<'light' | 'dark' | 'oled', Palette> = {
  light: {
    background: '#F5F5F5',
    surface: '#FFFFFF',
    fill: '#F0F0F0',
    textPrimary: '#333333',
    textSecondary: '#666666',
    hint: '#999999',
    border: '#E0E0E0',
    primary: '#007AFF',
    onPrimary: '#FFFFFF',
    danger: '#FF3B30',
    dangerSurface: '#FFF0F0',
  },
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    fill: '#2A2A2C',
    textPrimary: '#F2F2F2',
    textSecondary: '#9E9E9E',
    hint: '#8A8A8E',
    border: '#2C2C2E',
    primary: '#0A84FF',
    onPrimary: '#FFFFFF',
    danger: '#FF453A',
    dangerSurface: '#2A1215',
  },
  oled: {
    background: '#000000',
    surface: '#0D0D0D',
    fill: '#1A1A1A',
    textPrimary: '#FFFFFF',
    textSecondary: '#8E8E93',
    hint: '#8E8E93',
    border: '#1C1C1E',
    primary: '#0A84FF',
    onPrimary: '#FFFFFF',
    danger: '#FF453A',
    dangerSurface: '#1A0D10',
  },
};
