import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { provideConfig, I18nModule } from '@spartacus/core';
import {
  CarouselModule,
  IconModule,
  KeyboardFocusModule,
  MediaModule,
} from '@spartacus/storefront';
import { defaultImageZoomLayoutConfig } from './default-image-zoom-layout.config';
import { ImageZoomDialogComponent } from './image-zoom-dialog/image-zoom-dialog.component';
import { ImageZoomThumbnailsModule } from './image-zoom-thumbnails/image-zoom-thumbnails.module';
import { ImageZoomViewComponent } from './image-zoom-view/image-zoom-view.component';
import { ImageZoomTriggerComponent } from './image-zoom-trigger/image-zoom-trigger.component';

@NgModule({
  imports: [
    CommonModule,
    MediaModule,
    CarouselModule,
    IconModule,
    KeyboardFocusModule,
    ImageZoomThumbnailsModule,
    I18nModule,
  ],
  providers: [provideConfig(defaultImageZoomLayoutConfig)],
  declarations: [
    ImageZoomDialogComponent,
    ImageZoomTriggerComponent,
    ImageZoomViewComponent,
  ],
  exports: [
    ImageZoomDialogComponent,
    ImageZoomTriggerComponent,
    ImageZoomViewComponent,
  ],
})
export class ImageZoomModule {}