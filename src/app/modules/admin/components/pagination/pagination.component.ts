import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() maxPagesToShow: number = 5; // Max number of page links to show
  @Output() pageChange = new EventEmitter<number>();

  currentPage: number = 1;

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages(): number[] {
    const pages: number[] = [];
    const totalPages = this.totalPages;

    let startPage: number;
    let endPage: number;

    if (totalPages <= this.maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const halfMaxPages = Math.floor(this.maxPagesToShow / 2);
      if (this.currentPage <= halfMaxPages) {
        startPage = 1;
        endPage = this.maxPagesToShow;
      } else if (this.currentPage + halfMaxPages >= totalPages) {
        startPage = totalPages - this.maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = this.currentPage - halfMaxPages;
        endPage = this.currentPage + halfMaxPages;
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push(-1); // Ellipsis
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push(-1); // Ellipsis
        pages.push(totalPages);
      }
    }

    return pages;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.pageChange.emit(this.currentPage);
    }
  }
}
