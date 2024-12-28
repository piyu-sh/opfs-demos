

import { Welcome } from '@/components/Welcome/Welcome';
import { Container, List, ListItem } from '@mantine/core';
import Link from 'next/link';
export default function HomePage() {
  return (
    <>
      <Welcome text='NDC London 2025 Demos' />
      <Container>
        <List>
          <ListItem>
            <Link href="/recording-demo">Recording Demo</Link>
          </ListItem>
          <ListItem>
            <Link href="/logs-demo">Logs Demo</Link>
          </ListItem>
        </List>
      </Container>
    </>
  );
}
