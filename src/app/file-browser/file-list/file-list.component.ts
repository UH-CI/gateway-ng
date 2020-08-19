import { Component, Input, Output, EventEmitter, OnInit, } from '@angular/core'
import { FileInfo } from '../../apis/ng-tapis-files-client';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { RenameDialogComponent } from '../modals/rename-dialog/rename-dialog.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from  '@angular/forms';
import {Observable, ReplaySubject} from 'rxjs';
import { MatTableDataSource } from '@angular/material/table'

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {

  @Input() fileElements: FileInfo[];
  @Input() canNavigateUp: number
  @Input() path: string
  @Input() selectedFile: FileInfo[]
  @Input() listing: Observable<any>;


  @Output() folderAdded = new EventEmitter<string>()
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



  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder,
              private modalService: NgbModal) {
              }

  form: FormGroup;
  error: string;
  tableDataSrc: any;
  tableCols: string[] = ['select','name','length','lastModified'];


  ngOnInit(): void {
    this.form = this.formBuilder.group({
      file: ['']
    });
    console.log(this.selectedFile);
    
  }

  debug(): void {
    console.log(this.listing);
  }

  reset(): void {
    this.selectedFile = [{ name: '.'}];
  }

  isSelected(element) {
    let value = false;
    console.log(this.selectedFile);
    if(this.selectedFile !== undefined) {
      value = (this.selectedFile.filter( e => e.name === element.name).length > 0);
    }
    return value;
  }

  checkSelect(checked: boolean, file: FileInfo) {
    if(checked == true) {
      this.selectedFile.push(file);
    } else {
      //this.selectedFile = this.selectedFile.filter( e => e.name !== file.name);
    }
  }


  openMenu(event: MouseEvent, element: FileInfo, viewChild: MatMenuTrigger) {
    event.preventDefault();
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
