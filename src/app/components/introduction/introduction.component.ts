import { Component } from '@angular/core';
import { ConfirmService } from 'src/app/_services/helpers/confirm.service';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css'],
})
export class IntroductionComponent {
  constructor(private confirmService: ConfirmService) {}

  handleTest() {
    this.confirmService.confirm().subscribe((confirmed) => {
      console.log('The user pressed', confirmed ? 'confirm' : 'cancel');
    });
  }
}
