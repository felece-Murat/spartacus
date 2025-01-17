/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Observable } from 'rxjs';
import { NotificationPreference } from '../../../model/notification-preference.model';

export abstract class UserNotificationPreferenceAdapter {
  /**
   * Abstract method used to load notification preferences for an user.
   *
   * @param userId The `userId` for given user
   */
  abstract loadAll(userId: string): Observable<NotificationPreference[]>;

  /**
   * Abstract method used to update notification preferences for an user.
   *
   * @param userId The `userId` for given user
   * @param preferences The notification preferences to be updated.
   */
  abstract update(
    userId: string,
    preferences: NotificationPreference[]
  ): Observable<{}>;
}
