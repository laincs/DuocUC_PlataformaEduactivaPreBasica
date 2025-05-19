
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter }       from '@angular/router';

import { AppComponent }        from './app/app.component';
import { appConfig }           from './app/app.config';
import { routes }              from './app/app.routes';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    
    ...(appConfig.providers ?? []),
    
    provideRouter(routes),
  ]
})
.catch(err => console.error(err));
