import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaAudioDetailComponent } from './media-audio-detail.component';

describe('MediaAudioDetailComponent', () => {
  let component: MediaAudioDetailComponent;
  let fixture: ComponentFixture<MediaAudioDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaAudioDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaAudioDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
