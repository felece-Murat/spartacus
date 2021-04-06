import { NgModule } from '@angular/core';
import { provideDefaultConfig } from '@spartacus/core';

@NgModule({
  providers: [
    provideDefaultConfig({
      featureModules: {
        carousel: {
          cmsComponents: ['RotatingImagesComponent'],
        },
      },
    }),
  ],
})
export class CarouselRootModule {}
