import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/commons/header/header.component';
import { SidePannelComponent } from './components/commons/side-pannel/side-pannel.component';
import { FooterComponent } from './components/commons/footer/footer.component';
import { AlertMessageComponent } from './components/commons/alert-message/commons';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidePannelComponent, FooterComponent, AlertMessageComponent,CommonModule,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'icad_frontend';
}
