import { Component, Input, Output, EventEmitter, OnInit, ViewChild, AfterViewInit, DoCheck } from '@angular/core'
import { FileInfo } from '../../apis/ng-tapis-files-client';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { RenameDialogComponent } from '../modals/rename-dialog/rename-dialog.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from  '@angular/forms';
import {Observable, ReplaySubject} from 'rxjs';
import { MatTableDataSource } from '@angular/material/table'
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {

  @Input() fileElements: FileInfo[];
  @Input() canNavigateUp: number
  @Input() path: string


  @Output() folderAdded = new EventEmitter<string>()
  @Output() select = new EventEmitter<FileInfo>()
  @Output() viewChanged = new EventEmitter<string>()
  @Output() elementRemoved = new EventEmitter<FileInfo>()
  @Output() elementRenamed = new EventEmitter< { 
    file: FileInfo
    name: string
  }>()
  @Output() elementMoved = new EventEmitter<{
    element: FileInfo
    moveTo: FileInfo
  }>()
  @Output() navigatedDown = new EventEmitter<FileInfo>()
  @Output() fileDownload = new EventEmitter<FileInfo>()
  @Output() fileUpload = new EventEmitter<any>()
  @Output() navigatedUp = new EventEmitter()

  @ViewChild(MatSort) sort: MatSort;


  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder,
              private modalService: NgbModal) {
              }

  form: FormGroup;
  error: string;
  tableCols: string[] = ['select','name','length','lastModified'];
  dataSource: any;
  contextMenuPosition = { x: '0px', y: '0px' };
  
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      file: ['']
    });
    this.dataSource = new MatTableDataSource(this.fileElements);
  }
  ngDoCheck(): void {

    this.dataSource.sort = this.sort;
  }


  checkSelect(checked: boolean, file: FileInfo) {
    if(checked != file.selected) this.select.emit(file);
  }


  openMenu(event: MouseEvent, element: FileInfo, viewChild: MatMenuTrigger) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    viewChild.menuData = { 'element': element };
    viewChild.menu.focusFirstItem('mouse');
    viewChild.openMenu();
  }

  moveElement(source: FileInfo, destination: FileInfo) {

  }

  download(element: FileInfo) {
    this.fileDownload.emit(element);
  }

  navigate(element: FileInfo) {
      this.navigatedDown.emit(element);
  }

  navigateUp() {
    this.navigatedUp.emit();
  }

  viewSelect(view: string) {
    this.viewChanged.emit(view);
  }

  deleteElement(element: FileInfo) {
    this.elementRemoved.emit(element);
  }

  openRenameDialog(element: FileInfo) {
    let dialogRef = this.dialog.open(RenameDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.elementRenamed.emit({file: element, name: res});
      }
    });
  }
}
