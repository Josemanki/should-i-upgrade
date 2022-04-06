import { Table } from '@nextui-org/react';
import PriceLabel from './PriceLabel';
import { User } from '@nextui-org/react';
import ShouldUpgrade from './ShouldUpgrade';

const EssenceTable = ({ essenceRows }) => {
  const columns = [
    {
      key: 'essence_name',
      label: 'Essence Name',
    },
    {
      key: 'shrieking_price',
      label: 'Shrieking Price',
    },
    {
      key: 'deafening_price',
      label: 'Deafening Price',
    },
    {
      key: 'chaos_diff',
      label: 'Chaos Difference',
    },
    {
      key: 'gain_percent',
      label: 'Gain %',
    },
    {
      key: 'should_upgrade',
      label: 'Should Upgrade?',
    },
  ];

  const sortedRows = essenceRows.sort(
    (a, b) => b.gain_percent - a.gain_percent
  );

  const renderCell = (essence, columnKey) => {
    const cellValue = essence[columnKey];
    switch (columnKey) {
      case 'essence_name':
        return (
          <User
            name={essence.essence_name}
            size="sm"
            src={essence.essence_picture}
          />
        );
      case 'shrieking_price':
        return <PriceLabel chaosValue={essence.shrieking_price} />;
      case 'deafening_price':
        return <PriceLabel chaosValue={essence.deafening_price} />;
      case 'chaos_diff':
        return <PriceLabel chaosValue={essence.chaos_diff} />;
      case 'should_upgrade':
        return <ShouldUpgrade shouldUpgrade={essence.should_upgrade} />;

      default:
        return cellValue;
    }
  };

  return (
    <Table
      aria-label="Table with essences"
      css={{
        height: 'auto',
        minWidth: '100%',
      }}
    >
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column key={column.key}>{column.label}</Table.Column>
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
};

export default EssenceTable;
