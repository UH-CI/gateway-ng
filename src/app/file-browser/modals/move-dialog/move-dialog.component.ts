import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { FileInfo } from 'src/app/apis/ng-tapis-files-client';

@Component({
  selector: 'app-move-dialog',
  templateUrl: './move-dialog.component.html',
  styleUrls: ['./move-dialog.component.css']
})
export class MoveDialogComponent implements OnInit {

  defaultView: string;
  
  constructor(private dialogRef: MatDialogRef<MoveDialogComponent>) { }

  ngOnInit(): void {
    this.defaultView = 'move'
  }

  dialogClosed(file: FileInfo): void {
    this.dialogRef.close(file);
  }
}
