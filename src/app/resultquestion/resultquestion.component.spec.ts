import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultquestionComponent } from './resultquestion.component';

describe('ResultquestionComponent', () => {
  let component: ResultquestionComponent;
  let fixture: ComponentFixture<ResultquestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultquestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultquestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
