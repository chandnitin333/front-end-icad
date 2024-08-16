import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() modelTitle: string = '';
  @Input() modalBody: string = '';
  @Output() onClose = new EventEmitter<void>();
  @Output() onOpen = new EventEmitter<void>();
  @Output() toggleModal = new EventEmitter<string>();
  isShow: string = 'open';
  closeModal() {
    this.onClose.emit();
  }
  openModal() {
    this.onOpen.emit();
  }

  isShowModal(isOpen: string): void {
    this.isShow = isOpen
    this.toggleModal.emit(this.isShow);

  }
  get mTitle():string{
    return this.modelTitle;
  }
  get mBody():string{
    return this.modalBody;
  }
}
