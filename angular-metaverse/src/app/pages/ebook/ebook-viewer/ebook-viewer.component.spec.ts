import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbookViewerComponent } from './ebook-viewer.component';

describe('EbookViewerComponent', () => {
  let component: EbookViewerComponent;
  let fixture: ComponentFixture<EbookViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EbookViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbookViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
