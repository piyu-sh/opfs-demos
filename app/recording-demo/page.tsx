

import { RecordingComp } from '@/components/Recording/Recording';
import { Welcome } from '../../components/Welcome/Welcome';
export default function HomePage() {
  return (
    <>
      <Welcome text='Recording Demo' />
      {/* <ColorSchemeToggle /> */}
      <RecordingComp />
    </>
  );
}
