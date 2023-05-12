import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class ListsComponent implements OnInit {
  members: Member[];
  predicate: 'liked' | 'likedBy' = 'liked';
  pageNumber: number = 1;
  pageSize: number = 6;
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
  constructor(private memberService: MembersService) {}

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes(params?: { page: number; itemsPerPage: number }) {
    if (params) {
      this.pageNumber = params?.page;
      this.pageSize = params?.itemsPerPage;
    }

    this.memberService
      .getLikes(this.predicate, this.pageNumber, this.pageSize)
      .subscribe({
        next: (response) => {
          this.pagination = JSON.parse(response.headers.get('Pagination'));
          this.members = response.body;
        },
      });
  }

  resetPagination() {
    this.pageNumber = 1;
    this.pageSize = 6;
  }

  getPredicateLike() {
    this.resetPagination();
    this.loadLikes();
  }
}
