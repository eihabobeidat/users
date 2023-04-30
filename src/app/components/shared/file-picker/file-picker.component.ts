import { Component, EventEmitter, Output } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { Photo } from 'src/app/_models/photo';
import { AccountService } from 'src/app/_services/authentication/account.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file-picker',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.css'],
})
export class FilePickerComponent {
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean = false;
  hasAnotherDropZoneOver: boolean = false;
  @Output() fileHandler = new EventEmitter();
  response: string;

  constructor(private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.initiateUploader(`Bearer ${user.token}`);
      }
    });
  }

  initiateUploader(token: string = '') {
    this.uploader = new FileUploader({
      url: environment.apiUrl + 'Users/add-photo',
      authToken: token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (file, response, status, headers) => {
      if (response) {
        const photo: Photo = JSON.parse(response);
        this.fileHandler.emit(photo);
      }
    };
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
}
