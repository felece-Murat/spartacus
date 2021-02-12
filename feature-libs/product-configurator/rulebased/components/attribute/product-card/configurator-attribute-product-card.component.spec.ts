import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nTestingModule, Product, ProductService } from '@spartacus/core';
import { CommonConfiguratorTestUtilsService } from '@spartacus/product-configurator/common';
import { ItemCounterComponent, MediaModule } from '@spartacus/storefront';
import { UrlTestingModule } from 'projects/core/src/routing/configurable-routes/url-translation/testing/url-testing.module';
import { Observable, of } from 'rxjs';
import { Configurator } from '../../../core/model/configurator.model';
import { ConfiguratorShowMoreComponent } from '../../show-more/configurator-show-more.component';
import { ConfiguratorAttributeProductCardComponent } from './configurator-attribute-product-card.component';

interface ProductExtended extends Product {
  noLink?: boolean;
}

const product: ProductExtended = {
  name: 'Product Name',
  code: 'PRODUCT_CODE',
  images: {
    PRIMARY: {
      thumbnail: {
        url: 'url',
        altText: 'alt',
      },
    },
  },
  price: {
    formattedValue: '$1.500',
  },
  priceRange: {
    maxPrice: {
      formattedValue: '$1.500',
    },
    minPrice: {
      formattedValue: '$1.000',
    },
  },
};

const productTransformed: ProductExtended = {
  code: '1111-2222',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  images: {},
  name: 'Lorem Ipsum Dolor',
  noLink: true,
};

class MockProductService {
  get(): Observable<Product> {
    return of(product);
  }
}

@Component({
  selector: 'cx-configurator-price',
  template: '',
})
class MockConfiguratorPriceComponent {
  @Input() productPrice: number;
  @Input() quantity = 1;
  @Input() totalPrice: number;
}

describe('ConfiguratorAttributeProductCardComponent', () => {
  let component: ConfiguratorAttributeProductCardComponent;
  let fixture: ComponentFixture<ConfiguratorAttributeProductCardComponent>;
  let htmlElem: HTMLElement;

  const createImage = (url: string, altText: string): Configurator.Image => {
    const image: Configurator.Image = {
      url: url,
      altText: altText,
    };
    return image;
  };

  const createValue = (
    description: string,
    images: Configurator.Image[],
    quantity: number,
    selected: boolean,
    valueCode: string,
    valueDisplay: string
  ): Configurator.Value => {
    const value: Configurator.Value = {
      description,
      images,
      quantity,
      selected,
      valueCode,
      valueDisplay,
    };
    return value;
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          I18nTestingModule,
          ReactiveFormsModule,
          RouterTestingModule,
          UrlTestingModule,
          MediaModule,
        ],
        declarations: [
          ConfiguratorAttributeProductCardComponent,
          ConfiguratorShowMoreComponent,
          ItemCounterComponent,
          MockConfiguratorPriceComponent,
        ],
        providers: [
          {
            provide: ProductService,
            useClass: MockProductService,
          },
        ],
      })
        .overrideComponent(ConfiguratorAttributeProductCardComponent, {
          set: {
            changeDetection: ChangeDetectionStrategy.Default,
          },
        })
        .compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ConfiguratorAttributeProductCardComponent
    );
    htmlElem = fixture.nativeElement;
    component = fixture.componentInstance;
    component.multiSelect = false;
    component.product = createValue(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      [createImage('url', 'alt')],
      1,
      false,
      '1111-2222',
      'Lorem Ipsum Dolor'
    );

    spyOn(component, 'onHandleDeselect').and.callThrough();
    spyOn(component, 'onHandleQuantity').and.callThrough();
    spyOn(component, 'onHandleSelect').and.callThrough();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Buttons constellation', () => {
    it('should button be enabled when card actions are disabled and card is no selected', () => {
      const button = fixture.debugElement.query(By.css('button.btn'))
        .nativeElement;
      expect(button.disabled).toBe(false);
    });

    it('should button be enabled when card actions are disabled and card is selected', () => {
      component.product.selected = true;

      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button.btn'))
        .nativeElement;
      expect(button.disabled).toBe(false);
    });

    it('should button be called with proper select method', () => {
      const button = fixture.debugElement.query(By.css('button.btn'))
        .nativeElement;
      button.click();

      fixture.detectChanges();

      expect(component.onHandleSelect).toHaveBeenCalled();
    });

    it('should button be called with proper deselect action', () => {
      component.product.selected = true;

      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button.btn'))
        .nativeElement;

      button.click();

      fixture.detectChanges();

      expect(component.onHandleDeselect).toHaveBeenCalled();
    });

    it('should button have select text when card type is no multi select and card is no selected', () => {
      const button = fixture.debugElement.query(By.css('button.btn'))
        .nativeElement;

      expect(button.innerText).toContain('configurator.button.select');
    });

    it('should button have deselect text when card type is no multi select and card is selected', () => {
      component.product.selected = true;

      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button.btn'))
        .nativeElement;

      expect(button.innerText).toContain('configurator.button.deselect');
    });

    it('should button have add text when card type is multi select and card is no selected', () => {
      component.multiSelect = true;
      component.product.selected = false;

      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button.btn'))
        .nativeElement;

      expect(button.innerText).toContain('configurator.button.add');
    });

    it('should button have remove text when card type is multi select and card is selected', () => {
      component.multiSelect = true;
      component.product.selected = true;

      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button.btn'))
        .nativeElement;

      expect(button.innerText).toContain('configurator.button.remove');
    });
  });

  describe('quantity', () => {
    it('should quantity be hidden when card type is no multi select', () => {
      component.multiSelect = false;

      fixture.detectChanges();

      const quantityContainer = fixture.debugElement.query(
        By.css('.cx-configurator-attribute-product-card-quantity')
      );

      expect(quantityContainer).toBeNull();
    });

    it('should quantity be visible when card type is multi select', () => {
      component.multiSelect = true;

      fixture.detectChanges();

      const quantityContainer = fixture.debugElement.query(
        By.css('.cx-configurator-attribute-product-card-quantity')
      );

      expect(quantityContainer).toBeDefined();
    });

    it('should call handleQuantity on event onHandleQuantity', () => {
      spyOn(component.handleQuantity, 'emit').and.callThrough();

      component.onHandleQuantity(1);

      expect(component.handleQuantity.emit).toHaveBeenCalledWith(
        jasmine.objectContaining({
          quantity: 1,
          valueCode: component.product.valueCode,
        })
      );
    });

    it('should call onHandleDeselect of event onChangeQuantity', () => {
      const quantity = { quantity: 0 };

      component.onChangeQuantity(quantity);

      expect(component.onHandleDeselect).toHaveBeenCalled();
    });

    it('should call onHandleQuantity of event onChangeQuantity', () => {
      const quantity = { quantity: 2 };

      component.onChangeQuantity(quantity);

      expect(component.onHandleQuantity).toHaveBeenCalled();
    });

    it('should transformToProductType return Product', () => {
      expect(component.transformToProductType(component.product)).toEqual(
        productTransformed
      );
    });

    it('should display quantity when props withQuantity is true', () => {
      component.withQuantity = true;
      component.product.selected = true;
      component.multiSelect = true;

      fixture.detectChanges();

      CommonConfiguratorTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        'cx-configurator-attribute-quantity'
      );
    });

    it('should not display quantity when props withQuantity is false', () => {
      component.withQuantity = false;
      component.product.selected = true;
      component.multiSelect = true;

      fixture.detectChanges();

      CommonConfiguratorTestUtilsService.expectElementNotPresent(
        expect,
        htmlElem,
        'cx-configurator-attribute-quantity'
      );
    });

    it('should not display quantity when props multiSelect is false', () => {
      component.withQuantity = true;
      component.product.selected = true;
      component.multiSelect = false;

      fixture.detectChanges();

      CommonConfiguratorTestUtilsService.expectElementNotPresent(
        expect,
        htmlElem,
        'cx-configurator-attribute-quantity'
      );
    });

    it('should not display quantity when value is no selected', () => {
      component.withQuantity = true;
      component.product.selected = false;
      component.multiSelect = true;

      fixture.detectChanges();

      CommonConfiguratorTestUtilsService.expectElementNotPresent(
        expect,
        htmlElem,
        'cx-configurator-attribute-quantity'
      );
    });
  });

  describe('product price at value level', () => {
    it('should return price details with quantity and display content of cx-configurator-price ', () => {
      component.product.selected = true;
      component.product.quantity = 2;
      component.product.valuePrice = undefined;
      component.product.valuePriceTotal = undefined;
      fixture.detectChanges();

      expect(component.getProductPrice()).toBe(component.product.quantity);

      CommonConfiguratorTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        'cx-configurator-price'
      );
    });

    it('should return price details with value price and display content of cx-configurator-price ', () => {
      component.product.selected = true;
      component.product.quantity = undefined;
      component.product.valuePrice = {
        currencyIso: '$',
        formattedValue: '$20',
        value: 20,
      };
      component.product.valuePriceTotal = undefined;
      fixture.detectChanges();

      expect(component.getProductPrice()).toBe(component.product.valuePrice);

      CommonConfiguratorTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        'cx-configurator-price'
      );
    });

    it('should return price details with value price total and display content of cx-configurator-price ', () => {
      component.product.selected = true;
      component.product.quantity = undefined;
      component.product.valuePrice = undefined;
      component.product.valuePriceTotal = {
        currencyIso: '$',
        formattedValue: '$100',
        value: 100,
      };
      fixture.detectChanges();

      expect(component.getProductPrice()).toBe(
        component.product.valuePriceTotal
      );

      CommonConfiguratorTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        'cx-configurator-price'
      );
    });

    it('should display content of cx-configurator-price ', () => {
      component.product.selected = true;
      component.product.quantity = 2;
      component.product.valuePrice = {
        currencyIso: '$',
        formattedValue: '$10',
        value: 10,
      };
      component.product.valuePriceTotal = {
        currencyIso: '$',
        formattedValue: '$20',
        value: 20,
      };
      fixture.detectChanges();

      expect(component.getProductPrice()).not.toBeUndefined();

      CommonConfiguratorTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        'cx-configurator-price'
      );
    });
  });
});