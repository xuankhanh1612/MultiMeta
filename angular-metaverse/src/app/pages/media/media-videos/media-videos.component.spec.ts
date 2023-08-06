import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaVideosComponent } from './media-videos.component';

describe('MediaVideosComponent', () => {
  let component: MediaVideosComponent;
  let fixture: ComponentFixture<MediaVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaVideosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
