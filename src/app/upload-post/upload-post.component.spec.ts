import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPostComponent } from './upload-post.component';

describe('UploadPostComponent', () => {
  let component: UploadPostComponent;
  let fixture: ComponentFixture<UploadPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
