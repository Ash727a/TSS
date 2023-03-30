const rock_1_data = {
  SIO2: 40.58,
  TIO2: 12.83,
  Al2O3: 10.91,
  // ... so on and so forth
} as const;

export const spec_data_map = {
  'id-1': rock_1_data,
  'id-2': {},
  'id-3': {},
  'id-4': {},
} as const;

type ValidRockId = keyof typeof spec_data_map;

const rock_id_array = Object.keys(spec_data_map);

export function isValidRockId(id: string): id is ValidRockId {
  return rock_id_array.includes(id as ValidRockId);
}
