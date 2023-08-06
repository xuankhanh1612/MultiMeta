import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayMetaComponent } from './play-meta.component';

describe('PlayMetaComponent', () => {
  let component: PlayMetaComponent;
  let fixture: ComponentFixture<PlayMetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayMetaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayMetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
