/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Rule } from '@angular-devkit/schematics';
import { createStylePreprocessorOptions } from '../../../add-spartacus';

export function migrate(): Rule {
  return () => {
    return createStylePreprocessorOptions();
  };
}
