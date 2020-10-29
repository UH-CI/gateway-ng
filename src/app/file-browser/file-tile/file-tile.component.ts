import { Component, Input, Output, EventEmitter, OnInit, HostListener } from '@angular/core'
import { FileInfo } from '../../apis/ng-tapis-files-client';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { RenameDialogComponent } from '../modals/rename-dialog/rename-dialog.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from  '@angular/forms';

@Component({
  selector: 'app-file-tile',
  templateUrl: './file-tile.component.html',
  styleUrls: ['./file-tile.component.css']
})
export class FileTileComponent implements OnInit {

  @Input() fileElements: FileInfo[]
  @Input() canNavigateUp: number
  @Input() path: string
  @Input() selectedFile: FileInfo[]

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
  @Output() moveTo = new EventEmitter<{ source: FileInfo, dest: FileInfo}>()

  @Output() leftClickFile = new EventEmitter<FileInfo>()
  @Output() shiftClickFile = new EventEmitter<FileInfo>()
  @Output() ctrlClickFile = new EventEmitter<FileInfo>()

  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder,
              private modalService: NgbModal) {
              }


  form: FormGroup;
  error: string;
  breakpoint: number;


  ngOnInit(): void {
    this.form = this.formBuilder.group({
      file: ['']
    });
    this.breakpoint = window.innerWidth/120;
    console.log(this.breakpoint);
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.breakpoint = event.target.innerWidth/120;
  }

  reset(): void {
    this.selectedFile = [{ name: '.'}];
  }

  clickFile(element: FileInfo, event: MouseEvent): void {
    if(event.shiftKey) this.shiftClickFile.emit(element);
    else if (event.ctrlKey) this.ctrlClickFile.emit(element);
    else this.leftClickFile.emit(element);
  }

  openMenu(event: MouseEvent, element: FileInfo, viewChild: MatMenuTrigger) {
    event.preventDefault();
    viewChild.openMenu();
  }

  trim(input: string): string {
    let output = input;
    if(output.length > 14) {
      output = output.substr(0,13) + '...'
    }
    return output
  }
  moveElement(source: FileInfo, destination: FileInfo) {
    this.moveTo.emit({source: source, dest: destination});
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
