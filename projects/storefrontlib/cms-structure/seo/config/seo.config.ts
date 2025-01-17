/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Config } from '@spartacus/core';

@Injectable({
  providedIn: 'root',
  useExisting: Config,
})
export abstract class SeoConfig {
  seo?: SeoOptions;
}

export interface SeoOptions {
  structuredData?: StructuredData;
}

export interface StructuredData {
  disableInDevMode?: boolean;
}

declare module '@spartacus/core' {
  interface Config extends SeoConfig {}
}
