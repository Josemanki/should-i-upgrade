const fs = require('fs');

const data = JSON.parse(
  fs.readFileSync('./mockData.json', { encoding: 'utf8' })
);

const targetEssences = data.lines.filter(
  (essence) => essence.mapTier === 6 || essence.mapTier === 7
);

const essenceBasetypeSet = new Set(targetEssences.map((item) => item.baseType));

const essenceBasetypes = [...essenceBasetypeSet];

const essencePairs = essenceBasetypes.map((baseType) => {
  const foundPairs = targetEssences.filter(
    (essence) => essence.baseType === baseType
  );
  return foundPairs.sort((a, b) => {
    return a.mapTier - b.mapTier;
  })[0].name;
});

// const essenceColumns = essencePairs.map((essencePair, index) => {
//   const essenceOne = essencePair[0];
//   const essenceTwo = essencePair[1];
//   return {
//     key: `essence-${index}`,
//     essence_name: essenceOne.baseType,
//     shrieking_price: essenceOne.chaosValue + essenceOne.name,
//     deafening_price: essenceTwo.chaosValue + essenceTwo.name,
//     chaos_diff: '',
//     gain_percent: '',
//     should_upgrade: '',
//   };
// });
