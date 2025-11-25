import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  
  const background = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  
  const backgroundColor = typeof background === 'object' ? background.primary : background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}