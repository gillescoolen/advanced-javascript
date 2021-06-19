import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay, tap } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  constructor(public authService: AuthService) {
  }

  @ViewChild('drawer') drawer!: MatSidenav;

  @Output() closed: EventEmitter<boolean> = new EventEmitter();

  async toggle(): Promise<void> {
    await this.drawer.toggle();
  }
}
