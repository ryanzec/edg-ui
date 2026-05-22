import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewOptions } from './view-options';

describe('ViewOptions', () => {
  let component: ViewOptions;
  let fixture: ComponentFixture<ViewOptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOptions],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewOptions);
    fixture.componentRef.setInput('fields', []);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
