import { Component, OnInit, Input, Inject } from '@angular/core';
import {FileOperationsService, ContentService, UploadResponse } from '../../../apis/ng-tapis-files-client';
import {SystemsService, TSystem} from '../../../apis/ng-tapis-systems-client';
import { FormBuilder, FormGroup } from  '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";


@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.css']
})
export class FileUploadDialogComponent implements OnInit {

  system: TSystem;
  path: string;
  form: FormGroup;
  error: string;
  uploadResponse: UploadResponse;

  constructor(
    private fileOpsService: FileOperationsService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<FileUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) { 
        this.system = data.system;
        this.path = data.path;
    }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      file: ['']
    });
    this.uploadResponse = { status: ''}
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

    this.dialogRef.close(formData);
  }
}
