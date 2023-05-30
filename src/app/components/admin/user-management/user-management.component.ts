import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin/admin.service';
import { ModalBoxComponent } from '../../shared/modal-box/modal-box.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: User[];
  bsModalRef: BsModalRef<ModalBoxComponent> =
    new BsModalRef<ModalBoxComponent>();

  constructor(
    private adminService: AdminService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe({
      next: (users: User[]) => {
        this.users = users;
      },
    });
  }

  openModal(user: User) {
    const modalConfig: ModalOptions = {
      class: 'modal-dialog-centered',
      initialState: {
        title: `Edit roles for ${user.username}`,
        selectedRoles: [...user.roles],
        availableRoles: ['Admin', 'Moderator', 'Member'],
        username: user.username,
        // closeButtonName: 'Save', another way to dominstrait this
      },
    };
    this.bsModalRef = this.modalService.show(ModalBoxComponent, modalConfig);
    this.bsModalRef.content.closeButtonName = 'Save';
    this.bsModalRef.onHide.subscribe({
      next: (value) => {
        if (value.initialState) {
          let selectedRoles = value.initialState.selectedRoles;
          if (!this.areEqualArrays(user.roles, selectedRoles)) {
            let stringifiedRolesList = selectedRoles.toString();
            this.adminService
              .updateUserRoles(user.username, stringifiedRolesList)
              .subscribe({
                next: (response: string[]) => {
                  user.roles = response;
                },
              });
          }
        }
      },
    });
  }

  areEqualArrays(array1: any[], array2: any[]) {
    return JSON.stringify(array1.sort()) === JSON.stringify(array2.sort());
  }
}
