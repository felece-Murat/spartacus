import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { OrderEntry } from '@spartacus/core';

/**
 * @deprecated since 4.1 - use cart lib instead
 */
@Component({
  selector: 'cx-wish-list-item',
  templateUrl: './wish-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishListItemComponent {
  @Input()
  isLoading = false;
  @Input() cartEntry: OrderEntry;

  @Output()
  remove = new EventEmitter<OrderEntry>();

  removeEntry(item: OrderEntry) {
    this.remove.emit(item);
  }
}
