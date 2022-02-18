import { ApplicationRef, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';

  constructor(private app: ApplicationRef) {}

  onRouteActivated() {
    this.app.tick();
  }
}
