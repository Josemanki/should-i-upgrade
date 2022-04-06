const fs = require('fs');
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Container, Row, Col } from '@nextui-org/react';
import Header from '../components/Header';
import EssenceTable from '../components/EssenceTable';

export default function Home({ essencePairs }) {
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
        <EssenceTable essencePairs={essencePairs} />
      </Container>
    </main>
  );
}

export async function getServerSideProps() {
  // // Fetch data from external API
  // const res = await fetch(
  //   `https://poe.ninja/api/data/ItemOverview?league=Archnemesis&type=Essence&language=en`
  // );
  // const data = await res.json();

  const data = JSON.parse(
    fs.readFileSync('./mockData.json', { encoding: 'utf8' })
  );

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

  const essenceColumns = essencePairs.map((essencePair, index) => {
    const shrieking = essencePair[0];
    const deafening = essencePair[1];
    return {
      key: `essence-${index}`,
      essence_name: shrieking.baseType,
      shrieking_price: shrieking.chaosValue,
      deafening_price: deafening.chaosValue,
      chaos_diff: deafening.chaosValue - shrieking.chaosValue * 3,
      gain_percent: '',
      should_upgrade: '',
    };
  });

  console.log(essenceColumns);

  // Pass data to the page via props
  return { props: { essencePairs, essenceColumns } };
}
