import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  CmsConfig,
  I18nModule,
  provideDefaultConfig,
  UrlModule,
} from '@spartacus/core';
import {
  FormErrorsModule,
  IconModule,
  ItemCounterModule,
  MediaModule,
} from '@spartacus/storefront';
import { QuickOrderComponent } from './quick-order.component';
import { QuickOrderFormComponent } from './form/quick-order-form.component';
import { QuickOrderItemComponent } from './table/item/quick-order-item.component';
import { QuickOrderTableComponent } from './table/quick-order-table.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormErrorsModule,
    I18nModule,
    IconModule,
    ItemCounterModule,
    MediaModule,
    UrlModule,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        QuickOrderComponent: {
          component: QuickOrderComponent,
        },
      },
    }),
  ],
  declarations: [
    QuickOrderComponent,
    QuickOrderFormComponent,
    QuickOrderItemComponent,
    QuickOrderTableComponent,
  ],
  exports: [
    QuickOrderComponent,
    QuickOrderFormComponent,
    QuickOrderItemComponent,
    QuickOrderTableComponent,
  ],
})
export class QuickOrderListModule {}