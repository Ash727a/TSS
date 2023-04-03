const rock_1_data = {
  SIO2: 40.58,
  TIO2: 12.83,
  Al2O3: 10.91,
  // ... so on and so forth
} as const;

const rock_2_data = {
  GOUDA: 12.53,
  CHEDDAR: 59.13,
  MOZZARELLA: 28.34,
};

export const spec_data_map = {
  '333030303237424545303439': rock_1_data,
  '333030303332433934413831': rock_2_data,
  'id-3': {},
  'id-4': {},
} as const;

type ValidRockId = keyof typeof spec_data_map;

const rock_id_array = Object.keys(spec_data_map);

export function isValidRockId(id: string): id is ValidRockId {
  return rock_id_array.includes(id as ValidRockId);
}
