import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TopicsService } from '../../../../services/topics.service';
import { ModalComponent } from '../modal/modal.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { ToasterComponent } from '../toaster/toaster.component';


@Component({
    selector: 'app-example-page',
    standalone: true,
    imports: [PaginationComponent, CommonModule, FormsModule, ModalComponent,ToasterComponent],
    templateUrl: './example-page.component.html',
    styleUrl: './example-page.component.css'
})
export class ExamplePageComponent implements OnInit {
    items: any[] = [];
    currentPage: number = 1;
    itemsPerPage: number = 10;
    searchValue: string = '';
    totalItems: number = 0;

    modalTitle: string = 'Example Modal Title';
    modalBody: string = ` <div class="container mt-5">
       <form>
      <div class="mb-3">
        <label for="input1" class="form-label">Field 1</label>
        <input type="text" class="form-control" id="input1" placeholder="Enter text for field 1">
      </div>
      <div class="mb-3">
        <label for="input2" class="form-label">Field 2</label>
        <input type="text" class="form-control" id="input2" placeholder="Enter text for field 2">
      </div>
      <div class="mb-3">
        <label for="input3" class="form-label">Field 3</label>
        <input type="text" class="form-control" id="input3" placeholder="Enter text for field 3">
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>`;
    isOpen: string = 'close';
    constructor(private topicsService: TopicsService, private router: Router) {
        // this.items = Array.from({ length: 300 }, (_, i) => ({ name: `Item ${i + 1}` }));
    }

    ngOnInit(): void {
        this.loadTopics({ 'pageNumber': this.currentPage });
    }

    loadTopics(params: any) {
        this.topicsService.getTopicList(params).subscribe((topic) => {
            this.items = topic.data
            this.totalItems = topic?.totalCount;

        })
    }
    get paginatedItems(): any[] {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.items;
    }

    onPageChange(page: number): void {

        this.currentPage = page;
        let data = {
            pageNumber: this.currentPage,
            searchText: this.searchValue ?? ''
        }
        this.loadTopics(data);
    }

    showModal(isOpen: string) {
        {

            this.isOpen = isOpen;
        }

    }
    onShowModal(isOpen: string) {
        this.isOpen = isOpen;
    }
    getSerialNumber(index: number): number {
        return (this.currentPage - 1) * this.itemsPerPage + index + 1;
    }

    filterData(event: Event): void {
        let data = {
            pageNumber: 1,
            searchText: this.searchValue ?? ''
        }
        this.loadTopics(data);

    }

}
