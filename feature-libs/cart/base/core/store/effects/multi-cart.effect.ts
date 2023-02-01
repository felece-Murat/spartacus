/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { CartType } from '@spartacus/cart/base/root';
import { isNotUndefined, OCC_CART_ID_CURRENT } from '@spartacus/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { isSelectiveCart } from '../../utils/utils';
import { CartActions } from '../actions/index';

@Injectable()
export class MultiCartEffects {
  // TODO(#7241): Remove when we drop ADD_VOUCHER process and we sort out checkout and cart dependencies
  @Effect()
  processesIncrement$: Observable<CartActions.CartProcessesIncrement> = this.actions$.pipe(
    ofType(CartActions.CART_ADD_VOUCHER),
    map((action: CartActions.CartAddVoucher) => action.payload),
    map((payload) => new CartActions.CartProcessesIncrement(payload.cartId))
  );

  @Effect()
  setSelectiveId$: Observable<CartActions.SetCartTypeIndex> = this.actions$.pipe(
    ofType(CartActions.LOAD_CART_SUCCESS),
    map((action: Action) => {
      switch (action.type) {
        case CartActions.LOAD_CART_SUCCESS: {
          const payload = (action as CartActions.LoadCartSuccess).payload;
          if (isSelectiveCart(payload.cartId)) {
            return new CartActions.SetCartTypeIndex({
              cartType: CartType.SELECTIVE,
              cartId: payload.cartId,
            });
          }
          break;
        }
      }
    }),
    filter(isNotUndefined)
  );

  @Effect()
  setActiveCartId$: Observable<CartActions.SetCartTypeIndex> = this.actions$.pipe(
    ofType(
      CartActions.LOAD_CART_SUCCESS,
      CartActions.LOAD_CART,
      CartActions.CREATE_CART_SUCCESS,
      CartActions.CREATE_CART,
      CartActions.SET_ACTIVE_CART_ID
    ),
    map((action: CartActions.CartAction | CartActions.SetActiveCartId) => {
      switch (action.type) {
        case CartActions.LOAD_CART: {
          return this.getActiveCartTypeOnLoad(action);
        }
        case CartActions.LOAD_CART_SUCCESS: {
          if (action?.payload?.extraData?.active) {
            // saved cart is not active cart
            if (action.payload?.cart.saveTime) {
              return new CartActions.SetCartTypeIndex({
                cartType: CartType.ACTIVE,
                cartId: '',
              });
            }
            return new CartActions.SetCartTypeIndex({
              cartType: CartType.ACTIVE,
              cartId: action.meta.entityId as string,
            });
          }
          break;
        }
        case CartActions.CREATE_CART: {
          return this.getActiveCartTypeOnCreate(action);
        }
        case CartActions.CREATE_CART_SUCCESS: {
          return new CartActions.SetCartTypeIndex({
            cartType: action?.payload?.extraData?.active
              ? CartType.ACTIVE
              : CartType.NEW_CREATED,
            cartId: action.meta.entityId as string,
          });
        }
        case CartActions.SET_ACTIVE_CART_ID:
          return new CartActions.SetCartTypeIndex({
            cartType: CartType.ACTIVE,
            cartId: action.payload,
          });
      }
      return undefined;
    }),
    filter(isNotUndefined)
  );

  /**
   * Verifies if cart is the current cart and returns the appropriate cart type
   * @param action
   * @returns cart type needed on load
   */
  private getActiveCartTypeOnLoad(
    action: CartActions.LoadCart
  ): CartActions.SetCartTypeIndex | undefined {
    if (action?.payload?.cartId === OCC_CART_ID_CURRENT) {
      return new CartActions.SetCartTypeIndex({
        cartType: CartType.ACTIVE,
        cartId: '',
      });
    }
    return undefined;
  }

  /**
   * Verifies if cart is active and returns the appropriate cart type
   * @param action
   * @returns cart type needed on creation
   */
  private getActiveCartTypeOnCreate(
    action: CartActions.CreateCart
  ): CartActions.SetCartTypeIndex | undefined {
    if (action?.payload?.extraData?.active) {
      return new CartActions.SetCartTypeIndex({
        cartType: CartType.ACTIVE,
        cartId: action.meta.entityId as string,
      });
    }
    return undefined;
  }

  constructor(private actions$: Actions) {}
}
