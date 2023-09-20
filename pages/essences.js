import Head from 'next/head';
import { Container, Text, styled } from '@nextui-org/react';
import Header from '../components/Header';
import EssenceTable from '../components/EssenceTable';
import RegexField from '../components/RegexField';

export default function Essences({ essenceRows, essenceRegex }) {
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
            Let&apos;s figure out if you should upgrade your shrieking essences
            or calculate the price as-is!
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
    'Shrieking Essence of Loathing': 'L',
    'Shrieking Essence of Sorrow': 'Sor',
    'Shrieking Essence of Spite': 'Sp',
    'Shrieking Essence of Rage': 'Ra',
    'Shrieking Essence of Envy': 'En',
    'Shrieking Essence of Scorn': 'Sc',
    'Shrieking Essence of Zeal': 'Z',
    'Shrieking Essence of Greed': 'Gr',
    'Shrieking Essence of Anger': 'Ange',
    'Shrieking Essence of Contempt': 'Con',
    'Shrieking Essence of Woe': 'Wo',
    'Shrieking Essence of Hatred': 'H',
    'Shrieking Essence of Wrath': 'Wr',
    'Shrieking Essence of Dread': 'Dr',
    'Shrieking Essence of Fear': 'Fe',
    'Shrieking Essence of Anguish': 'Angu',
    'Shrieking Essence of Doubt': 'Do',
    'Shrieking Essence of Misery': 'Mi',
    'Shrieking Essence of Torment': 'T',
    'Shrieking Essence of Suffering': 'Su',
  };

  const res = await fetch(
    `https://poe.ninja/api/data/itemoverview?league=Ancestor&type=Essence&language=en`
  );
  const data = await res.json();

  const targetEssences = data.lines.filter(
    (essence) => essence.mapTier === 6 || essence.mapTier === 7
  );

  const essenceBasetypeSet = new Set(
    targetEssences.map((item) =>
      item.baseType.substr(item.baseType.indexOf(' ') + 1)
    )
  );

  const essenceBasetypes = [...essenceBasetypeSet];

  const essencePairs = essenceBasetypes.map((baseType) => {
    const foundPairs = targetEssences.filter((essence) =>
      essence.baseType.includes(baseType)
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
  return { props: { essenceRows, essenceRegex } };
}
