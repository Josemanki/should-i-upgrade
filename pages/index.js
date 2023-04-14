import { Card, Container, styled, Text } from '@nextui-org/react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

export default function Home() {
  const CardContainer = styled('div', {
    display: 'flex',
    gap: '4rem',
  });
  const TextContainer = styled('div', {
    margin: '36px 0',
  });

  return (
    <main>
      <Head>
        <title>Should I Upgrade?</title>
        <meta
          name="description"
          content="Find out whether you should upgrade your shrieking essences to deafening ones in Path of Exile."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Container>
        <TextContainer>
          <Text>
            Let&apos;s figure out if you should upgrade your shrieking essences
            or calculate the price as-is!
          </Text>
          <Text b>
            You are also able to copy this regex below to easily check your
            stash for which ones to upgrade!
          </Text>
        </TextContainer>
        <CardContainer>
          <Link href={'/essences'}>
            <Card isPressable>
              <Card.Image
                src={'./assets/essences.png'}
                width="100%"
                height={140}
                alt={'Essences'}
              />
              <Card.Footer css={{ display: 'flex', justifyContent: 'center' }}>
                <Text b>Essences</Text>
              </Card.Footer>
            </Card>
          </Link>
          <Link href={'/scarabs'}>
            <Card isPressable>
              <Card.Image
                src={'./assets/scarabs.png'}
                width="100%"
                height={140}
                alt={'Scarabs'}
              />
              <Card.Footer css={{ display: 'flex', justifyContent: 'center' }}>
                <Text b>Scarabs</Text>
              </Card.Footer>
            </Card>
          </Link>
        </CardContainer>
      </Container>
    </main>
  );
}
