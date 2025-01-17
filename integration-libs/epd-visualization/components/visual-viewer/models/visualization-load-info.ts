/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { VisualizationInfo } from '@spartacus/epd-visualization/root';

export enum VisualizationLookupResult {
  UniqueMatchFound = 'UniqueMatchFound',
  NoMatchFound = 'NoMatchFound',
  MultipleMatchesFound = 'MultipleMatchesFound',
  UnexpectedError = 'UnexpectedError',
}

export enum VisualizationLoadStatus {
  NotStarted = 'NotStarted',
  Loading = 'Loading',
  Loaded = 'Loaded',
  UnexpectedError = 'UnexpectedError',
}

/**
 * Information relating to an attempt to resolve and load a visualization.
 */
export interface VisualizationLoadInfo {
  lookupResult: VisualizationLookupResult;
  loadStatus: VisualizationLoadStatus;
  matches?: VisualizationInfo[];
  visualization?: VisualizationInfo;
  errorMessage?: string;
}
