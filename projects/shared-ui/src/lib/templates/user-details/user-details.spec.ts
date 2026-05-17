import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetails } from './user-details';
import { mayaBrennanUser } from './user-details-types';

describe('UserDetails', () => {
  let component: UserDetails;
  let fixture: ComponentFixture<UserDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetails);
    fixture.componentRef.setInput('user', mayaBrennanUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
