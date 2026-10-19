import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { SymbolView } from 'expo-symbols';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { useColorSchemeName, useThemeColors } from '@/components/useThemeColors';
import { formatMessage, useI18n } from '@/i18n';
import { startOfLocalDay } from '@/lib/birthdays';
import { formatDayMonth } from '@/lib/calendarText';
import { createId } from '@/lib/id';
import { birthdayPhotoUri, deleteBirthdayPhoto, saveBirthdayPhoto } from '@/lib/photos';
import { useBirthdayStore, useBirthdaysHydrated } from '@/store/birthdays';

export default function BirthdayEditorScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const routeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isNew = routeId === 'new';
  const hydrated = useBirthdaysHydrated();
  const existing = useBirthdayStore((state) =>
    state.birthdays.find((item) => item.id === routeId),
  );
  const save = useBirthdayStore((state) => state.save);
  const remove = useBirthdayStore((state) => state.remove);
  const { locale, t } = useI18n();
  const colors = useThemeColors();
  const scheme = useColorSchemeName();
  const draftId = useRef(isNew ? createId() : routeId);
  const [name, setName] = useState(existing?.name ?? '');
  const [note, setNote] = useState(existing?.note ?? '');
  const [date, setDate] = useState(() =>
    existing
      ? new Date(existing.year ?? 2000, existing.month - 1, existing.day)
      : startOfLocalDay(new Date()),
  );
  const [includeYear, setIncludeYear] = useState(existing?.year != null);
  const [yearChosen, setYearChosen] = useState(existing?.year != null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(existing?.photoFileName ?? null);
  const [pendingUri, setPendingUri] = useState<string | null>(null);
  const [pendingMime, setPendingMime] = useState<string | null>(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(isNew);

  useEffect(() => {
    if (!hydrated || isNew || loaded) return;
    if (!existing) {
      router.back();
      return;
    }
    setName(existing.name);
    setNote(existing.note);
    setDate(new Date(existing.year ?? 2000, existing.month - 1, existing.day));
    setIncludeYear(existing.year != null);
    setYearChosen(existing.year != null);
    setPhotoFileName(existing.photoFileName);
    setLoaded(true);
  }, [existing, hydrated, isNew, loaded]);

  const canSave = name.trim().length > 0 && !saving;
  const ready = hydrated && (isNew || loaded);
  const previewUri = photoRemoved ? null : pendingUri ?? birthdayPhotoUri(photoFileName);
  const dateLabel = includeYear
    ? `${formatDayMonth(locale, date)} ${date.getFullYear()}`
    : formatDayMonth(locale, date);

  async function pickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('birthday.photoDeniedTitle'), t('birthday.photoDeniedMessage'));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setPendingUri(asset.uri);
    setPendingMime(asset.mimeType ?? null);
    setPhotoRemoved(false);
  }

  function onToggleYear(enabled: boolean) {
    setIncludeYear(enabled);
    if (enabled && !yearChosen) {
      setDate((current) => dateWithYear(current, new Date().getFullYear()));
      setYearChosen(true);
    }
  }

  async function onSave() {
    if (!canSave || !draftId.current) return;
    setSaving(true);
    let nextPhoto = photoRemoved ? null : photoFileName;
    try {
      if (pendingUri) {
        nextPhoto = await saveBirthdayPhoto(pendingUri, draftId.current, pendingMime);
        if (photoFileName && photoFileName !== nextPhoto) {
          deleteBirthdayPhoto(photoFileName);
        }
      } else if (photoRemoved) {
        deleteBirthdayPhoto(photoFileName);
      }
    } catch {
      setSaving(false);
      Alert.alert(t('birthday.photoError'));
      return;
    }

    save({
      id: draftId.current,
      name: name.trim(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      year: includeYear ? date.getFullYear() : null,
      note: note.trim(),
      photoFileName: nextPhoto,
    });
    router.back();
  }

  function onDelete() {
    if (!existing) return;
    Alert.alert(t('birthday.deleteTitle'), formatMessage(t('birthday.deleteMessage'), { name: existing.name }), [
      { text: t('birthday.cancel'), style: 'cancel' },
      {
        text: t('birthday.delete'),
        style: 'destructive',
        onPress: () => {
          deleteBirthdayPhoto(existing.photoFileName);
          remove(existing.id);
          router.back();
        },
      },
    ]);
  }

  if (!ready) {
    return <SafeAreaView style={[styles.screen, { backgroundColor: colors.grouped }]} />;
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.grouped }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.toolbar}>
          <Text style={[styles.toolbarTitle, { color: colors.text }]}>
            {isNew ? t('birthday.new') : t('birthday.edit')}
          </Text>
          <View style={styles.toolbarActions}>
            <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.toolbarButton}>
              <Text style={[styles.toolbarText, { color: colors.today }]}>{t('birthday.cancel')}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={!canSave}
              onPress={() => void onSave()}
              style={styles.toolbarButton}>
              <Text
                style={[
                  styles.toolbarSave,
                  { color: colors.today, opacity: canSave ? 1 : 0.35 },
                ]}>
                {t('birthday.save')}
              </Text>
            </Pressable>
          </View>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior="automatic">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('a11y.photo')}
            onPress={() => void pickPhoto()}
            style={styles.photo}>
            {previewUri ? (
              <Avatar name={name} photoFileName={null} previewUri={previewUri} size={96} />
            ) : (
              <SymbolView
                name="person.crop.circle.badge.plus"
                tintColor={colors.secondary}
                size={88}
                fallback={
                  <View style={[styles.photoFallback, { borderColor: colors.separator }]}>
                    <Text style={{ color: colors.secondary, fontSize: 32, fontWeight: '300' }}>+</Text>
                  </View>
                }
              />
            )}
          </Pressable>
          {previewUri ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setPhotoRemoved(true);
                setPendingUri(null);
              }}
              style={styles.removePhoto}>
              <Text style={{ color: colors.today, fontSize: 15 }}>{t('birthday.removePhoto')}</Text>
            </Pressable>
          ) : null}

          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t('birthday.namePlaceholder')}
              placeholderTextColor={colors.secondary}
              style={[styles.nameInput, { color: colors.text }]}
              autoCorrect
              returnKeyType="done"
            />
          </View>

          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.dateRow}>
              <Text style={[styles.rowLabel, { color: colors.text }]}>{t('birthday.date')}</Text>
              <Text style={[styles.dateValue, { color: colors.today }]}>{dateLabel}</Text>
            </View>
            {Platform.OS === 'ios' || Platform.OS === 'web' ? (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                locale={locale === 'el' ? 'el-GR' : 'en-US'}
                themeVariant={scheme}
                accentColor={colors.today}
                onValueChange={(_event, next) => setDate(startOfLocalDay(next))}
              />
            ) : (
              <>
                <Pressable onPress={() => setPickerOpen(true)} style={styles.androidPick}>
                  <Text style={{ color: colors.today, fontSize: 17 }}>{dateLabel}</Text>
                </Pressable>
                {pickerOpen ? (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onDismiss={() => setPickerOpen(false)}
                    onValueChange={(_event, next) => {
                      setPickerOpen(false);
                      setDate(startOfLocalDay(next));
                    }}
                  />
                ) : null}
              </>
            )}
            <View style={[styles.switchRow, { borderTopColor: colors.separator }]}>
              <Text style={[styles.rowLabel, { color: colors.text }]}>{t('birthday.yearToggle')}</Text>
              <Switch
                value={includeYear}
                onValueChange={onToggleYear}
                trackColor={{ true: colors.today, false: colors.quaternary }}
              />
            </View>
            <Text style={[styles.hint, { color: colors.secondary }]}>{t('birthday.yearHint')}</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder={t('birthday.notePlaceholder')}
              placeholderTextColor={colors.secondary}
              style={[styles.noteInput, { color: colors.text }]}
              multiline
              textAlignVertical="top"
            />
          </View>

          {!isNew && existing ? (
            <Pressable
              accessibilityRole="button"
              onPress={onDelete}
              style={[styles.card, styles.deleteButton, { backgroundColor: colors.card }]}>
              <Text style={{ color: colors.today, fontSize: 17 }}>{t('birthday.delete')}</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function dateWithYear(date: Date, year: number) {
  const month = date.getMonth();
  const day = date.getDate();
  const next = new Date(year, month, day);
  if (next.getMonth() !== month) {
    return new Date(year, month + 1, 0);
  }
  return next;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  toolbar: {
    height: 56,
    justifyContent: 'center',
  },
  toolbarTitle: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
  },
  toolbarActions: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolbarButton: {
    minWidth: 88,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  toolbarText: {
    fontSize: 17,
  },
  toolbarSave: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'right',
  },
  content: {
    paddingBottom: 32,
  },
  photo: {
    alignSelf: 'center',
    marginTop: 8,
    minWidth: 96,
    minHeight: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoFallback: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePhoto: {
    alignSelf: 'center',
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  nameInput: {
    fontSize: 17,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
  },
  dateRow: {
    minHeight: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowLabel: {
    fontSize: 17,
  },
  dateValue: {
    fontSize: 17,
    flexShrink: 1,
    textAlign: 'right',
  },
  androidPick: {
    minHeight: 44,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  switchRow: {
    minHeight: 48,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  noteInput: {
    fontSize: 17,
    minHeight: 96,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  deleteButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
