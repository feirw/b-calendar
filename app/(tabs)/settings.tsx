import { EmptyState } from '@/components/EmptyState';
import { useI18n } from '@/i18n';

export default function SettingsScreen() {
  const { t } = useI18n();

  return <EmptyState title={t('settings.emptyTitle')} message={t('settings.emptyMessage')} />;
}
