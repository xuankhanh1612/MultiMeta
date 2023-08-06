import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayGuestComponent } from './play-guest.component';

describe('PlayGuestComponent', () => {
  let component: PlayGuestComponent;
  let fixture: ComponentFixture<PlayGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayGuestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
