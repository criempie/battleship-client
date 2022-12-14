import {
  Component,
  Input,
  Output,
  HostBinding,
  HostListener,
  EventEmitter,
} from '@angular/core';
import { Cell, CellState, Coordinates } from '@battleship/common';
import { LobbyPlayService } from '../../services/lobby-play.service';

@Component({
  selector: 'lobby-play-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css'],
})
export class FieldComponent {
  public readonly size = 10;

  @Input()
  public cells: Cell[][] = [];

  @Output()
  public fire = new EventEmitter<Coordinates>();

  @HostBinding('style.grid-template-columns')
  private _gridTemplateColumns = `repeat(${this.size}, 1fr)`;

  @HostListener('click', ['$event.target'])
  private _clickHandler(element: HTMLElement) {
    if (element.tagName.toLocaleLowerCase() === 'field-cell') {
      const [x, y] = [element.dataset['x'], element.dataset['y']];

      if (!x || !y) return;

      this._hitCell(+x, +y);
    }
  }

  constructor() {}

  private _hitCell(x: number, y: number) {
    this.fire.emit({ x, y });
  }
}
