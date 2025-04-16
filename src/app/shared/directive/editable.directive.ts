import { Directive, ElementRef, HostListener, inject, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { CustomUser } from '../model/user';
import { Auth } from '@angular/fire/auth';

@Directive({
  selector: '[appEditable]'
})
export class EditableDirective {
  auth = inject(Auth);

  private isEditing = false;
  private originalText = '';
  private userInput = '';
  private uid = '';

  constructor(private elementRef: ElementRef, private db: AngularFireDatabase) {
    this.originalText = this.elementRef.nativeElement.textContent || '';
    this.userInput = this.originalText;
    this.uid = this.auth.currentUser!.uid;
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    this.toggleEditMode();
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event) {
    this.toggleEditMode();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.isEditing && event.key === 'Enter') {
      this.saveChanges();
    }
  }

  private toggleEditMode() {
    const element = this.elementRef.nativeElement;

    if(this.isEditing) {
      this.saveChanges();
    } else {
      this.isEditing = true;

      const input = document.createElement('input');
      input.type = 'text';
      input.value = this.userInput;

      const computedStyle = window.getComputedStyle(element);
      input.style.width = element.offsetWidth + 'px';
      input.style.height = computedStyle.height;
      input.style.fontFamily = computedStyle.fontFamily;
      input.style.fontSize = computedStyle.fontSize;
      input.style.lineHeight = computedStyle.lineHeight;
      input.style.textAlign = computedStyle.textAlign;
      input.style.border = 'none';
      input.style.background = 'transparent';
      input.style.outline = 'none';

      input.addEventListener('input', (e) => {
        this.userInput = (e.target as HTMLInputElement).value;
      });

      element.innerHTML = '';
      element.appendChild(input);
      input.focus();
    }
  }

  private saveChanges() {
    this.isEditing = false;
    this.elementRef.nativeElement.innerHTML = this.userInput;
    this.db.database.ref(`users/${this.uid}`).update({
      description: this.userInput,
    });
  }

}
