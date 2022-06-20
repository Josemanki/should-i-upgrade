import Head from 'next/head';
import { Container, Text, styled } from '@nextui-org/react';
import Header from '../components/Header';
import EssenceTable from '../components/EssenceTable';
import RegexField from '../components/RegexField';

export default function Home({ essenceRows, essenceRegex }) {
  const TextContainer = styled('div', {
    margin: '16px 0',
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
            Let's figure out if you should upgrade your shrieking essences or
            calculate the price as-is!
          </Text>
          <Text b>
            You are also able to copy this regex below to easily check your
            stash for which ones to upgrade!
          </Text>
        </TextContainer>
        <RegexField essenceRegex={essenceRegex} />
        <EssenceTable essenceRows={essenceRows} />
      </Container>
    </main>
  );
}

export async function getServerSideProps() {
  // of (L|Sor|Sp|Ra|En|Sc|Z|Gr|Ange|Con|Wo|H|Wr|Dr|Fe|Angu|Do|Mi|T|Su)

  const regexEntries = {
    'Essence of Loathing': 'L',
    'Essence of Sorrow': 'Sor',
    'Essence of Spite': 'Sp',
    'Essence of Rage': 'Ra',
    'Essence of Envy': 'En',
    'Essence of Scorn': 'Sc',
    'Essence of Zeal': 'Z',
    'Essence of Greed': 'Gr',
    'Essence of Anger': 'Ange',
    'Essence of Contempt': 'Con',
    'Essence of Woe': 'Wo',
    'Essence of Hatred': 'H',
    'Essence of Wrath': 'Wr',
    'Essence of Dread': 'Dr',
    'Essence of Fear': 'Fe',
    'Essence of Anguish': 'Angu',
    'Essence of Doubt': 'Do',
    'Essence of Misery': 'Mi',
    'Essence of Torment': 'T',
    'Essence of Suffering': 'Su',
  };

  const res = await fetch(
    `https://poe.ninja/api/data/ItemOverview?league=Sentinel&type=Essence&language=en`
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
      (deafening.chaosValue / shriekingTripled) * 100 -
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
      should_upgrade: gain_percent >= 0 ? true : false,
      regex: regexEntries[shrieking.baseType],
    };
  });

  const profitableEssences = essenceRows.filter(
    (essenceRow) => essenceRow.gain_percent >= 0
  );

  let essenceRegex = '';

  profitableEssences.forEach((essence, index) => {
    essenceRegex +=
      index === profitableEssences.length - 1
        ? `${essence.regex}`
        : `${essence.regex}|`;
  });

  // Pass data to the page via props
  console.log(essenceRegex);
  return { props: { essenceRows, essenceRegex } };
}
