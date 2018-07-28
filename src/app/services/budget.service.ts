import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {SignupResponse} from '../models/signup_res';
import {TransactionResponse} from '../models/transaction_res';
import {AllSpendings} from '../models/allSpendings';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  urls = {
    add: '/api/transactions/add-spending',
    all: '/api/transactions/get-spendings'
  };
  constructor(private http: HttpClient) { }

  addSpending(data) {
    return this.http.post<TransactionResponse>(this.urls.add, data).pipe(
      map(res => {
        if (res.status === 'success') {
          return true;
        }
        return false;
      }));
  }

  getSpending(userId) {
    return this.http.post<AllSpendings[]>(this.urls.all, userId).pipe(
      map(res => {
        return res;
      })
    );
  }
}
