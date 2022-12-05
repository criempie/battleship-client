import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

export type CellStates = 'clear' | 'hit' | 'miss' | 'ship';

export interface Cell {
  x: number;
  y: number;
  state: CellStates;
}

@Component({
  selector: 'field-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellComponent {
  @HostBinding('attr.data-x')
  @Input()
  public x!: number;

  @HostBinding('attr.data-y')
  @Input()
  public y!: number;

  @Input()
  public state: CellStates = 'clear';

  constructor() {}

  @HostBinding(`class.cell_clear`) private get _isClearState() {
    return this.state === 'clear';
  }

  @HostBinding(`class.cell_hit`) private get _isHitState() {
    return this.state === 'hit';
  }

  @HostBinding(`class.cell_miss`) private get _isMissState() {
    return this.state === 'miss';
  }

  @HostBinding(`class.cell_ship`) private get _isShipState() {
    return this.state === 'ship';
  }
}
