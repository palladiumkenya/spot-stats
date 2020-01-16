export class GetStatsPagedQuery {
  filter?: any;
  sort?: any;
  constructor(public size: number, public page: number) {}
}
