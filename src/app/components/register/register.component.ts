import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from 'src/app/_services/authentication/account.service';
import { ToasterService } from 'src/app/_services/helpers/toaster.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  model: any = {};
  @Input() usersFromHomeComponent: any;
  @Output() cancelRegister = new EventEmitter();
  constructor(
    private accountService: AccountService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {}

  register() {
    this.accountService.register(this.model).subscribe({
      error: ({ error }) => this.toaster.showError({ message: error }),
    });
  }

  cancel() {
    this.cancelRegister.emit();
  }
}
