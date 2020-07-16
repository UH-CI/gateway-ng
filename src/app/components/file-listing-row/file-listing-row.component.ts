import {Component, Input, OnInit} from '@angular/core';
import {FileInfo} from '../../apis/ng-tapis-files-client';

@Component({
  selector: 'app-file-listing-row',
  templateUrl: './file-listing-row.component.html',
  styleUrls: ['./file-listing-row.component.scss']
})
export class FileListingRowComponent implements OnInit {

  @Input() fileInfo: FileInfo;

  constructor() { }

  ngOnInit(): void {
  }

  public isDir(): boolean {
    return this.fileInfo.path.endsWith('/');
  }

}
