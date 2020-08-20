import { Component, OnInit, Input, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { FileOperationsService } from '../../../apis/ng-tapis-files-client';
import { SystemsService, TSystem } from '../../../apis/ng-tapis-systems-client';
import { FileInfo } from '../../../apis/ng-tapis-files-client';
import {Observable, ReplaySubject} from 'rxjs';

@Component({
  selector: 'app-move-dialog',
  templateUrl: './move-dialog.component.html',
  styleUrls: ['./move-dialog.component.css']
})
export class MoveDialogComponent implements OnInit {

  constructor(private fileOpsService: FileOperationsService,
    private systemsService: SystemsService,
    private dialogRef: MatDialogRef<MoveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) { }

  private listing: ReplaySubject<Array<FileInfo>> = new ReplaySubject<Array<FileInfo>>(1);
  public readonly listing$: Observable<Array<FileInfo>> = this.listing.asObservable();
  private activeSystemSubject: ReplaySubject<TSystem> = new ReplaySubject<TSystem>(1);
  public readonly activeSystem$: Observable<TSystem> = this.activeSystemSubject.asObservable();
  public activeSystem: TSystem;
  private systemsListing: ReplaySubject<Array<TSystem>> = new ReplaySubject<Array<TSystem>>(1);
  public readonly systemsListing$: Observable<Array<TSystem>> = this.systemsListing.asObservable();

  activeFiles: FileInfo[];
  error: string;
  currentPath: string;
  canNavigateUp: number;
  path: string;

  tableDataSrc: any;
  tableCols: string[] = ['icon','name','open','select'];

  ngOnInit(): void {
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
  }

  refresh(files: FileInfo[]): void {
    this.activeFiles = files;
    this.listing.next(this.activeFiles);
  }

  open(element) {

  }

  select() {}

  browseFolder(path: string) {
    let count = (path.match(/\//g) || []).length;
    this.canNavigateUp = count;
    this.fileOpsService.listFiles(this.activeSystem.id, path)
      .subscribe( 
        (resp) => {
          resp.result.shift();
          this.refresh(resp.result);
        }, (err) => {
          this.error = err;
          console.log(err);
          if (err.status == 404) console.log('404 error')
        }
      );
  }
}
