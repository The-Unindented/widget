import { useColorScheme } from 'react-native';
import { useThemeStore, ThemeMode } from '@/store/themeStore';
import { palettes, Palette } from '@/theme/palette';

export type EffectiveTheme = 'light' | 'dark' | 'oled';

export const useTheme = (): {
  mode: ThemeMode;
  effective: EffectiveTheme;
  colors: Palette;
  setMode: (mode: ThemeMode) => void;
} => {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const systemScheme = useColorScheme();

  // "system" resolves to light/dark from the OS setting; OLED is always explicit
  const effective: EffectiveTheme =
    mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;

  return { mode, effective, setMode, colors: palettes[effective] };
};
