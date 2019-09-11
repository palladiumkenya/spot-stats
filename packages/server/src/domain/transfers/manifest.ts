import * as uuid from 'uuid';
import { AggregateRoot } from '@nestjs/cqrs';
import { Facility } from './facility';
import { FacilityUpdatedEvent } from '../../application/transfers/events/facility-updated.event';
import { ManifestLoggedEvent } from '../../application/transfers/events/manifest-logged.event';

export class Manifest extends AggregateRoot {
  public _id: string;
  public facility: any;
  public facilityInfo: any;
  public recievedCount: number;
  public recievedDate: Date;

  constructor(
    public mId: string,
    public code: number,
    public name: string,
    public logDate: Date,
    public buildDate: Date,
    public docket: string,
    public patientCount: number,
    public cargo: any,
    public isCurrent: boolean,
  ) {
    super();
    this._id = uuid.v1();
  }

  assignFacility(facility: Facility) {
    const fac = facility;
    this.facility = fac._id;
    this.facilityInfo = { ...fac };
    this.facilityInfo.manifests = [];
  }
}
