import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollChartComponent } from './poll-chart.component';

describe('PollChartComponent', () => {
  let component: PollChartComponent;
  let fixture: ComponentFixture<PollChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
