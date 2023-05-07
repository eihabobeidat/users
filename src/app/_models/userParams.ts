import { AccountService } from '../_services/authentication/account.service';
import { User } from './user';

export class UserParams {
  page: number = 1;
  itemsPerPage: number = 6;
  gender: string;
  minimumAge: number = 18;
  maximumAge: number = 99;
  orderBy: 'lastActive' | 'created' = 'lastActive';

  constructor(user: User) {
    this.gender = user.gender;
  }
}
