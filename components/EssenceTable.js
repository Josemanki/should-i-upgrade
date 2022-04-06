import { Table } from '@nextui-org/react';

const EssenceTable = ({ essencePairs }) => {
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
  return (
    <Table
      aria-label="Table with essences"
      css={{
        height: 'auto',
        minWidth: '100%',
        mt: '48px',
      }}
    >
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column key={column.key}>{column.label}</Table.Column>
        )}
      </Table.Header>
      <Table.Body>
        {essencePairs.map((essencePair, index) => {
          return (
            <Table.Row key={index}>
              <Table.Cell>{essencePair[0].baseType}</Table.Cell>;
              <Table.Cell>Tony Reichert</Table.Cell>;
              <Table.Cell>Tony Reichert</Table.Cell>;
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default EssenceTable;
