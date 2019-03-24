import { PicksDashboardModule } from './picks-dashboard.module';

describe('PicksDashboardModule', () => {
  let picksDashboardModule: PicksDashboardModule;

  beforeEach(() => {
    picksDashboardModule = new PicksDashboardModule();
  });

  it('should create an instance', () => {
    expect(picksDashboardModule).toBeTruthy();
  });
});
