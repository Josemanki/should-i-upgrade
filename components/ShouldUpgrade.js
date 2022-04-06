import { styled } from '@nextui-org/react';

const ShouldUpgrade = ({ shouldUpgrade }) => {
  const StyledIcon = styled('div', {
    gap: '4px',
  });

  return (
    <StyledIcon css={{ dflex: 'center' }}>
      {shouldUpgrade ? (
        <img src="./assets/tick.svg" alt="Should upgrade" />
      ) : (
        <img src="./assets/cross.svg" alt="Should not upgrade" />
      )}
    </StyledIcon>
  );
};

export default ShouldUpgrade;
