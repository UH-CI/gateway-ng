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
  selector: 'app-file-move',
  templateUrl: './file-move.component.html',
  styleUrls: ['./file-move.component.css']
})
export class FileMoveComponent implements OnInit {

  @Input() fileElements: FileInfo[];
  @Input() canNavigateUp: number
  @Input() path: string

  @Output() select = new EventEmitter<FileInfo>()
  @Output() open = new EventEmitter<FileInfo>()



  constructor(public dialog: MatDialog) { }
  
  tableCols: string[] = ['icon','name','open','select'];

  ngOnInit(): void {
  }
  openEmit(element: FileInfo) {
    this.open.emit(element)
  }

  selectEmit(element: FileInfo) {
    this.select.emit(element);
  }
}
