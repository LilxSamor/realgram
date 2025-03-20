import { Component, inject } from '@angular/core';
import { CustomUser } from '../shared/model/user';
import { AuthService } from '../services/auth.service';
import { debounceTime, distinctUntilChanged, map, Observable, Subject, switchMap } from 'rxjs';
import {MatTableModule} from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { FormControl } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-search',
  imports: [ MatInputModule, MatTableModule, NgIf ],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.css'
})
export class UserSearchComponent {
  router = inject(Router);
  
  allUsers: CustomUser[] = [];
  filteredUsers: CustomUser[] = [];
  displayedColumns: string[] = ['avatar', 'username'];

  private searchTerms = new Subject<string>();

  constructor(private authService: AuthService) {
    this.getAllUsers();
  }

  redirectToUserProfile(username: string) {
    this.router.navigate(['/account', username]);
  }

  search(term: string): void {
    this.searchTerms.next(term);
    this.searchUser(term);
  }

  searchUser(term: string): CustomUser[] {
    this.filteredUsers = this.allUsers.filter(a => a.username.toLowerCase().includes(term.toLowerCase()));
    return this.filteredUsers;
  }

  getAllUsers(): void {
    this.authService.getAll().snapshotChanges().pipe(
      map(changes => 
        changes.map(c => 
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(users => {
      this.allUsers = users as CustomUser[];
      this.filteredUsers = users as CustomUser[];
    });
  }

  ngOnInit(): void {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.searchUser(term))
    );
  }
}
