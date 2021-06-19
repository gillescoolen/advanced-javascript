import {Component, ViewChild} from '@angular/core';
import {SidebarComponent} from './sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  sideBarClosed = false;

  @ViewChild('sidebar') sidebar!: SidebarComponent;

  onSideBarClosed(event: boolean): void {
    this.sideBarClosed = event;
  }

  async toggleSidebar(): Promise<void> {
    await this.sidebar.toggle();
  }
}
