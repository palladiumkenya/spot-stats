/* tslint:disable:semicolon */
import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FacilityEnrolledEvent } from '../events/facility-enrolled.event';
import { AssignMasterFacilityCommand } from '../commands/assign-master-facility.command';
import { ManifestLoggedEvent } from '../events/manifest-logged.event';
import { InitializeSummariesCommand } from '../commands/initialize-summaries-command';

@Injectable()
export class FacilityManifestSaga {
  @Saga()
  facilityEnrolled = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(FacilityEnrolledEvent),
      map(event => new AssignMasterFacilityCommand(event._id)),
    );
  };

  @Saga()
  manifestLogged = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ManifestLoggedEvent),
      map(
        event =>
          new InitializeSummariesCommand(event.facilityId, event.manifestId),
      ),
    );
  };
}
