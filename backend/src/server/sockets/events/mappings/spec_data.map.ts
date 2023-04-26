// Based on handheld xrf data:
// |  Rock Type | Mare basalt               | Vesicular basalt                      | Olivine basalt              | Feldspathic basalt                    | Pigeonite basalt                    | Olivine basalt                         | Ilmenite basalt                      |
// |------------|---------------------------|---------------------------------------|-----------------------------|---------------------------------------|-------------------------------------|----------------------------------------|--------------------------------------|
// |  Petrology | Fine-grained, porphyritic | Medium-grained, small olv phenocrysts | Medium-grained, porphyritic | Fine-grained, phenos of plag, and pyx | Porphyritic, phenos of oliv and cpx | Medium-grained, phenos of oliv and pyx | Fine-grainded, vesicular, poikilitic |
// |  SiO2      | 40.58                     | 36.89                                 | 41.62                       | 46.72                                 | 46.53                               | 42.45                                  | 42.56                                |
// |  TiO2      | 12.83                     | 2.44                                  | 2.44                        | 1.1                                   | 3.4                                 | 1.56                                   | 9.38                                 |
// |  Al2O3     | 10.91                     | 9.6                                   | 9.52                        | 19.01                                 | 11.68                               | 11.44                                  | 12.03                                |
// |  FeO       | 13.18                     | 14.52                                 | 18.12                       | 7.21                                  | 16.56                               | 17.91                                  | 11.27                                |
// |  MnO       | 0.19                      | 0.24                                  | 0.27                        | 0.14                                  | 0.24                                | 0.27                                   | 0.17                                 |
// |  MgO       | 6.7                       | 5.3                                   | 11.1                        | 7.83                                  | 6.98                                | 10.45                                  | 9.7                                  |
// |  CaO       | 10.64                     | 8.22                                  | 8.12                        | 14.22                                 | 11.11                               | 9.37                                   | 10.52                                |
// |  K2O       | -0.11                     | -0.13                                 | -0.12                       | 0.43                                  | -0.02                               | -0.08                                  | 0.28                                 |
// |  P2O3      | 0.34                      | 0.29                                  | 0.28                        | 0.65                                  | 0.38                                | 0.34                                   | 0.44                                 |

const mare_basalt = {
  SiO2: 40.58,
  TiO2: 12.83,
  Al2O3: 10.91,
  FeO: 13.18,
  MnO: 0.19,
  MgO: 6.7,
  CaO: 10.64,
  K2O: -0.11,
  P2O3: 0.34,
} as const;

const vesicular_basalt = {
  SiO2: 36.89,
  TiO2: 2.44,
  Al2O3: 9.6,
  FeO: 14.52,
  MnO: 0.24,
  MgO: 5.3,
  CaO: 8.22,
  K2O: -0.13,
  P2O3: 0.29,
} as const;

const olivine_basalt_1 = {
  SiO2: 41.62,
  TiO2: 2.44,
  Al2O3: 9.52,
  FeO: 18.12,
  MnO: 0.27,
  MgO: 11.1,
  CaO: 8.12,
  K2O: -0.12,
  P2O3: 0.28,
} as const;

const feldspathic_basalt = {
  SiO2: 46.72,
  TiO2: 1.1,
  Al2O3: 19.01,
  FeO: 7.21,
  MnO: 0.14,
  MgO: 7.83,
  CaO: 14.22,
  K2O: 0.43,
  P2O3: 0.65,
} as const;

const pigeonite_basalt = {
  SiO2: 46.53,
  TiO2: 3.4,
  Al2O3: 11.68,
  FeO: 16.56,
  MnO: 0.24,
  MgO: 6.98,
  CaO: 11.11,
  K2O: -0.02,
  P2O3: 0.38,
} as const;

const olivine_basalt_2 = {
  SiO2: 42.45,
  TiO2: 1.56,
  Al2O3: 11.44,
  FeO: 17.91,
  MnO: 0.27,
  MgO: 10.45,
  CaO: 9.37,
  K2O: -0.08,
  P2O3: 0.34,
} as const;

const ilmenite_basalt = {
  SiO2: 42.56,
  TiO2: 9.38,
  Al2O3: 12.03,
  FeO: 11.27,
  MnO: 0.17,
  MgO: 9.7,
  CaO: 10.52,
  K2O: 0.28,
  P2O3: 0.44,
} as const;

const rock_2_data = {
  GOUDA: 12.53,
  CHEDDAR: 59.13,
  MOZZARELLA: 28.34,
} as const;

export const spec_data_map = {
  '333030303237424545303439': mare_basalt,
  '333030303332433934413831': vesicular_basalt,
  'id-3': olivine_basalt_1,
  'id-4': feldspathic_basalt,
} as const;

type ValidRockId = keyof typeof spec_data_map;

export function isValidRockId(id: string): id is ValidRockId {
  return Object.keys(spec_data_map).includes(id as ValidRockId);
}
