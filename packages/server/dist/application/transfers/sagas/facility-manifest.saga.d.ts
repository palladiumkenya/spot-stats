import { ICommand } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
export declare class FacilityManifestSaga {
    manifestLogged: (events$: Observable<any>) => Observable<ICommand>;
}
