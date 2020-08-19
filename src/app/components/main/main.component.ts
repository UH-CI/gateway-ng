import { Component, OnInit } from '@angular/core';
import { FileInfo } from '../../apis/ng-tapis-files-client';
import {FileOperationsService, ContentService, UploadResponse } from '../../apis/ng-tapis-files-client';
import {SystemsService, TSystem} from '../../apis/ng-tapis-systems-client';
import {Observable, ReplaySubject} from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  
  
  fileElements: Observable<FileInfo[]>;
  currentRoot: FileInfo;
  currentPath: string;
  canNavigateUp = false;


  constructor(
    private fileOpsService: FileOperationsService,
    private systemsService: SystemsService,
    private contentService: ContentService,) { }

  ngOnInit(): void {
    console.log("WEWEASDASDSDFDS");
  }

}
