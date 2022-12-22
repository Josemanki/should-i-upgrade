import { Table, User, Text } from '@nextui-org/react';
import PriceLabel from './PriceLabel';
import ShouldUpgrade from './ShouldUpgrade';

const ScarabTable = ({ scarabRows, upgradeTier }) => {
  let columns;
  switch (upgradeTier) {
    case 'rustedToPolished':
      columns = [
        {
          key: 'scarab_name',
          label: 'Scarab Name',
        },
        {
          key: 'shrieking_price',
          label: 'Rusted Price',
        },
        {
          key: 'deafening_price',
          label: 'Polished Price',
        },
        {
          key: 'chaos_diff',
          label: 'Chaos Difference',
        },
        {
          key: 'gain_percent',
          label: 'Profitability',
        },
        {
          key: 'should_upgrade',
          label: 'Should Upgrade?',
        },
      ];
      break;
    case 'polishedToGilded':
      columns = [
        {
          key: 'scarab_name',
          label: 'Scarab Name',
        },
        {
          key: 'shrieking_price',
          label: 'Polished Price',
        },
        {
          key: 'deafening_price',
          label: 'Gilded Price',
        },
        {
          key: 'chaos_diff',
          label: 'Chaos Difference',
        },
        {
          key: 'gain_percent',
          label: 'Profitability',
        },
        {
          key: 'should_upgrade',
          label: 'Should Upgrade?',
        },
      ];
      break;
    case 'gildedToWinged':
      columns = [
        {
          key: 'scarab_name',
          label: 'Scarab Name',
        },
        {
          key: 'shrieking_price',
          label: 'Gilded Price',
        },
        {
          key: 'deafening_price',
          label: 'Winged Price',
        },
        {
          key: 'chaos_diff',
          label: 'Chaos Difference',
        },
        {
          key: 'gain_percent',
          label: 'Profitability',
        },
        {
          key: 'should_upgrade',
          label: 'Should Upgrade?',
        },
      ];
      break;

    default:
      break;
  }

  const sortedRows = scarabRows[upgradeTier].sort(
    (a, b) => b.gain_percent - a.gain_percent
  );

  const renderCell = (scarab, columnKey) => {
    const cellValue = scarab[columnKey];
    switch (columnKey) {
      case 'scarab_name':
        return (
          <User
            name={scarab.scarab_name}
            size="sm"
            src={scarab.scarab_picture}
          />
        );
      case 'shrieking_price':
        return <PriceLabel chaosValue={scarab.shrieking_price} />;
      case 'deafening_price':
        return <PriceLabel chaosValue={scarab.deafening_price} />;
      case 'chaos_diff':
        return <PriceLabel chaosValue={scarab.chaos_diff} />;
      case 'gain_percent':
        return (
          <Text css={{ dflex: 'center' }}>{`${scarab.gain_percent}%`}</Text>
        );
      case 'should_upgrade':
        return <ShouldUpgrade shouldUpgrade={scarab.should_upgrade} />;

      default:
        return cellValue;
    }
  };

  return (
    <Table
      aria-label="Table with scarabs"
      css={{
        height: 'auto',
        minWidth: '100%',
        paddingLeft: 0,
        paddingRight: 0,
      }}
    >
      {console.log(upgradeTier)}
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column align="center" key={column.key}>
            {column.label}
          </Table.Column>
        )}
      </Table.Header>
      <Table.Body items={sortedRows}>
        {(item) => (
          <Table.Row>
            {(columnKey) => (
              <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
            )}
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );

  console.log(upgradeTier);
};

export default ScarabTable;
