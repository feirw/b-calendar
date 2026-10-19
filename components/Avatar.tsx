import { Image, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/components/useThemeColors';
import { birthdayPhotoUri } from '@/lib/photos';

type AvatarProps = {
  name: string;
  photoFileName: string | null;
  size?: number;
  previewUri?: string | null;
};

export function Avatar({ name, photoFileName, size = 40, previewUri }: AvatarProps) {
  const colors = useThemeColors();
  const uri = previewUri ?? birthdayPhotoUri(photoFileName);
  const letter = name.trim().charAt(0).toLocaleUpperCase('el') || '?';

  if (uri) {
    return <Image source={{ uri }} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />;
  }

  return (
    <View
      style={[
        styles.fallback,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.todayFill,
        },
      ]}>
      <Text style={{ color: colors.today, fontSize: size * 0.4, fontWeight: '600' }}>{letter}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#E5E5EA',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
