/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserNotificationPreferenceAdapter } from './user-notification-preference.adapter';
import { NotificationPreference } from '../../../model/notification-preference.model';

@Injectable({
  providedIn: 'root',
})
export class UserNotificationPreferenceConnector {
  constructor(protected adapter: UserNotificationPreferenceAdapter) {}

  loadAll(userId: string): Observable<NotificationPreference[]> {
    return this.adapter.loadAll(userId);
  }

  update(userId: string, preferences: NotificationPreference[]) {
    return this.adapter.update(userId, preferences);
  }
}
