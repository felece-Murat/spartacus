/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { effects } from './effects/index';

@NgModule({
  imports: [EffectsModule.forFeature(effects)],
})
export class WishListStoreModule {}