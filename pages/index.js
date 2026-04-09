import Head from 'next/head';
import config from '../config';
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
    'Shrieking Essence of Anger': 'Ange',
    'Shrieking Essence of Anguish': 'Angu',
    'Shrieking Essence of Contempt': 'Con',
    'Shrieking Essence of Doubt': 'Do',
    'Shrieking Essence of Dread': 'Dr',
    'Shrieking Essence of Envy': 'En',
    'Shrieking Essence of Fear': 'Fe',
    'Shrieking Essence of Greed': 'Gr',
    'Shrieking Essence of Hatred': 'H',
    'Shrieking Essence of Loathing': 'L',
    'Shrieking Essence of Misery': 'Mi',
    'Shrieking Essence of Rage': 'Ra',
    'Shrieking Essence of Scorn': 'Sc',
    'Shrieking Essence of Sorrow': 'Sor',
    'Shrieking Essence of Spite': 'Sp',
    'Shrieking Essence of Suffering': 'Su',
    'Shrieking Essence of Torment': 'T',
    'Shrieking Essence of Woe': 'Wo',
    'Shrieking Essence of Wrath': 'Wr',
    'Shrieking Essence of Zeal': 'Z',
  };

  const res = await fetch(config.poeNinjaApiUrl);
  const data = await res.json();

  const itemsById = Object.fromEntries(
    data.items.map((item) => [item.id, item]),
  );

  const enriched = data.lines.map((line) => {
    const item = itemsById[line.id];
    return {
      name: item.name,
      image: `${config.poeCdnBaseUrl}${item.image}`,
      chaosValue: line.primaryValue,
    };
  });

  const shriekings = enriched.filter((e) => e.name.startsWith('Shrieking'));
  const deafenings = enriched.filter((e) => e.name.startsWith('Deafening'));

  const essenceRows = shriekings
    .map((shrieking, index) => {
      const suffix = shrieking.name.replace('Shrieking Essence ', '');
      const deafening = deafenings.find((d) => d.name.endsWith(suffix));
      if (!deafening) return null;

      const shriekingTripled = shrieking.chaosValue * 3;
      const gain_percent = (
        (deafening.chaosValue / shriekingTripled) * 100 -
        100
      ).toFixed(2);
      return {
        key: `${index}`,
        essence_name: shrieking.name,
        essence_picture: deafening.image,
        shrieking_price: shrieking.chaosValue,
        deafening_price: deafening.chaosValue,
        chaos_diff: (deafening.chaosValue - shrieking.chaosValue * 3).toFixed(
          2,
        ),
        gain_percent,
        should_upgrade: gain_percent >= 0,
        regex: regexEntries[shrieking.name],
      };
    })
    .filter(Boolean);

  const profitableEssences = essenceRows.filter(
    (essenceRow) => essenceRow.gain_percent >= 0,
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
