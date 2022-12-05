import { Component, HostBinding, HostListener } from '@angular/core';
import { Cell } from 'src/app/components/cell/cell.component';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css'],
})
export class FieldComponent {
  public readonly size = 10;
  public cells: Cell[][];

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

  constructor() {
    this.cells = Array(this.size)
      .fill(null)
      .map((_, x) =>
        Array(this.size)
          .fill(null)
          .map((_, y) => ({ x, y, state: 'clear' }))
      );
  }

  private _hitCell(x: number, y: number) {
    this.cells[x][y].state = 'hit';
  }
}
