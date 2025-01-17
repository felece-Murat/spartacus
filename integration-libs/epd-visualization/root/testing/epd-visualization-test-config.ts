/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { EpdVisualizationConfig } from '../config/epd-visualization-config';

export function getTestConfig(): EpdVisualizationConfig {
  return {
    epdVisualization: {
      apis: {
        baseUrl:
          'https://epd-acc-eu20-consumer.epdacc.cfapps.eu20.hana.ondemand.com',
      },
      ui5: {
        bootstrapUrl:
          'https://sapui5.hana.ondemand.com/1.107.1/resources/sap-ui-core.js',
      },
    },
  };
}
