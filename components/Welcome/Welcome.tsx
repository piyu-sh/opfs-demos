import { Title } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome({ text }: { text: string }) {
  return (
    <>
      <Title className={classes.title} ta="center" mt={10}>
        {text}
      </Title>
      {/* <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        This starter Next.js project includes a minimal setup for server side rendering, if you want
        to learn more on Mantine + Next.js integration follow{' '}
        <Anchor href="https://mantine.dev/guides/next/" size="lg">
          this guide
        </Anchor>
        . To get started edit page.tsx file.
      </Text> */}
    </>
  );
}
