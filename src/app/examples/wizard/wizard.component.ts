import {Component, AfterViewInit} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import {NgForm} from '@angular/forms';
import * as Prism from 'prismjs/';
import {CompletedDialogComponent} from './completed-dialog/completed-dialog.component';

@Component({
  selector : 'c-wizard',
  templateUrl : './wizard.component.html',
  styleUrls : ['./wizard.component.scss']
})
export class WizardComponent implements AfterViewInit {
  public firstName: string = '';
  public lastName: string = 'Smith';
  public acceptedTerms: boolean = false;
  private _dialogRef: MdDialogRef<CompletedDialogComponent>;
  public _selectedIndex: number = 0;

  get selectedIndex(): number {
    return this._selectedIndex;
  }

  set selectedIndex(selectedIndex: number) {
    this._selectedIndex = selectedIndex;
  }

  constructor(private _dialog: MdDialog) {
  }

  ngAfterViewInit() {
    Prism.highlightAll(false);
  }

  canFinish(): boolean {
    return this.acceptedTerms;
  }

  submit(form: NgForm): void {
    if(this.canFinish()) {
      this._dialogRef = this._dialog.open(CompletedDialogComponent, {
        disableClose : true
      });
      this._dialogRef.afterClosed().subscribe(() => {
        form.resetForm({
          firstName: '',
          lastName: 'Smith'
        });
        this._selectedIndex = 0;
      });
    }
  }

  canMove(index: number): boolean {
    switch (index) {
      case 0:
        return true;
      case 1:
        return this.firstName.length > 2;
      case 2:
        return this.canMove(1);
      default:
        return true;
    }
  }

  next(): void {
    if(this.canMove(this.selectedIndex + 1)) {
      this.selectedIndex++;
    }
  }

  previous(): void {
    if(this.selectedIndex === 0) {
      return;
    }
    if(this.canMove(this.selectedIndex - 1)) {
      this.selectedIndex--;
    }
  }

}
