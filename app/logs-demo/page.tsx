

import { Logs } from '@/components/Log/Logs';
import { Welcome } from '../../components/Welcome/Welcome';
export default function HomePage() {
  return (
    <>
      <Welcome text='Logs Demo' />
      <Logs />
    </>
  );
}
