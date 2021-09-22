import { NgModule } from '@angular/core';
import { provideConfig } from '@spartacus/core';
import {
  CART_PICKUP_IN_STORE_FEATURE,
  PickupInStoreRootModule,
} from '@spartacus/cart/pickup-in-store/root';
import {
  pickupInStoreTranslationChunksConfig,
  pickupInStoreTranslations,
} from '@spartacus/cart/pickup-in-store/assets';

@NgModule({
  imports: [PickupInStoreRootModule],
  providers: [
    provideConfig({
      featureModules: {
        [CART_PICKUP_IN_STORE_FEATURE]: {
          module: () =>
            import('@spartacus/cart/pickup-in-store').then(
              (m) => m.PickupInStoreModule
            ),
        },
      },
      i18n: {
        resources: pickupInStoreTranslations,
        chunks: pickupInStoreTranslationChunksConfig,
        fallbackLang: 'en',
      },
    }),
  ],
})
export class PickupInStoreFeatureModule {}