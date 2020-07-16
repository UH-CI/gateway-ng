import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileListingRowComponent } from './file-listing-row.component';

describe('FileListingRowComponent', () => {
  let component: FileListingRowComponent;
  let fixture: ComponentFixture<FileListingRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileListingRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileListingRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
