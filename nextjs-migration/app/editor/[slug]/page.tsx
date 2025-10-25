import EditorComponent from '../../components/editor/EditorComponent';
import AuthGuard from '../../components/guards/AuthGuard';

export default function EditorPage() {
  return (
    <AuthGuard>
      <EditorComponent />
    </AuthGuard>
  );
}
