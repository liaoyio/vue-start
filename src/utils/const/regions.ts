const regionsMap = {
  'us-east-2': {
    name: 'US East (Ohio)',
    code: 'us-east-2',
    city: 'Ohio',
  },
  'us-east-1': {
    name: 'US East (N. Virginia)',
    code: 'us-east-1',
    city: 'N. Virginia',
  },

  'us-west-1': {
    name: 'US West (N. California)',
    code: 'us-west-1',
    city: 'N. California',
  },

  'us-west-2': {
    name: 'US West (Oregon)',
    code: 'us-west-2',
    city: 'Oregon',
  },
  'af-south-1': {
    name: 'Africa (Cape Town)',
    code: 'af-south-1',
    city: 'Cape Town',
  },
  'ap-east-1': {
    name: 'Asia Pacific (Hong Kong)',
    code: 'ap-east-1',
    city: 'Hong Kong',
  },
  'ap-south-1': {
    name: 'Asia Pacific(Mumbai)',
    code: 'ap-south-1',
    city: 'Mumbai',
  },
  'ap-south-2': {
    name: 'Asia Pacific(Hyderabad)',
    code: 'ap-south-2',
    city: 'Hyderabad',
  },
  'ap-southeast-3': {
    name: ' Asia Pacific(Jakarta)',
    code: 'ap-southeast-3',
    city: 'Jakarta',
  },
  'ap-southeast-4': {
    name: 'Asia Pacific(Melbourne)',
    code: 'ap-southeast-4',
    city: 'Melbourne',
  },
  'ap-northeast-3': {
    name: 'Asia Pacific(Osaka)',
    code: 'ap-northeast-3',
    city: 'Osaka',
  },
  'ap-northeast-2': {
    name: 'Asia Pacific(Seoul)',
    code: 'ap-northeast-2',
    city: 'Seoul',
  },
  'ap-southeast-1': {
    name: 'Asia Pacific(Singapore)',
    code: 'ap-southeast-1',
    city: 'Singapore',
  },
  'ap-southeast-2': {
    name: 'Asia Pacific(Sydney)',
    code: 'ap-southeast-2',
    city: 'Sydney',
  },
  'ap-northeast-1': {
    name: 'Asia Pacific(Tokyo)',
    code: 'ap-northeast-1',
    city: 'Tokyo',
  },
  'ca-central-1': {
    name: 'Canada(Central)',
    code: 'ca-central-1',
    city: 'Central',
  },
  'eu-central-1': {
    name: 'Europe(Frankfurt)',
    code: 'eu-central-1',
    city: 'Frankfurt',
  },
  'eu-west-1': {
    name: 'Europe(Ireland)',
    code: 'eu-west-1',
    city: 'Ireland',
  },
  'eu-west-2': {
    name: 'Europe(London)',
    code: 'eu-west-2',
    city: 'London',
  },
  'eu-south-1': {
    name: 'Europe(Milan)',
    code: 'eu-south-1',
    city: 'Milan',
  },
  'eu-west-3': {
    name: 'Europe(Paris)',
    code: 'eu-west-3',
    city: 'Paris',
  },
  'eu-south-2': {
    name: 'Europe(Spain)',
    code: 'eu-south-2',
    city: 'Spain',
  },
  'eu-north-1': {
    name: 'Europe(Stockholm)',
    code: 'eu-north-1',
    city: 'Stockholm',
  },
  'eu-central-2': {
    name: 'Europe(Zurich)',
    code: 'eu-central-2',
    city: 'Zurich',
  },
  'il-central-1': {
    name: 'Israel(Tel Aviv)',
    code: 'me-south-1',
    city: 'Tel Aviv',
  },
  'me-south-1': {
    name: 'Middle East(Bahrain)',
    code: 'me-south-1',
    city: 'Bahrain',
  },
  'me-central-1': {
    name: 'Middle East(UAE)',
    code: 'me-central-1',
    city: 'UAE',
  },
  'sa-east-1': {
    name: 'South America(São Paulo)',
    code: 'sa-east-1',
    city: 'Sao Paulo',
  },
  'cn-beijing': {
    name: 'China (Beijing)',
    code: 'cn-beijing',
    city: 'Beijing',
  },
  'cn-hangzhou': {
    name: 'China (Hangzhou)',
    code: 'cn-hangzhou',
    city: 'Hangzhou',
  },
  'cn-shanghai': {
    name: 'China (Shanghai)',
    code: 'cn-shanghai',
    city: 'Shanghai',
  },
  'cn-shenzhen': {
    name: 'China (Shenzhen)',
    code: 'cn-shenzhen',
    city: 'Shenzhen',
  },
  'cn-guangzhou': {
    name: 'China(Guangzhou)',
    code: 'cn-guangzhou',
    city: 'Guangzhou',
  },
  'cn-chengdu': {
    name: 'China(Chengdu)',
    code: 'cn-chengdu',
    city: 'Chengdu',
  },
  'cn-hongkong': {
    name: 'China(Hong Kong)',
    code: 'cn-hongkong',
    city: 'Hong Kong',
  },
}

export function uiRegion(params: string) {
  for (const [key, value] of Object.entries(regionsMap)) {
    if (params.includes(key)) return { ...value, dev_code: params }
  }
}
export function formatRegion(params: string) {
  for (const [key, value] of Object.entries(regionsMap)) {
    if (params.includes(key))
      return {
        label: `${value.city} (${params})`,
        value: params,
      }
  }
}
