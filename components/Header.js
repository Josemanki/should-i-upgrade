import React from 'react';
import { Text, Container } from '@nextui-org/react';
import Link from 'next/link';

const Header = () => {
  return (
    <header>
      <Container>
        <Link href={'/'}>
          <Text h1 color="success" css={{ cursor: 'pointer' }}>
            Should I{' '}
            <Text span color="error" css={{ ml: '0px' }}>
              Upgrade?
            </Text>
          </Text>
        </Link>
      </Container>
    </header>
  );
};

export default Header;
