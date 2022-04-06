import Head from 'next/head';
import { Container, Text } from '@nextui-org/react';
import Header from '../components/Header';
import EssenceTable from '../components/EssenceTable';

export default function Home({ essenceRows }) {
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
        <Text css={{ mt: '32px' }}>
          {
            "Let's figure out if you should upgrade your shrieking essences or calculate the price as-is!"
          }
        </Text>
        <EssenceTable essenceRows={essenceRows} />
      </Container>
    </main>
  );
}

export async function getServerSideProps() {
  const res = await fetch(
    `https://poe.ninja/api/data/ItemOverview?league=Archnemesis&type=Essence&language=en`
  );
  const data = await res.json();

  const targetEssences = data.lines.filter(
    (essence) => essence.mapTier === 6 || essence.mapTier === 7
  );

  const essenceBasetypeSet = new Set(
    targetEssences.map((item) => item.baseType)
  );

  const essenceBasetypes = [...essenceBasetypeSet];

  const essencePairs = essenceBasetypes.map((baseType) => {
    const foundPairs = targetEssences.filter(
      (essence) => essence.baseType === baseType
    );
    return foundPairs.sort((a, b) => {
      return a.mapTier - b.mapTier;
    });
  });

  const essenceRows = essencePairs.map((essencePair, index) => {
    const shrieking = essencePair[0];
    const deafening = essencePair[1];
    const shriekingTripled = shrieking.chaosValue * 3;
    const gain_percent = (
      (deafening.chaosValue / shriekingTripled) *
      100
    ).toFixed(2);
    return {
      key: `${index}`,
      essence_name: shrieking.baseType,
      essence_picture: deafening.icon,
      shrieking_price: shrieking.chaosValue,
      deafening_price: deafening.chaosValue,
      chaos_diff: (deafening.chaosValue - shrieking.chaosValue * 3).toFixed(2),
      gain_percent,
      should_upgrade: gain_percent > 100 ? true : false,
    };
  });

  // Pass data to the page via props
  return { props: { essenceRows } };
}
