import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { FlexLayoutModule } from '@angular/flex-layout'
import { CommonModule } from '@angular/common'
import { MatGridListModule } from '@angular/material/grid-list'
import { FormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatMenuModule } from '@angular/material/menu'
import {MatSelectModule} from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { SidenavServiceService } from './sidenav-service.service';
import { HomepageComponent } from './homepage/homepage.component';
import { FooterComponent } from './footer/footer.component';


import { JwtInterceptor, AuthInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { AppConfig } from './_services/config.service';
import { DataBrowserComponent } from './components/data-browser/data-browser.component';
import { FileListingRowComponent } from './components/file-listing-row/file-listing-row.component';
import { NgxFilesizeModule } from 'ngx-filesize';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalPreviewComponent } from './components/modal-preview/modal-preview.component';
import { SecuredImageComponent } from './components/secured-image/secured-image.component';
import { SecuredTextComponent } from './components/secured-text/secured-text.component';


import { FileManagerAllModule } from '@syncfusion/ej2-angular-filemanager';
import { LoginComponent } from './login/login.component';
import {environment} from '../environments/environment';
import { MainComponent } from './components/main/main.component';
import {ApiModule as FilesClient} from './apis/ng-tapis-files-client';
import {ApiModule as SystemsClient, Configuration} from './apis/ng-tapis-systems-client';
import { FileExplorerComponent } from './components/file-explorer/file-explorer.component';
import { NewFolderDialogComponent } from './file-browser/modals/new-folder-dialog/new-folder-dialog.component';
import { RenameDialogComponent } from './file-browser/modals/rename-dialog/rename-dialog.component';
import { FileUploadDialogComponent } from './file-browser/modals/file-upload-dialog/file-upload-dialog.component';
import { FileBrowserComponent } from './file-browser/file-browser.component';
import { FileListComponent } from './file-browser/file-list/file-list.component';
import { FileTileComponent } from './file-browser/file-tile/file-tile.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MoveDialogComponent } from './file-browser/modals/move-dialog/move-dialog.component';
import { FileMoveComponent } from './file-browser/file-move/file-move.component';
import { TestDialogComponent } from './file-browser/modals/test-dialog/test-dialog.component';

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavComponent,
    HomepageComponent,
    MainComponent,
    FooterComponent,
    LoginComponent,
    FileListingRowComponent,
    ModalPreviewComponent,
    SecuredImageComponent,
    SecuredTextComponent,
    DataBrowserComponent,
    FileExplorerComponent,
    NewFolderDialogComponent,
    RenameDialogComponent,
    FileUploadDialogComponent,
    FileBrowserComponent,
    FileListComponent,
    FileTileComponent,
    MoveDialogComponent,
    FileMoveComponent,
    TestDialogComponent
  ],
  imports: [
    FilesClient.forRoot((): Configuration => new Configuration({basePath: environment.baseUrl})),
    SystemsClient.forRoot((): Configuration => new Configuration({basePath: environment.baseUrl})),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    FileManagerAllModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgHttpLoaderModule.forRoot(),
    NgxFilesizeModule,
    NgbModule,
    CommonModule,
    FlexLayoutModule,
    MatGridListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule

  ],
  providers: [
    SidenavServiceService,
    AppConfig,
    { 
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig], 
      multi: true 
    },
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true 
    },
/*     {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: AuthInterceptor 
    }, */
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
