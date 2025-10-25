import SettingsComponent from '../components/settings/SettingsComponent';
import AuthGuard from '../components/guards/AuthGuard';

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsComponent />
    </AuthGuard>
  );
}
