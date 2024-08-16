import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../services/toast.service';
import { ToastEvent } from '../../models/toast-event';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [ToastComponent, CommonModule],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.css'
})
export class ToasterComponent implements OnInit {
  currentToasts: ToastEvent[] = [];
  constructor(
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit() {
    console.log("==")
    this.subscribeToToasts();
  }

  subscribeToToasts() {
    this.toastService.toastEvents.subscribe((toasts) => {
      console.log("toasts=====", toasts)
      const currentToast: ToastEvent = {
        type: toasts.type,
        title: toasts.title,
        message: toasts.message,
      };
      this.currentToasts.push(currentToast);
      this.cdr.detectChanges();
    });

    this.toastService.showInfoToast("My Toast", "This is mY Toast");
  }

  dispose(index: number) {
    this.currentToasts.splice(index, 1);
    this.cdr.detectChanges();
  }
}
