import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { FileInfo } from 'src/app/apis/ng-tapis-files-client';

@Component({
  selector: 'app-test-dialog',
  templateUrl: './test-dialog.component.html',
  styleUrls: ['./test-dialog.component.css']
})
export class TestDialogComponent implements OnInit {

  defaultView: string;

  tableCols: string[] = ['icon','name','open','select'];

  constructor(private dialogRef: MatDialogRef<TestDialogComponent>) { }

  ngOnInit(): void {
    this.defaultView = 'move'
  }

  dialogClosed(file: FileInfo): void {
    this.dialogRef.close(file);
  }
  

}
