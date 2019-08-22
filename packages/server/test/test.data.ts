import { Agency, Facility, Mechanism } from '../src/domain/practices';
import { County } from '../src/domain/locations';

export const getTestCounties = (count = 2) => {
  const data: County[] = [];
  for (let i = 0; i < count; i++) {
    data.push(new County(i, `county${i}`));
  }
  return data;
};

export const getTestAgencies = (count = 2) => {
  const data: Agency[] = [];
  for (let i = 0; i < count; i++) {
    data.push(new Agency(`agency${i}`, `agency ${i}`));
  }
  return data;
};

export const getTestFacilities = (count = 2) => {
  const data: Facility[] = [];
  for (let i = 0; i < count; i++) {
    data.push(new Facility(i * 100, `fac${i}`));
  }
  return data;
};

export const getTestMechanisms = (count = 2) => {
  const data: Mechanism[] = [];
  for (let i = 0; i < count; i++) {
    data.push(new Mechanism(`code${i}`, `name${i}`, `imp-name${i}`));
  }
  return data;
};

export const getTestAgencyWithMechanisms = (acount = 1, count = 2) => {
  const agencies: Agency[] = getTestAgencies(acount);

  agencies.forEach(a => {
    const data: Mechanism[] = [];
    for (let i = 0; i < count; i++) {
      data.push(new Mechanism(`mc-code${i}`, `mc-name${i}`, `mc-imp-name${i}`));
    }
    data.forEach(m => a.addMechanism(m));
  });

  return agencies;
};

export const getTestMechanismWithFacilites = (mcount = 1, count = 2) => {
  const agency: Agency = getTestAgencyWithMechanisms(1, 1)[0];
  const mechanisms: Mechanism[] = agency.mechanisms;

  mechanisms.forEach(a => {
    const data: Facility[] = [];
    for (let i = 0; i < count; i++) {
      data.push(new Facility(i * 47, `fac-name${i}`));
    }
    data.forEach(f => a.addFacility(f));
  });

  return mechanisms;
};

export const getTestPracticesCompleteData = () => {
  const counties: County[] = JSON.parse(
    '[\n' +
      '  {\n' +
      '    "_id": "9eb15a92-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "code": 16,\n' +
      '    "name": "MACHAKOS"\n' +
      '  },{\n' +
      '    "_id": "9eb175a4-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "code": 34,\n' +
      '    "name": "KAJIADO"\n' +
      '  }\n' +
      ']',
  );
  const agencies: Agency[] = JSON.parse(
    '[\n' +
      '  {\n' +
      '    "_id": "9eb13e4a-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "name": "CDC",\n' +
      '    "display": "CDC",\n' +
      '    "mechanisms": ["9eb13e4a-bb7b-11e9-9cb5-2a2ae2dbcce4"]\n' +
      '  },\n' +
      '  {\n' +
      '    "_id": "9eb140ca-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "name": "USAID",\n' +
      '    "display": "USAID",\n' +
      '    "mechanisms": ["9eb140ca-bb7b-11e9-9cb5-2a2ae2dbcce4"]\n' +
      '  }\n' +
      ']',
  );

  const mechanisms: Mechanism[] = JSON.parse(
    '[' +
      '{\n' +
      '    "_id": "9eb13e4a-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "code": "18504",\n' +
      '    "name": "UMB Timiza",\n' +
      '    "implementationName": "UMB Timiza",\n' +
      '    "agency": "9eb13e4a-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "facilities": ["9eb13e4a-bb7b-11e9-9cb5-2a2ae2dbcce4"]\n' +
      '  },\n' +
      '  {\n' +
      '    "_id": "9eb140ca-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "code": "13588",\n' +
      '    "name": "Afya Ziwani",\n' +
      '    "implementationName": "Afya Ziwani",\n' +
      '    "agency": "9eb140ca-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "facilities": ["9eb140ca-bb7b-11e9-9cb5-2a2ae2dbcce4"]\n' +
      '  }' +
      ']',
  );

  const facilities: Facility[] = JSON.parse(
    '[\n' +
      '  {\n' +
      '    "_id": "9eb13e4a-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "code": 12618,\n' +
      '    "name": "Mwala Hospital",\n' +
      '    "county": "9eb15a92-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "mechanism": "9eb13e4a-bb7b-11e9-9cb5-2a2ae2dbcce4"\n' +
      '  },\n' +
      '  {\n' +
      '    "_id": "9eb140ca-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "code": 14950,\n' +
      '    "name": "Kitengela Health Centre",\n' +
      '    "county": "9eb175a4-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "mechanism": "9eb140ca-bb7b-11e9-9cb5-2a2ae2dbcce4"\n' +
      '  }\n' +
      ']\n',
  );

  return { counties, agencies, mechanisms, facilities };
};
