import { Docket } from '../src/domain/courts/docket';
import { Extract } from '../src/domain/courts/extract';
import { MasterFacility } from '../src/domain/registries/master-facility';
import * as uuid from 'uuid';
import { Facility } from '../src/domain/transfers/facility';
import { Manifest, Summary } from '../src/domain';
import { Metric } from '../src/domain/metrices/metric';
import { Measure } from '../src/domain/metrices/measure';
import { plainToClass } from 'class-transformer';
import { LogMetricCommand } from '../src/application/metrices/commands/log-metric.command';

export const getTestDockets = (count = 2, dcount = 2) => {
  const data: Docket[] = [];
  for (let i = 0; i < count; i++) {
    const docket = new Docket(`DC${i}`, `Docket-${i}`);
    for (let j = 0; j < dcount; j++) {
      docket.addExtract(new Extract(`Ex${j}`, `Extract-${j}`, false, i));
    }
    data.push(docket);
  }
  return data;
};

export const getTestMasterFacilities = (count = 2) => {
  const data: MasterFacility[] = [];
  for (let i = 0; i < count; i++) {
    data.push(new MasterFacility(uuid.v1(), (i + 1) * 12, `Fname${i}`));
  }
  return data;
};

export const getTestFacilities = (count = 2) => {
  const dockets = getTestDockets();
  const masterFacilities = getTestMasterFacilities();
  const facilities: Facility[] = [];
  const manifests: Manifest[] = [];
  for (let i = 0; i < count; i++) {
    const mfs = getManifests();
    const fac = new Facility(uuid.v1(), (i + 1) * 12, `fname${i}`);
    getManifests().map(m => {
      m.docket = i === 1 ? 'HTS' : 'NDWH';
      m.code = fac.code;
      m.name = fac.name;
      m.facility = fac._id;
      manifests.push(m);
    });
    fac.manifests = manifests
      .filter(x => x.facility === fac._id)
      .map(n => n._id);
    fac.summaries = getSummaries();
    facilities.push(fac);
  }
  return { dockets, masterFacilities, facilities, manifests };
};
export const getManifests = (count = 2) => {
  const data: Manifest[] = [];
  for (let i = 0; i < count; i++) {
    data.push(
      new Manifest(
        uuid.v1(),
        (i + 1) * 45,
        `fac${i}`,
        new Date(),
        new Date(),
        'HTS',
        (i + 1) * 45,
        '',
        i === 1,
      ),
    );
  }
  return data;
};
const getSummaries = () => {
  const data: Summary[] = [];

  data.push(
    new Summary(
      { name: 'HTS' },
      { name: 'HtsClientExtract' },
      100,
      100,
      new Date(),
    ),
  );
  data.push(
    new Summary(
      { name: 'HTS' },
      { name: 'HtsClientTestsExtract' },
      200,
      0,
      new Date(),
    ),
  );
  return data;
};

export const getTestMeasures = (facid, count = 2) => {
  const testMeasures: Measure[] = [];
  for (let i = 0; i < count; i++) {
    testMeasures.push(new Measure(`m${i}`, 'MPI', `m${i}`, `m${i}`));
  }

  const testMetrics: Metric[] = [];
  for (let i = 0; i < count; i++) {
    testMetrics.push(
      new Metric(uuid.v1(), testMeasures[i]._id, facid, `Fname${i}`, uuid.v1()),
    );
  }
  return { testMeasures, testMetrics };
};

export const getTestStatsData = () => {
  const dockets = JSON.parse(
    '[\n' +
      '  {\n' +
      '    "_id": "' +
      uuid.v1() +
      '",\n' +
      '    "name": "NDWH",\n' +
      '    "display": "NDWH",\n' +
      '    "extracts": [\n' +
      '      {\n' +
      '        "_id": "6dc933e0-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "PatientExtract",\n' +
      '        "display": "All Patients",\n' +
      '        "isPatient": true,\n' +
      '        "rank": 1\n' +
      '      },\n' +
      '      {\n' +
      '        "_id": "6dc934e0-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "PatientArtExtract",\n' +
      '        "display": "ART Patients",\n' +
      '        "isPatient": false,\n' +
      '        "rank": 2\n' +
      '      },\n' +
      '      {\n' +
      '        "_id": "6dc935e0-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "PatientBaselineExtract",\n' +
      '        "display": "Patient Baselines",\n' +
      '        "isPatient": false,\n' +
      '        "rank": 3\n' +
      '      },\n' +
      '      {\n' +
      '        "_id": "6dc936e0-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "PatientStatusExtract",\n' +
      '        "display": "Patient Status",\n' +
      '        "isPatient": false,\n' +
      '        "rank": 4\n' +
      '      },\n' +
      '      {\n' +
      '        "_id": "6dc937e0-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "PatientLabExtract",\n' +
      '        "display": "Patient Labs",\n' +
      '        "isPatient": false,\n' +
      '        "rank": 5\n' +
      '      },\n' +
      '      {\n' +
      '        "_id": "6dc938e0-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "PatientPharmacyExtract",\n' +
      '        "display": "Patient Pharmacy",\n' +
      '        "isPatient": false,\n' +
      '        "rank": 6\n' +
      '      },\n' +
      '      {\n' +
      '        "_id": "6dc93746-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "PatientVisitExtract",\n' +
      '        "display": "Patient Visit",\n' +
      '        "isPatient": false,\n' +
      '        "rank": 7\n' +
      '      },\n' +
      '      {\n' +
      '        "_id": "6dc939e0-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "PatientAdverseEventExtract",\n' +
      '        "display": "Patient Adverse Events",\n' +
      '        "isPatient": false,\n' +
      '        "rank": 8\n' +
      '      }\n' +
      '    ]\n' +
      '  },\n' +
      '  {\n' +
      '    "_id": "' +
      uuid.v1() +
      '",\n' +
      '    "name": "HTS",\n' +
      '    "display": "HTS",\n' +
      '    "extracts": [\n' +
      '      {\n' +
      '        "_id": "6dc93890-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "HtsClientExtract",\n' +
      '        "display": "Hts Clients",\n' +
      '        "isPatient": true,\n' +
      '        "rank": 1\n' +
      '      },\n' +
      '      {\n' +
      '        "_id": "6dc939bc-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "HtsClientTestsExtract",\n' +
      '        "display": "Hts Client Tests",\n' +
      '        "isPatient": false,\n' +
      '        "rank": 2\n' +
      '      },\n' +
      '      {\n' +
      '        "_id": "6dc949bc-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "HtsClientLinkageExtract",\n' +
      '        "display": "Hts Client Linkage",\n' +
      '        "isPatient": false,\n' +
      '        "rank": 3\n' +
      '      },\n' +
      '      {\n' +
      '        "_id": "6dc959bc-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "HtsTestKitsExtract",\n' +
      '        "display": "Hts Test Kits",\n' +
      '        "isPatient": false,\n' +
      '        "rank": 4\n' +
      '      },\n' +
      '      {\n' +
      '        "_id": "6dc969bc-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "HtsClientTracingExtract",\n' +
      '        "display": "Hts Client Tracing",\n' +
      '        "isPatient": false,\n' +
      '        "rank": 5\n' +
      '      },\n' +
      '      {\n' +
      '        "_id": "6dc979bc-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "HtsPartnerTracingExtract",\n' +
      '        "display": "Hts Partner Tracing",\n' +
      '        "isPatient": false,\n' +
      '        "rank": 6\n' +
      '      },\n' +
      '      {\n' +
      '        "_id": "6dc989bc-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "HtsPartnerNotificationServicesExtract",\n' +
      '        "display": "Hts Partner Notification Services",\n' +
      '        "isPatient": false,\n' +
      '        "rank": 7\n' +
      '      }\n' +
      '    ]\n' +
      '  }\n' +
      ']',
  );

  const masterfacilities = JSON.parse(
    '[\n' +
      '  {\n' +
      '    "_id": "' +
      uuid.v1() +
      '",\n' +
      '    "code": 12618,\n' +
      '    "name": "Mwala Hospital",\n' +
      '    "county": {\n' +
      '      "_id": "9eb15a92-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '      "code": 16,\n' +
      '      "name": "MACHAKOS"\n' +
      '    },\n' +
      '    "mechanism": {\n' +
      '      "_id": "9eb13e4a-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '      "code": "18504",\n' +
      '      "name": "UMB Timiza",\n' +
      '      "implementationName": "UMB Timiza",\n' +
      '      "agency": "9eb13e4a-bb7b-11e9-9cb5-2a2ae2dbcce4"\n' +
      '    }\n' +
      '  },\n' +
      '  {\n' +
      '    "_id": "' +
      uuid.v1() +
      '",\n' +
      '    "code": 14950,\n' +
      '    "name": "Kitengela Health Centre",\n' +
      '    "county": {\n' +
      '      "_id": "9eb175a4-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '      "code": 34,\n' +
      '      "name": "KAJIADO"\n' +
      '    },\n' +
      '    "mechanism": {\n' +
      '      "_id": "9eb140ca-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '      "code": "13588",\n' +
      '      "name": "Afya Ziwani",\n' +
      '      "implementationName": "Afya Ziwani",\n' +
      '      "agency": "9eb140ca-bb7b-11e9-9cb5-2a2ae2dbcce4"\n' +
      '    }\n' +
      '  }\n' +
      ']\n',
  );

  return { dockets, masterfacilities };
};

export const getTestManifestMessages = () => {
  return JSON.parse(
    '[\n' +
      '  {\n' +
      '    "id": "' +
      uuid.v1() +
      '",\n' +
      '    "facilityCode": 12618,\n' +
      '    "facilityName": "Mwala Hospital",\n' +
      '    "area": "HTS",\n' +
      '    "logDate": "2019-08-01",\n' +
      '    "buildDate": "2019-08-01",\n' +
      '    "patientCount": 40,\n' +
      '    "cargo": "",\n' +
      '    "isCurrent": true\n' +
      '  },\n' +
      '  {\n' +
      '    "id": "' +
      uuid.v1() +
      '",\n' +
      '    "facilityCode": 12618,\n' +
      '    "facilityName": "Mwala Hospital",\n' +
      '    "area": "NDWH",\n' +
      '    "logDate": "2019-08-02",\n' +
      '    "buildDate": "2019-08-02",\n' +
      '    "patientCount": 40,\n' +
      '    "cargo": "",\n' +
      '    "isCurrent": false\n' +
      '  },\n' +
      '  {\n' +
      '    "id": "' +
      uuid.v1() +
      '",\n' +
      '    "facilityCode": 14950,\n' +
      '    "facilityName": "Kitengela Health Centre",\n' +
      '    "area": "NDWH",\n' +
      '    "logDate": "2019-08-02",\n' +
      '    "buildDate": "2019-08-02",\n' +
      '    "patientCount": 50,\n' +
      '    "cargo": "",\n' +
      '    "isCurrent": true\n' +
      '  },\n' +
      '  {\n' +
      '    "id": "' +
      uuid.v1() +
      '",\n' +
      '    "facilityCode": 14950,\n' +
      '    "facilityName": "Kitengela Health Centre",\n' +
      '    "area": "HTS",\n' +
      '    "logDate": "2019-08-01",\n' +
      '    "buildDate": "2019-08-01",\n' +
      '    "patientCount": 50,\n' +
      '    "cargo": "",\n' +
      '    "isCurrent": false\n' +
      '  }\n' +
      ']',
  );
};

export const getTestFacSummaries = () => {
  return JSON.parse(
    '[' +
      '{\n' +
      '  "_id": "' +
      uuid.v1() +
      '",\n' +
      '  "manifests": [\n' +
      '    \n' +
      '  ],\n' +
      '  "code": 12618,\n' +
      '  "name": "Mwala Hospital",\n' +
      '  "summaries": [\n' +
      '    {\n' +
      '      "area": {\n' +
      '        "id": "6dc93278-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "HTS",\n' +
      '        "display": "HTS"\n' +
      '      },\n' +
      '      "extract": {\n' +
      '        "_id": "6dc93890-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "HtsClientExtract",\n' +
      '        "display": "Hts Clients",\n' +
      '        "isPatient": true,\n' +
      '        "rank": 1\n' +
      '      },\n' +
      '      "expected": 40,\n' +
      '      "recieved": 0,\n' +
      '      "updated": "2019-08-27T15:59:52.558",\n' +
      '      "_id": "b4a870e0-c8e3-11e9-a241-7da05111b995"\n' +
      '    },\n' +
      '    {\n' +
      '      "area": {\n' +
      '        "id": "6dc93278-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "HTS",\n' +
      '        "display": "HTS"\n' +
      '      },\n' +
      '      "extract": {\n' +
      '        "_id": "6dc939bc-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "HtsClientTestsExtract",\n' +
      '        "display": "Hts Client Tests",\n' +
      '        "isPatient": false,\n' +
      '        "rank": 2\n' +
      '      },\n' +
      '      "recieved": 0,\n' +
      '      "updated": "2019-08-27T15:59:52.558",\n' +
      '      "_id": "b4a870e1-c8e3-11e9-a241-7da05111b995"\n' +
      '    },\n' +
      '    {\n' +
      '      "area": {\n' +
      '        "id": "6dc93278-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "HTS",\n' +
      '        "display": "HTS"\n' +
      '      },\n' +
      '      "extract": {\n' +
      '        "_id": "6dc949bc-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "HtsClientLinkageExtract",\n' +
      '        "display": "Hts Client Linkage",\n' +
      '        "isPatient": false,\n' +
      '        "rank": 3\n' +
      '      },\n' +
      '      "recieved": 0,\n' +
      '      "updated": "2019-08-27T15:59:52.558",\n' +
      '      "_id": "b4a870e2-c8e3-11e9-a241-7da05111b995"\n' +
      '    },\n' +
      '    {\n' +
      '      "area": {\n' +
      '        "id": "6dc93278-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "HTS",\n' +
      '        "display": "HTS"\n' +
      '      },\n' +
      '      "extract": {\n' +
      '        "_id": "6dc959bc-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "HtsTestKitsExtract",\n' +
      '        "display": "Hts Test Kits",\n' +
      '        "isPatient": false,\n' +
      '        "rank": 4\n' +
      '      },\n' +
      '      "recieved": 0,\n' +
      '      "updated": "2019-08-27T15:59:52.558",\n' +
      '      "_id": "b4a870e3-c8e3-11e9-a241-7da05111b995"\n' +
      '    },\n' +
      '    {\n' +
      '      "area": {\n' +
      '        "id": "6dc93278-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "HTS",\n' +
      '        "display": "HTS"\n' +
      '      },\n' +
      '      "extract": {\n' +
      '        "_id": "6dc969bc-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "HtsClientTracingExtract",\n' +
      '        "display": "Hts Client Tracing",\n' +
      '        "isPatient": false,\n' +
      '        "rank": 5\n' +
      '      },\n' +
      '      "recieved": 0,\n' +
      '      "updated": "2019-08-27T15:59:52.558",\n' +
      '      "_id": "b4a870e4-c8e3-11e9-a241-7da05111b995"\n' +
      '    },\n' +
      '    {\n' +
      '      "area": {\n' +
      '        "id": "6dc93278-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "HTS",\n' +
      '        "display": "HTS"\n' +
      '      },\n' +
      '      "extract": {\n' +
      '        "_id": "6dc979bc-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "HtsPartnerTracingExtract",\n' +
      '        "display": "Hts Partner Tracing",\n' +
      '        "isPatient": false,\n' +
      '        "rank": 6\n' +
      '      },\n' +
      '      "recieved": 0,\n' +
      '      "updated": "2019-08-27T15:59:52.558",\n' +
      '      "_id": "b4a870e5-c8e3-11e9-a241-7da05111b995"\n' +
      '    },\n' +
      '    {\n' +
      '      "area": {\n' +
      '        "id": "6dc93278-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "HTS",\n' +
      '        "display": "HTS"\n' +
      '      },\n' +
      '      "extract": {\n' +
      '        "_id": "6dc989bc-bf1e-11e9-9cb5-2a2ae2dbcce4",\n' +
      '        "name": "HtsPartnerNotificationServicesExtract",\n' +
      '        "display": "Hts Partner Notification Services",\n' +
      '        "isPatient": false,\n' +
      '        "rank": 7\n' +
      '      },\n' +
      '      "recieved": 0,\n' +
      '      "updated": "2019-08-27T15:59:52.558",\n' +
      '      "_id": "b4a870e6-c8e3-11e9-a241-7da05111b995"\n' +
      '    }\n' +
      '  ],\n' +
      '  "masterFacility": {\n' +
      '    "_id": "9eb13e4a-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "code": 12618,\n' +
      '    "name": "Mwala Hospital",\n' +
      '    "county": {\n' +
      '      "_id": "9eb15a92-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '      "code": 16,\n' +
      '      "name": "MACHAKOS"\n' +
      '    },\n' +
      '    "mechanism": {\n' +
      '      "_id": "9eb13e4a-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '      "code": "18504",\n' +
      '      "name": "UMB Timiza",\n' +
      '      "implementationName": "UMB Timiza",\n' +
      '      "agency": "9eb13e4a-bb7b-11e9-9cb5-2a2ae2dbcce4"\n' +
      '    },\n' +
      '    "__v": 0\n' +
      '  },\n' +
      '  "__v": 0\n' +
      '}]',
  );
};

export const getTestStatsMessage = () => {
  return JSON.parse(
    '[{\n' +
      '          "facilityCode" : 12618,\n' +
      '          "area" : {\n' +
      '              "name" : "HTS"},\n' +
      '          "stats" : [\n' +
      '            { "name": "HtsClientExtract", "recieved": 25 },\n' +
      '            { "name": "HtsClientTestsExtract", "recieved": 57 },\n' +
      '            { "name": "HtsClientLinkageExtract", "recieved": 25 },\n' +
      '            { "name": "HtsTestKitsExtract", "recieved": 124 },\n' +
      '            { "name": "HtsClientTracingExtract", "recieved": 13 },\n' +
      '            { "name": "HtsPartnerTracingExtract", "recieved": 1 },\n' +
      '            { "name": "HtsPartnerNotificationServicesExtract", "recieved": 89 }\n' +
      '          ],\n' +
      '          "updated": "2019-08-01"\n' +
      '      },\n' +
      '      {\n' +
      '          "facilityCode" : 14950,\n' +
      '          "area" : {\n' +
      '              "name" : "HTS"},\n' +
      '          "stats" : [\n' +
      '            { "name": "HtsClientExtract", "recieved": 253 },\n' +
      '            { "name": "HtsClientTestsExtract", "recieved": 517 },\n' +
      '            { "name": "HtsClientLinkageExtract", "recieved": 225 },\n' +
      '            { "name": "HtsTestKitsExtract", "recieved": 1324 },\n' +
      '            { "name": "HtsClientTracingExtract", "recieved": 413 },\n' +
      '            { "name": "HtsPartnerTracingExtract", "recieved": 14 },\n' +
      '            { "name": "HtsPartnerNotificationServicesExtract", "recieved": 289 }\n' +
      '          ],\n' +
      '          "updated": "2019-08-01"\n' +
      '      }\n' +
      '      ]',
  );
};

export const getTestMetrices = () => {
  const cmds = JSON.parse(
    '[{\n' +
      '  "id": "ABBDDCC6-0219-4DE7-8A64-AB4100796454",\n' +
      '  "facilityCode": 10001,\n' +
      '  "facilityName": "Demo Fac 01",\n' +
      '  "cargo": {\n' +
      '    "EmrName": "Demo EMR",\n' +
      '    "EmrVersion": "v1.0.0.0",\n' +
      '    "LastLoginDate": "1983-07-04T00:00:00",\n' +
      '    "LastMOH731RunDate": "1983-07-04T00:00:00",\n' +
      '    "DateExtracted": "2019-12-13T16:12:21.159234",\n' +
      '    "Id": "ff22cd7c-083e-4d6d-b800-ab2200d9a053"\n' +
      '  },\n' +
      '  "cargoType": 1,\n' +
      '  "facilityManifestId": "595BDE32-534A-4D0A-B7B9-1611E02F027F"\n' +
      '},{\n' +
      '  "id": "3636D8AA-7E63-4283-99F9-AB4100796454",\n' +
      '  "facilityCode": 10001,\n' +
      '  "facilityName": "Demo Fac 01",\n' +
      '  "cargo": {\n' +
      '    "Version": "2.3.9",\n' +
      '    "Name": "MasterPatientIndex",\n' +
      '    "LogDate": "2019-12-13T12:04:07.536592",\n' +
      '    "Status": 0,\n' +
      '    "Display": "Master Patient Index",\n' +
      '    "Action": "Loaded",\n' +
      '    "Rank": 5,\n' +
      '    "Id": "b9ae5ec8-bc7f-411e-9ab0-ab22009572d5"\n' +
      '  },\n' +
      '  "cargoType": 2,\n' +
      '  "facilityManifestId": "595BDE32-534A-4D0A-B7B9-1611E02F027F"\n' +
      '}]',
  );
  return cmds;
};

export const getMeasures = () => {
  const measures = JSON.parse(
    '[\n' +
      '  {\n' +
      '    "_id": "7eb13e4a-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "name": "EmrName",\n' +
      '    "area": "App",\n' +
      '    "display": "Emr Name",\n' +
      '    "description": "Emr Name"\n' +
      '  },\n' +
      '  {\n' +
      '    "_id": "7eb14e4a-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "name": "EmrVersion",\n' +
      '    "area": "App",\n' +
      '    "display": "Emr Version",\n' +
      '    "description": "Emr Version"\n' +
      '  },\n' +
      '  {\n' +
      '    "_id": "7eb15e4a-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "name": "LastLoginDate",\n' +
      '    "area": "App",\n' +
      '    "display": "Last Login Date",\n' +
      '    "description": "Last Login Date"\n' +
      '  },\n' +
      '  {\n' +
      '    "_id": "7eb16e4a-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "name": "LastMOH731RunDate",\n' +
      '    "area": "App",\n' +
      '    "display": "Last MOH 731 Run Date",\n' +
      '    "description": "Last MOH731 Run Date"\n' +
      '  },\n' +
      '  {\n' +
      '    "_id": "7eb17e4a-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "name": "DwapiVersion",\n' +
      '    "area": "MasterPatientIndex",\n' +
      '    "display": "Dwapi Version",\n' +
      '    "description": "Dwapi Version"\n' +
      '  },\n' +
      '  {\n' +
      '    "_id": "7eb18e4a-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "name": "ExtractLoaded",\n' +
      '    "area": "MasterPatientIndex",\n' +
      '    "display": "Extract Loaded",\n' +
      '    "description": "Extract Loaded"\n' +
      '  },\n' +
      '  {\n' +
      '    "_id": "7eb19e4a-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "name": "ExtractSent",\n' +
      '    "area": "MasterPatientIndex",\n' +
      '    "display": "Extract Sent",\n' +
      '    "description": "Extract Sent"\n' +
      '  },\n' +
      '\n' +
      '  {\n' +
      '    "_id": "7eb20e4a-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "name": "DwapiVersion",\n' +
      '    "area": "HivTestingService",\n' +
      '    "display": "Dwapi Version",\n' +
      '    "description": "Dwapi Version"\n' +
      '  },\n' +
      '  {\n' +
      '    "_id": "7eb21e4a-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "name": "ExtractLoaded",\n' +
      '    "area": "HivTestingService",\n' +
      '    "display": "Extract Loaded",\n' +
      '    "description": "Extract Loaded"\n' +
      '  },\n' +
      '  {\n' +
      '    "_id": "7eb22e4a-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "name": "ExtractSent",\n' +
      '    "area": "HivTestingService",\n' +
      '    "display": "Extract Sent",\n' +
      '    "description": "Extract Sent"\n' +
      '  },\n' +
      '\n' +
      '  {\n' +
      '    "_id": "7eb23e4a-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "name": "DwapiVersion",\n' +
      '    "area": "CareTreatment",\n' +
      '    "display": "Dwapi Version",\n' +
      '    "description": "Dwapi Version"\n' +
      '  },\n' +
      '  {\n' +
      '    "_id": "7eb24e4a-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "name": "ExtractLoaded",\n' +
      '    "area": "CareTreatment",\n' +
      '    "display": "Extract Loaded",\n' +
      '    "description": "Extract Loaded"\n' +
      '  },\n' +
      '  {\n' +
      '    "_id": "7eb25e4a-bb7b-11e9-9cb5-2a2ae2dbcce4",\n' +
      '    "name": "ExtractSent",\n' +
      '    "area": "CareTreatment",\n' +
      '    "display": "Extract Sent",\n' +
      '    "description": "Extract Sent"\n' +
      '  }\n' +
      ']\n',
  );
  return { measures };
};
