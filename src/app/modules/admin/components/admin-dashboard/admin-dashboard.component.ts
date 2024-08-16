import { Component } from '@angular/core';

import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet } from '@angular/router';
import { SidePanelComponent } from '../side-panel/side-panel.component';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,RouterOutlet,SidePanelComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

}
