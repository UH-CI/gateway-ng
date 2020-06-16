import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filemanager',
  templateUrl: './filemanager.component.html',
  styleUrls: ['./filemanager.component.css']
})
export class FilemanagerComponent implements OnInit {
  public hostUrl: string = 'https://ej2services.syncfusion.com/production/web-services/';
  public ajaxSettings: object = {
       url: this.hostUrl + 'api/FileManager/FileOperations',
       getImageUrl: this.hostUrl + 'api/FileManager/GetImage',
       uploadUrl: this.hostUrl + 'api/FileManager/Upload',
       downloadUrl: this.hostUrl + 'api/FileManager/Download'
  }; 
  constructor() { }

  ngOnInit(): void {
  }

}
