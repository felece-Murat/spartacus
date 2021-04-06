import { ICON_TYPE } from '@spartacus/storefront';

export interface CarouselButton {
  // visible: boolean;
  disabled: boolean;
  icon?: ICON_TYPE;
}

export interface CarouselIndicator {
  position: number;
  /**
   * Indicates whether the indicator is active.
   */
  selected: boolean;
}

export interface CarouselNavigation {
  previous?: CarouselButton;
  next?: CarouselButton;
  indicators?: CarouselIndicator[];
}

export interface CarouselConfig {
  navigation?: {
    hideIndicators: boolean;
  };
}
