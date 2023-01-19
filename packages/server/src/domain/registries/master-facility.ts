import { AggregateRoot } from '@nestjs/cqrs';
import * as uuid from 'uuid';
import { MasterFacilitySyncedEvent } from '../../application/registries/events/master-facility-synced.event';

export class MasterFacility extends AggregateRoot {
  constructor(
    public _id: string,
    public code: number,
    public name: string,
    public county?: any,
    public mechanism?: any,
    public subcounty?: any,
  ) {
    super();
  }

  changeDetails(code: number, name: any, county?: any, mechanism?: any) {
    this.code = code;
    this.name = name;
    this.county = county;
    this.mechanism = mechanism;
  }

  changeFacDetails(fac: any) {
    this.code = fac.code;
    this.name = fac.name;
    this.county = fac.county;
    this.mechanism = fac.mechanism;
  }

  changeMechanism(mechanism: any) {
    this.mechanism = mechanism;
  }

  syncFacility() {
    this.apply(new MasterFacilitySyncedEvent(this));
  }
}
