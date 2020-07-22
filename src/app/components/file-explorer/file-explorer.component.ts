import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core'
import { FileInfo } from '../../apis/ng-tapis-files-client';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { NewFolderDialogComponent } from '../modals/new-folder-dialog/new-folder-dialog.component';
import { RenameDialogComponent } from '../modals/rename-dialog/rename-dialog.component';
import { FileUploadDialogComponent } from '../modals/file-upload-dialog/file-upload-dialog.component';

import {FileOperationsService, ContentService, UploadResponse } from '../../apis/ng-tapis-files-client';
import {SystemsService, TSystem} from '../../apis/ng-tapis-systems-client';
import {Observable, ReplaySubject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalPreviewComponent} from '../modal-preview/modal-preview.component';
import { FormBuilder, FormGroup } from  '@angular/forms';



@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent implements OnInit {

  @Input() fileElements: FileInfo[]
  @Input() canNavigateUp: number
  @Input() path: string

  @Output() folderAdded = new EventEmitter<{ name: string }>()
  @Output() elementRemoved = new EventEmitter<FileInfo>()
  @Output() elementRenamed = new EventEmitter<FileInfo>()
  @Output() elementMoved = new EventEmitter<{
    element: FileInfo
    moveTo: FileInfo
  }>()
  @Output() navigatedDown = new EventEmitter<FileInfo>()
  @Output() navigatedUp = new EventEmitter()

  
  constructor(public dialog: MatDialog,
              private fileOpsService: FileOperationsService,
              private systemsService: SystemsService,
              private contentService: ContentService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal) { }

  private listing: ReplaySubject<Array<FileInfo>> = new ReplaySubject<Array<FileInfo>>(1);
  public readonly listing$: Observable<Array<FileInfo>> = this.listing.asObservable();
  private activeSystemSubject: ReplaySubject<TSystem> = new ReplaySubject<TSystem>(1);
  public readonly activeSystem$: Observable<TSystem> = this.activeSystemSubject.asObservable();
  public activeSystem: TSystem;
  private systemsListing: ReplaySubject<Array<TSystem>> = new ReplaySubject<Array<TSystem>>(1);
  public readonly systemsListing$: Observable<Array<TSystem>> = this.systemsListing.asObservable();
  public selectedFile: FileInfo;
  private currentPath: string;
  form: FormGroup;
  error: string;
  uploadResponse: UploadResponse;

  
  ngOnInit(): void {
    this.systemsService.getSystems()
      .subscribe( (resp) => {
        const systems = resp.result.filter( (s) => !s.available);
        this.systemsListing.next(systems);
        this.activeSystemSubject.next(systems[0]);
    }, (error) => {
    });


    this.activeSystem$.subscribe( (next) => {
      this.activeSystem = next;
      this.listing.next([]);
      this.currentPath = '';
      this.browseFolder(this.currentPath);

    });

    this.form = this.formBuilder.group({
      file: ['']
    });
    this.uploadResponse = { status: ''}
  }
  onChange(newValue) {
    console.log(newValue);
    this.selectSystem(newValue);
    // ... do other stuff here ...
  } 
  selectSystem(sys: TSystem) {
    this.activeSystemSubject.next(sys);
  }

  browseFolder(path: string) {
    this.currentPath = path;
    this.path = path
    let count = (path.match(/\//g) || []).length;
    this.canNavigateUp = count;
    this.fileOpsService.listFiles(this.activeSystem.id, path).subscribe( (resp) => {
      resp.result.shift();
      this.listing.next(resp.result);
    }, (error) => {
      console.log(error);
    });
  }

  preview(fileItem: FileInfo): void {
    console.log('preview file')
    const modalRef = this.modalService.open(ModalPreviewComponent, { size: 'xl' });
    modalRef.componentInstance.file = fileItem;
    modalRef.componentInstance.system = this.activeSystem;
  }

  download(): void {
    let filename = this.selectedFile.name;
    this.contentService.filesGetContents(this.activeSystem.id, this.selectedFile.path)
      .subscribe( (response) => { 
        console.log(response);
        this.downLoadFile(response, filename);
      });
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

  delete(): void {
    this.fileOpsService._delete(this.activeSystem.id, this.selectedFile.path)
      .subscribe( (resp) => {
      this.browseFolder(this.currentPath);
    });
  }

  selectFile(file: FileInfo): void {
    if (file.format == 'folder' && this.selectedFile == file) {
      this.currentPath = file.path;
      this.browseFolder(this.currentPath);
    } 
    this.selectedFile = this.selectedFile === file ? null : file;
  }

  moveUp(): void {
    this.currentPath = this.currentPath.slice(0,this.currentPath.lastIndexOf('/'));
    this.browseFolder(this.currentPath);
  }


  testRename(): void {
    this.fileOpsService.rename(this.activeSystem.id, this.selectedFile.path, 'testName')
    .subscribe( (resp) => {
    this.browseFolder(this.currentPath);
  });
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('file').setValue(file);
    }
  }


  onSubmit() {
    const formData = new FormData();
    formData.append('fileToUpload', this.form.get('file').value);

    this.fileOpsService.insert(this.activeSystem.id, this.currentPath, undefined, formData).subscribe(
      (res) => {
        this.uploadResponse = res
        this.browseFolder(this.currentPath);
      },
      (err) => this.error = err
    );
  }

  openMenu(event: MouseEvent, element: FileInfo, viewChild: MatMenuTrigger) {
    event.preventDefault();
    viewChild.openMenu();
  }

  deleteElement(element: FileInfo) {
    this.elementRemoved.emit(element);
    this.fileOpsService._delete(this.activeSystem.id, element.path)
      .subscribe( (resp) => {
      this.browseFolder(this.currentPath);
    });
  }

  navigate(file: FileInfo) {
    if (file.format == 'folder') {
      this.currentPath = file.path;
      this.browseFolder(this.currentPath);
      this.navigatedDown.emit(file);
    } 
    this.selectedFile = this.selectedFile === file ? null : file;
  }

  navigateUp() {
    this.navigatedUp.emit();
    this.moveUp();
  }

  moveElement(element: FileInfo, moveTo: FileInfo) {
    this.elementMoved.emit({ element: element, moveTo: moveTo });
  }

  downloadElement(element: FileInfo): void {
    this.contentService.filesGetContents(this.activeSystem.id, element.path)
      .subscribe( (response) => { 
        console.log(response);
        this.downLoadFile(response, element.name);
      });
  }

  openNewFolderDialog() {
    let dialogRef = this.dialog.open(NewFolderDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.folderAdded.emit({ name: res });
      }
    });
  }

  openFileUploadDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
        system: this.activeSystem,
        path: this.currentPath
    };

    let dialogRef = this.dialog.open(FileUploadDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      this.fileOpsService.insert(this.activeSystem.id, this.currentPath, undefined, res).subscribe(
        (res) => {
          this.uploadResponse = res
          this.browseFolder(this.currentPath);
        },
        (err) => this.error = err
      );
    });
  }

  openRenameDialog(element: FileInfo) {
    let dialogRef = this.dialog.open(RenameDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.fileOpsService.rename(this.activeSystem.id, element.path, res)
          .subscribe( (resp) => {
          this.browseFolder(this.currentPath);
        });
        element.name = res;
        this.elementRenamed.emit(element);
      }
    });
  }


}

