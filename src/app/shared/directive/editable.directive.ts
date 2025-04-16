import { Directive, ElementRef, HostListener } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Directive({
  selector: '[appEditable]'
})
export class EditableDirective {
  private isEditing = false;
  private originalText = '';
  private userInput = '';

  constructor(private elementRef: ElementRef, private db: AngularFireDatabase) {
    this.originalText = this.elementRef.nativeElement.textContent;
  }

  @HostListener('dblclick', ['$event'])
  onDoubleClick(event: Event) {
    this.toggleEditMode();
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event) {
    this.toggleEditMode();
  }

  private toggleEditMode() {
    if(this.isEditing) {
      this.saveChanges();
    } else {
      this.isEditing = true;
      this.elementRef.nativeElement.innerHTML = `
        <input
          type="text"
          [(ngModel)]="userInput"
          (ngModelChange)="onInputChange($event)"
          [style.width]="elementRef.nativeElement.offsetWidth + 'px'"
          [style.height]="elementRef.nativeElement.offsetHeight + 'px'"
          [style.fontFamily]="elementRef.nativeElement.style.fontFamily"
          [style.fontSize]="elementRef.nativeElement.style.fontSize"
          [style.lineHeight]="elementRef.nativeElement.style.lineHeight"
          [style.textAlign]="elementRef.nativeElement.style.textAlign"
        >
      `;
    }
  }

  private saveChanges() {
    /*this.isEditing = false;
    this.elementRef.nativeElement.innerHTML = this.userInput;
    // Save the user's input to the Firebase Realtime Database
    this.db.database.ref(`users/${this.currentUser.uid}`).update({
      description: this.userInput,
    });*/
  }

  private onInputChange(event: any) {
    this.userInput = event.target.value;
  }

}
