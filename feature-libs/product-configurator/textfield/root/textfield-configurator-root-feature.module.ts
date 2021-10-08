import { NgModule } from '@angular/core';
import { CART_FEATURE } from '@spartacus/cart/main/root';
import { CmsConfig, provideDefaultConfigFactory } from '@spartacus/core';
import { PRODUCT_CONFIGURATOR_TEXTFIELD_FEATURE } from './feature-name';

const cmsComponents: string[] = ['TextfieldConfigurationForm'];

// TODO: Inline this factory when we start releasing Ivy compiled libraries
export function defaultProductConfiguratorTextfieldComponentsConfig(): CmsConfig {
  const config: CmsConfig = {
    featureModules: {
      [PRODUCT_CONFIGURATOR_TEXTFIELD_FEATURE]: {
        cmsComponents,
        dependencies: [CART_FEATURE],
      },
    },
  };

  return config;
}

/**
 * Contains feature module configuration
 */
@NgModule({
  imports: [],
  providers: [
    provideDefaultConfigFactory(
      defaultProductConfiguratorTextfieldComponentsConfig
    ),
  ],
})
export class TextfieldConfiguratorRootFeatureModule {}
