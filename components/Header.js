import React from 'react';
import { Text, Container } from '@nextui-org/react';

const Header = () => {
  return (
    <header>
      <Container>
        <Text h1 color="success">
          Should I{' '}
          <Text span color="$red500" css={{ ml: '0px' }}>
            Upgrade?
          </Text>
        </Text>
      </Container>
    </header>
  );
};

export default Header;
