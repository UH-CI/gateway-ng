import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core'
import { FileInfo } from '../apis/ng-tapis-files-client';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';

import {FileOperationsService, ContentService, UploadResponse } from '../apis/ng-tapis-files-client';
import {SystemsService, TSystem} from '../apis/ng-tapis-systems-client';
import {Observable, ReplaySubject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from  '@angular/forms';
import { NewFolderDialogComponent } from './modals/new-folder-dialog/new-folder-dialog.component';
import { RenameDialogComponent } from './modals/rename-dialog/rename-dialog.component';
import { FileUploadDialogComponent } from './modals/file-upload-dialog/file-upload-dialog.component';
import { FileTileComponent } from './file-tile/file-tile.component';

@Component({
  selector: 'app-file-browser',
  templateUrl: './file-browser.component.html',
  styleUrls: ['./file-browser.component.css']
})
export class FileBrowserComponent implements OnInit {

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
  
  fileElements: Observable<FileInfo[]>;
  currentRoot: FileInfo;
  currentPath: string;
  canNavigateUp: number;
  view: string;
  numSelected: number;
  timeout: number;
  timedout: boolean;

  ngOnInit(): void {
    this.view = 'tile';
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
    this.timeout = 0;
    this.timedout = false;
  }

  onChange(newValue): void {
    this.selectSystem(newValue);
  }

  selectSystem(sys: TSystem): void {
    this.activeSystemSubject.next(sys);
  }

  refresh(files: FileInfo[]): void {
    this.listing.next(files);
    this.fileElements = this.listing.asObservable();
  }

  totalRefresh(): void {

  }

  browseFolder(path: string) {
    let count = (path.match(/\//g) || []).length;
    this.canNavigateUp = count;
    this.fileOpsService.listFiles(this.activeSystem.id, path)
      .subscribe( 
        (resp) => {
          resp.result.shift();
          this.refresh(resp.result);
          this.timeout = 0;
        }, (err) => {
          this.error = err;
          this.timeout++;
          if (this.timeout <= 3) {
            this.browseFolder(this.currentPath);
          } else this.timedout = false;
          console.log(err);
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
          if (res) {
            this.fileOpsService.newFolder(this.activeSystem.id, this.currentPath, res)
              .subscribe( (resp) => {
                this.browseFolder(this.currentPath);
              }
            );
          }
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
          this.fileOpsService.insert(this.activeSystem.id, this.currentPath, undefined, res)
            .subscribe(
              (res) => {
                this.uploadResponse = res
                this.browseFolder(this.currentPath);
              }, (err) => this.error = err
            );
        }
      );
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

  delete(element: FileInfo) {
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

  moveTo( element: any) {

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
    this.fileElements
      .subscribe( 
        (resp) => {
          for (let a of resp) {
            if (a.name = file.name) {
              if (a.selected == true) this.numSelected--;
              else this.numSelected++;
              a.selected = !a.selected;
              break;
            }
          }
          this.refresh(resp);
        }, (err) => this.error = err
      );
  }

  clearSelected(): void {
    this.fileElements
      .subscribe( 
        (resp) => {
          resp.forEach( 
            function (value) { 
              value.selected = false 
            }
          )
          this.refresh(resp);
          this.numSelected = 0;
        }, (err) => this.error = err
      );
  }

  leftSelect(file: FileInfo): void {
    if (file.format == 'folder' && file.selected && this.numSelected == 1) {
      this.navigateDown(file);
    } else if(this.numSelected == 1 && file.selected) {
      this.toggleSelect(file);
    } else if (this.numSelected > 1) {
      this.clearSelected();
      file.selected = true;
    }
  }

  shiftSelect(file: FileInfo): void {
    this.fileElements
    .subscribe( 
      (resp) => {
        let index = resp.map( e => e.name).indexOf(file.name);
        let startindex = resp.map( e => e.selected).indexOf(true);
        if (startindex > index) {
          let temp = startindex;
          startindex = index;
          index = temp;
        }
        this.numSelected = this.numSelected + (index - startindex + 1)
        for(var i = startindex; i <= index; i++) {
          if (resp[i].selected == true) this.numSelected--;
          resp[i].selected = true;
        }
        this.refresh(resp);
      }, (err) => this.error = err
    );
  }

  ctrlSelect(file: FileInfo): void {
    this.toggleSelect(file);
  }

}
