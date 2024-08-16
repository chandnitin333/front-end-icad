import { Component } from '@angular/core';
import { ToasterComponent } from '../toaster/toaster.component';
// import { BarChartComponent } from '../Chart/bar-chart/bar-chart.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ToasterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
