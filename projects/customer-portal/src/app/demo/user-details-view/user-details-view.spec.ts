import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, it, expect } from 'vitest';

import { UserDetailsView } from './user-details-view';

describe('UserDetailsView', () => {
  let component: UserDetailsView;
  let fixture: ComponentFixture<UserDetailsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetailsView],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
