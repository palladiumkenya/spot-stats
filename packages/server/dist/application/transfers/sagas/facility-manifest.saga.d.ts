import { ICommand } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
export declare class FacilityManifestSaga {
    facilityEnrolled: (events$: Observable<any>) => Observable<ICommand>;
    manifestLogged: (events$: Observable<any>) => Observable<ICommand>;
}
