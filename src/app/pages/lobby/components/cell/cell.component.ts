import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { CellState, Cell } from '@battleship/common';

@Component({
  selector: 'field-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellComponent extends Cell {
  @HostBinding('attr.data-x')
  @Input()
  public x!: number;

  @HostBinding('attr.data-y')
  @Input()
  public y!: number;

  @Input()
  public override state = super.state;

  constructor() {
    super();
  }

  @HostBinding(`class.cell_clear`) private get _isClearState() {
    return this.state === CellState.clear;
  }

  @HostBinding(`class.cell_hit`) private get _isHitState() {
    return this.state === CellState.hit;
  }

  @HostBinding(`class.cell_miss`) private get _isMissState() {
    return this.state === CellState.miss;
  }

  @HostBinding(`class.cell_ship`) private get _isShipState() {
    return this.state === CellState.ship;
  }
}
