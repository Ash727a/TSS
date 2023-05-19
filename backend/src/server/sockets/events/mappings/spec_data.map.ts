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

export const default_rock = {
  name: 'default_rock',
  data: {
    SiO2: 0,
    TiO2: 0,
    Al2O3: 0,
    FeO: 0,
    MnO: 0,
    MgO: 0,
    CaO: 0,
    K2O: 0,
    P2O3: 0,
  } as XRFData,
} as const;

const mare_basalt = {
  name: 'mare_basalt',
  data: {
    SiO2: 40.58,
    TiO2: 12.83,
    Al2O3: 10.91,
    FeO: 13.18,
    MnO: 0.19,
    MgO: 6.7,
    CaO: 10.64,
    K2O: -0.11,
    P2O3: 0.34,
  } as XRFData,
} as const;

const vesicular_basalt = {
  name: 'vesicular_basalt',
  data: {
    SiO2: 36.89,
    TiO2: 2.44,
    Al2O3: 9.6,
    FeO: 14.52,
    MnO: 0.24,
    MgO: 5.3,
    CaO: 8.22,
    K2O: -0.13,
    P2O3: 0.29,
  } as XRFData,
} as const;

const olivine_basalt_1 = {
  name: 'olivine_basalt_1',
  data: {
    SiO2: 41.62,
    TiO2: 2.44,
    Al2O3: 9.52,
    FeO: 18.12,
    MnO: 0.27,
    MgO: 11.1,
    CaO: 8.12,
    K2O: -0.12,
    P2O3: 0.28,
  } as XRFData,
} as const;

const feldspathic_basalt = {
  name: 'feldspathic_basalt',
  data: {
    SiO2: 46.72,
    TiO2: 1.1,
    Al2O3: 19.01,
    FeO: 7.21,
    MnO: 0.14,
    MgO: 7.83,
    CaO: 14.22,
    K2O: 0.43,
    P2O3: 0.65,
  } as XRFData,
} as const;

const pigeonite_basalt = {
  name: 'pigeonite_basalt',
  data: {
    SiO2: 46.53,
    TiO2: 3.4,
    Al2O3: 11.68,
    FeO: 16.56,
    MnO: 0.24,
    MgO: 6.98,
    CaO: 11.11,
    K2O: -0.02,
    P2O3: 0.38,
  } as XRFData,
} as const;

const olivine_basalt_2 = {
  name: 'default_rock',
  data: {
    SiO2: 42.45,
    TiO2: 1.56,
    Al2O3: 11.44,
    FeO: 17.91,
    MnO: 0.27,
    MgO: 10.45,
    CaO: 9.37,
    K2O: -0.08,
    P2O3: 0.34,
  } as XRFData,
} as const;

const ilmenite_basalt = {
  name: 'ilmenite_basalt',
  data: {
    SiO2: 42.56,
    TiO2: 9.38,
    Al2O3: 12.03,
    FeO: 11.27,
    MnO: 0.17,
    MgO: 9.7,
    CaO: 10.52,
    K2O: 0.28,
    P2O3: 0.44,
  } as XRFData,
} as const;

interface XRFData {
  SiO2: number;
  TiO2: number;
  Al2O3: number;
  FeO: number;
  MnO: number;
  MgO: number;
  CaO: number;
  K2O: number;
  P2O3: number;
}

const cheese = {
  GOUDA: 12.53,
  CHEDDAR: 59.13,
  MOZZARELLA: 28.34,
} as const;

export const spec_data_map = {
  '333030303237424545303439': mare_basalt,
  '333030303332433934413831': vesicular_basalt,
  '333030303335303644444445': olivine_basalt_1,
  '333030303241424236344335': feldspathic_basalt,
  '333030303241353233353744': pigeonite_basalt,
  '333030303238373435463333': olivine_basalt_2,
  '333030303239353835383139': ilmenite_basalt,
} as const;

type ValidRockId = keyof typeof spec_data_map;

export function isValidRockId(id: string): id is ValidRockId {
  return Object.keys(spec_data_map).includes(id as ValidRockId);
}
