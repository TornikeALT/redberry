import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private avatarSource = new BehaviorSubject<string | null>(null);
  avatar$ = this.avatarSource.asObservable();

  constructor() {}

  setAvatar(avatarUrl: string) {
    this.avatarSource.next(avatarUrl);
  }
  clearAvatar() {
    this.avatarSource.next(null);
  }
}
