import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core'
import { FileInfo } from '../apis/ng-tapis-files-client';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatSpinner } from '@angular/material/progress-spinner';

import {FileOperationsService, ContentService, UploadResponse } from '../apis/ng-tapis-files-client';
import {SystemsService, TSystem} from '../apis/ng-tapis-systems-client';
import {Observable, ReplaySubject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from  '@angular/forms';
import { NewFolderDialogComponent } from './modals/new-folder-dialog/new-folder-dialog.component';
import { RenameDialogComponent } from './modals/rename-dialog/rename-dialog.component';
import { FileUploadDialogComponent } from './modals/file-upload-dialog/file-upload-dialog.component';
import { FileTileComponent } from './file-tile/file-tile.component';
import { FileMoveComponent } from './file-move/file-move.component';
import { MoveDialogComponent } from './modals/move-dialog/move-dialog.component';
import { TestDialogComponent } from './modals/test-dialog/test-dialog.component';

@Component({
  selector: 'app-file-browser',
  templateUrl: './file-browser.component.html',
  styleUrls: ['./file-browser.component.css']
})
export class FileBrowserComponent implements OnInit {

  @Input() view: string;

  @Output() dialogClosed = new EventEmitter<FileInfo>()

  constructor(private fileOpsService: FileOperationsService,
              private systemsService: SystemsService,
              private contentService: ContentService,
              public dialog2: MatDialog
              ) { }

  private listing: ReplaySubject<Array<FileInfo>> = new ReplaySubject<Array<FileInfo>>(1);
  public readonly listing$: Observable<Array<FileInfo>> = this.listing.asObservable();
  private activeSystemSubject: ReplaySubject<TSystem> = new ReplaySubject<TSystem>(1);
  public readonly activeSystem$: Observable<TSystem> = this.activeSystemSubject.asObservable();
  public activeSystem: TSystem;
  private systemsListing: ReplaySubject<Array<TSystem>> = new ReplaySubject<Array<TSystem>>(1);
  public readonly systemsListing$: Observable<Array<TSystem>> = this.systemsListing.asObservable();
  error: string;
  uploadResponse: UploadResponse;
  public activeFiles: FileInfo[];
  
  currentPath: string;
  canNavigateUp: number;
  numSelected: number;
  state: string;


  ngOnInit(): void {
    this.state = 'loading';
    this.systemsService.getSystems()
      .subscribe( 
        (resp) => {
          const systems = resp.result.filter( (s) => !s.available);
          this.systemsListing.next(systems);
          this.activeSystemSubject.next(systems[0]);
        }, (err) => this.error = err
      );

    this.activeSystem$.subscribe( 
      (next) => {
        this.activeSystem = next;
        this.refresh([]);
        this.currentPath = '';
        this.browseFolder(this.currentPath);
      }, (err) => {
        this.error = err
      }
    );
    this.uploadResponse = { status: ''}
    this.numSelected = 0;
  }

  onChange(newValue): void {
    this.selectSystem(newValue);
  }

  selectSystem(sys: TSystem): void {
    this.activeSystemSubject.next(sys);
  }

  refresh(files: FileInfo[]): void {
    this.activeFiles = files;
    this.listing.next(this.activeFiles);
  }

  totalRefresh(): void {
    this.clearSelected();
    this.browseFolder(this.currentPath);
  }

  browseFolder(path: string) {
    this.state = 'loading';
    let count = (path.match(/\//g) || []).length;
    this.canNavigateUp = count;
    this.fileOpsService.listFiles(this.activeSystem.id, path)
      .subscribe( 
        (resp) => {
          if (resp.result[0].system === this.activeSystem.id) {
            if (this.view == 'move') resp.result = resp.result.filter( (file) => file.format == 'folder' )
            resp.result.shift();
            this.activeFiles = resp.result;
            this.clearSelected();
            this.state = 'loaded';
          }
        }, (err) => {
          this.error = err;
          console.log(err);
          if (err.status == 404) console.log('404 error')
        }
      );
  }

  openNewFolderDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    let dialogRef = this.dialog2.open(NewFolderDialogComponent, dialogConfig);
    dialogRef.afterClosed()
      .subscribe(
        (res) => {
          this.addFolder(res);
        }
      );
  }

  openFileUploadDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
    };
  
    let dialogRef = this.dialog2.open(FileUploadDialogComponent, dialogConfig);
    dialogRef.afterClosed()
      .subscribe(
        (res) => {
          if(res !== '') this.uploadFile(res);
        }
      );
  }

  moveTo(): void {
    
  }

  openMoveDialog() {

    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = 300;

    dialogConfig.data = {
        system: this.activeSystem,
        path: this.currentPath
    };

    if(this.numSelected > 0) {
      let dialogRef = this.dialog2.open(MoveDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(res => {
            this.copyTo(res)
          }
      );
    } else {
      alert('No Files Selected');
    }
  }


  addFolder(name: string) {
    this.fileOpsService.newFolder(this.activeSystem.id, this.currentPath, name)
      .subscribe( 
        (resp) => {
          this.browseFolder(this.currentPath);
        }
      );
  }

  changeView(view: string) {
      this.view = view;
  }

  //delete called in recursive lacks the response to speed up the delete
  delete(element: FileInfo) {
    this.fileOpsService._delete(this.activeSystem.id, element.path)
      .subscribe( 
        (resp) => {
        }
      );
  }

  deleteOne(element: FileInfo) {
    this.fileOpsService._delete(this.activeSystem.id, element.path)
    .subscribe( 
      (resp) => {
        this.browseFolder(this.currentPath);
      }
    );
    
  }

  rename( element: {file: FileInfo, name: string }) {
    this.fileOpsService.rename(this.activeSystem.id, element.file.path, element.name)
      .subscribe( 
        (resp) => {
          this.browseFolder(this.currentPath);
        }
      );
  }


  recursiveDelete(): void {
    if (confirm('Are you sure you want to delete selected files?')) {
      this.activeFiles.forEach( 
        (value) => {
          if(value.selected) this.delete(value);
        }
      )
      this.activeFiles = this.activeFiles.filter( file => file.selected == false);
      this.listing.next(this.activeFiles)
    }
  }

  recursiveDownload(): void {
    this.activeFiles.forEach( 
      (value) => {
        if(value.selected && value.format !== 'folder') this.downloadElement(value);
      }
    )
    this.clearSelected();
  }

  copyTo( element: FileInfo): void {
    if(confirm('Are you sure you want to copy the selected files to ' + element.path + ' on ' + element.system + '?')) {
      this.activeFiles.forEach( (file) => {
        if(file.selected == true) {
          this.fileOpsService.copyTo(this.activeSystem.id, file.path, element.system, element.path).subscribe( 
            (res) => {
              this.uploadResponse = res;
              console.log(this.uploadResponse);
              alert('Transfer Started');
            }, (err) => this.error = err
          );
        }
      });
    }

  }

  navigateDown(element: FileInfo) {
    this.currentPath = element.path;
    this.browseFolder(this.currentPath);
  }

  downloadElement(element: FileInfo) {
    this.contentService.filesGetContents(this.activeSystem.id, element.path)
    .subscribe( 
      (response) => { 
        console.log(response);
        this.downLoadFile(response, element.name);
      }
    );
  }

  downLoadFile(data: Blob, filename: string) {
    let blob = data;

    //For IE explorer
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob);
      return;
    }

    
    const datafile = window.URL.createObjectURL(blob);

    var link = document.createElement('a');
            link.href = datafile;
            link.download = filename;
            // this is necessary as link.click() does not work on the latest firefox
            link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

  }

  uploadFile(formData: FormData) {
    this.fileOpsService.insert(this.activeSystem.id, this.currentPath, undefined, formData)
      .subscribe( 
        (res) => {
          this.uploadResponse = res;
          console.log(this.uploadResponse);
          this.browseFolder(this.currentPath);
        }, (err) => this.error = err
      );
  }

  navigateUp() {
    this.currentPath = this.currentPath.slice(0,this.currentPath.lastIndexOf('/'));
    this.browseFolder(this.currentPath);
  }

  toggleSelect(file: FileInfo): void {
    if (file.selected == true) this.numSelected--;
    else this.numSelected++;
    file.selected = !file.selected;
    console.log(this.numSelected);
/*     for (let a of this.activeFiles) {
      if (a.selected == undefined) a.selected = false
      if (a.name == file.name) {
        if (a.selected == true) this.numSelected--;
        else this.numSelected++;
        a.selected = !a.selected;
        break;
      }
    } */
  }

  clearSelected(): void {
    this.activeFiles.forEach( 
      function (value) { 
        value.selected = false 
      }
    )
    this.listing.next(this.activeFiles);
    this.numSelected = 0
  }

  leftSelect(file: FileInfo): void {
    console.log(this.numSelected);
    if (file.format == 'folder' && file.selected && this.numSelected == 1) {
      this.navigateDown(file);
    } else if(this.numSelected == 1 && file.selected) {
      this.toggleSelect(file);
    } else if (this.numSelected == 0) this.toggleSelect(file); 
    else {
      this.clearSelected();
      this.toggleSelect(file);
    } 
  }

  shiftSelect(file: FileInfo): void {
    let index = this.activeFiles.map( e => e.name).indexOf(file.name);
    let startindex = this.activeFiles.map( e => e.selected).indexOf(true);
    if (startindex > index) {
      let temp = startindex;
      startindex = index;
      index = temp;
    }
    if (startindex == -1) startindex = 1;
    if (index == -1) index = 1;
    this.numSelected = this.numSelected + (index - startindex + 1)
    for(var i = startindex; i <= index; i++) {
      if (this.activeFiles[i].selected == true) this.numSelected--;
      this.activeFiles[i].selected = true;
    }
    this.listing.next(this.activeFiles);
  }

  ctrlSelect(file: FileInfo): void {
    this.toggleSelect(file);
  }

  dialogClose(file: FileInfo): void {
    this.dialogClosed.emit(file);
  }

}
