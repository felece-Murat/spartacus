import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CheckFacade, PaymentTypeFacade } from '@spartacus/checkout/root';
import {
  ActiveCartService,
  B2BPaymentTypeEnum,
  CartActions,
  Command,
  CommandService,
  LanguageSetEvent,
  OCC_USER_ID_ANONYMOUS,
  PaymentType,
  Query,
  QueryService,
  UserIdService,
} from '@spartacus/core';
import { combineLatest, Observable, throwError } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { PaymentTypeConnector } from '../connectors/payment-type/payment-type.connector';
import { CheckoutActions } from '../store/actions/index';
import { StateWithCheckout } from '../store/checkout-state';

@Injectable()
export class PaymentTypeService implements PaymentTypeFacade {
  protected paymentTypesQuery: Query<PaymentType[]> = this.query.create(
    () => this.paymentTypeConnector.getPaymentTypes(),
    {
      //! Why we don't consider currency changes here?
      //! Wouldn't that potentially result in different API response
      reloadOn: [LanguageSetEvent],
    }
  );

  protected setPaymentTypeCommand: Command<any> = this.command.create(
    (payload) => {
      return combineLatest([
        this.userIdService.takeUserId(),
        this.activeCartService.getActiveCartId(),
      ]).pipe(
        take(1),
        switchMap(([userId, cartId]) => {
          //! What about guest checkout? Why it is not allowed?
          if (userId && userId !== OCC_USER_ID_ANONYMOUS && cartId) {
            return this.paymentTypeConnector.setPaymentType(
              userId,
              cartId,
              payload.typeCode,
              payload.poNumber
            );
          } else {
            return throwError({
              message: 'error message',
            });
          }
        }),
        tap((data) => {
          //! Unique endpoint optimization (other checkout endpoints doesn't return cart)
          this.checkoutStore.dispatch(
            new CartActions.LoadCartSuccess({
              cart: data,
              userId: payload.userId,
              cartId: payload.cartId,
            })
          );
          //! We clear everything? We should just reset the checkout data from backend
          this.checkoutStore.dispatch(new CheckoutActions.ClearCheckoutData());
        })
      );
    }
  );

  constructor(
    protected checkoutStore: Store<StateWithCheckout>,
    protected activeCartService: ActiveCartService,
    protected userIdService: UserIdService,
    protected query: QueryService,
    protected command: CommandService,
    protected paymentTypeConnector: PaymentTypeConnector,
    protected checkService: CheckFacade
  ) {}

  /**
   * Get payment types
   */
  getPaymentTypes(): Observable<PaymentType[]> {
    return this.paymentTypesQuery
      .get()
      .pipe(map((paymentTypes) => paymentTypes ?? []));
  }

  /**
   * Set payment type to cart
   * @param typeCode
   * @param poNumber : purchase order number
   */
  // TODO: Multiple layers interface
  setPaymentType(typeCode: string, poNumber?: string): Observable<unknown> {
    return this.setPaymentTypeCommand.execute({
      typeCode,
      poNumber,
    });
  }

  /**
   * Get the selected payment type
   */
  getSelectedPaymentType(): Observable<string | undefined> {
    return this.checkService
      .getCheckoutDetails()
      .pipe(map((state) => state?.data?.paymentType?.code));
  }

  /**
   * Get whether the selected payment type is "ACCOUNT" payment
   */
  isAccountPayment(): Observable<boolean> {
    return this.getSelectedPaymentType().pipe(
      map((selected) => selected === B2BPaymentTypeEnum.ACCOUNT_PAYMENT)
    );
  }

  /**
   * Get PO Number
   */
  getPoNumber(): Observable<string | undefined> {
    return this.checkService
      .getCheckoutDetails()
      .pipe(map((state) => state?.data?.purchaseOrderNumber));
  }
}
