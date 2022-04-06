import { Text, styled } from '@nextui-org/react';

const PriceLabel = ({ chaosValue }) => {
  const StyledPriceLabel = styled('div', {
    gap: '4px',
  });

  return (
    <StyledPriceLabel css={{ dflex: 'center' }}>
      <Text size={16}>{chaosValue}</Text>
      <img src="./assets/chaos-orb.png" alt="Chaos orb" width={20} />
    </StyledPriceLabel>
  );
};

export default PriceLabel;
