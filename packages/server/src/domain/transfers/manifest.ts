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
  public start?: Date;
  public end?: Date;
  public session?: string;
  public tag?: string;

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
    public firstTimeUpload: boolean,
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

  hasSession(): boolean {
    if (this.session) {
      return true;
    }
    return false;
  }

  endSession(endTime: Date) {
    this.end = endTime;
  }

  createSession(session: string, start: Date, end: Date, tag: string) {
    this.session = session;
    this.start = start;
    this.end = end;
    this.tag = tag;
  }
}
