import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuredTextComponent } from './secured-text.component';

describe('SecuredTextComponent', () => {
  let component: SecuredTextComponent;
  let fixture: ComponentFixture<SecuredTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecuredTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecuredTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
