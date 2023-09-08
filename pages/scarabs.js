import Head from 'next/head';
import { useState } from 'react';
import { Container, Text, styled, Dropdown } from '@nextui-org/react';
import Header from '../components/Header';
import ScarabTable from '../components/ScarabTable';

export default function Scarabs({ scarabPairs }) {
  const TextContainer = styled('div', {
    margin: '16px 0',
  });

  const options = [
    {
      name: 'Rusted to Polished',
      key: 'rustedToPolished',
    },
    {
      name: 'Polished to Gilded',
      key: 'polishedToGilded',
    },
  ];

  const keyToNameMap = {
    rustedToPolished: 'Rusted to Polished',
    polishedToGilded: 'Polished to Gilded',
    gildedToWinged: 'Gilded to Winged',
  };

  const [upgradeTier, setUpgradeTier] = useState('rustedToPolished');

  return (
    <main>
      <Head>
        <title>Should I Upgrade?</title>
        <meta
          name="description"
          content="Find out whether you should upgrade your scarabs in Path of Exile."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Container>
        <TextContainer>
          <Text>
            Let&apos;s figure out if you should upgrade your scarabs or
            calculate the price as-is!
          </Text>
          {/* <Text b>
            You are also able to copy this regex below to easily check your
            stash for which ones to upgrade!
          </Text> */}
        </TextContainer>
        <Dropdown>
          <Dropdown.Button flat>{keyToNameMap[upgradeTier]}</Dropdown.Button>
          <Dropdown.Menu
            aria-label="Static Actions"
            items={options}
            onAction={(tier) => setUpgradeTier(tier)}
          >
            {(item) => {
              return <Dropdown.Item key={item.key}>{item.name}</Dropdown.Item>;
            }}
          </Dropdown.Menu>
        </Dropdown>
        <ScarabTable scarabRows={scarabPairs} upgradeTier={upgradeTier} />
      </Container>
    </main>
  );
}

export async function getServerSideProps() {
  const getScarabPair = (targetScarabs, firstArray, secondArray) => {
    const baseTypes = targetScarabs.rusted.map((scarab) => {
      const split = scarab.name.split(' ');
      split.shift();
      const joined = split.join(' ');
      return joined;
    });

    const merged = [...firstArray, ...secondArray];
    const pairs = baseTypes.map((baseType) =>
      merged.filter((scarab) => scarab.name.includes(baseType))
    );

    const scarabRows = pairs.map((scarabPair, index) => {
      const lower = scarabPair[0];
      const higher = scarabPair[1];
      const tripled = lower.chaosValue * 3;
      const gain_percent = ((higher.chaosValue / tripled) * 100 - 100).toFixed(
        2
      );
      return {
        key: `${index}`,
        scarab_name: lower.name,
        scarab_picture: lower.icon,
        shrieking_price: lower.chaosValue,
        deafening_price: higher.chaosValue,
        chaos_diff: (higher.chaosValue - lower.chaosValue * 3).toFixed(2),
        gain_percent,
        should_upgrade: gain_percent >= 0 ? true : false,
      };
    });
    return scarabRows;
  };

  const res = await fetch(
    `https://poe.ninja/api/data/itemoverview?league=Ancestor&type=Scarab&language=en`
  );
  const data = await res.json();

  const targetScarabs = {
    rusted: data.lines.filter((item) => item.name.startsWith('Rusted')),
    polished: data.lines.filter((item) => item.name.startsWith('Polished')),
    gilded: data.lines.filter((item) => item.name.startsWith('Gilded')),
  };

  const scarabPairs = {
    rustedToPolished: getScarabPair(
      targetScarabs,
      targetScarabs.rusted,
      targetScarabs.polished
    ),
    polishedToGilded: getScarabPair(
      targetScarabs,
      targetScarabs.polished,
      targetScarabs.gilded
    ),
  };
  return { props: { targetScarabs, scarabPairs } };
}
