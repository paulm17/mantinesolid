import { YearLevelGroup } from './YearLevelGroup';

export default { title: 'YearLevelGroup' };

export function Usage() {
  return (
    <div style={{ padding: '40px' }}>
      <div>1 column</div>
      <YearLevelGroup year="2022-04-11" mb={50} mt="xs" />

      <div>2 columns</div>
      <YearLevelGroup numberOfColumns={2} year="2022-04-11" mb={50} mt="xs" />

      <div>3 columns</div>
      <YearLevelGroup numberOfColumns={3} year="2022-04-11" mb={50} mt="xs" />
    </div>
  );
}

export function Sizes() {
  const sizes = (['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
    <YearLevelGroup numberOfColumns={3} size={size} mt="xl" year="2022-04-11" />
  ));
  return <div style={{ padding: '40px' }}>{sizes}</div>;
}
