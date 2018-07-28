import { Component, OnInit } from '@angular/core';
import {BudgetService} from '../services/budget.service';
import {AllSpendings} from '../models/allSpendings';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {
  spendings: AllSpendings[] = [];
  constructor(private budgetService: BudgetService, private auth: AuthService) { }

  ngOnInit() {
    // const user_id = this.auth.getUserId();
    // this.budgetService.getSpending(user_id)
    //   .subscribe(res => {
    //     this.spendins = res;
    //   });
  }

  addTransaction(data: AllSpendings) {
    console.log(data);
    this.spendings.push(data);
    // this.budgetService.addSpending(data)
    //   .subscribe( res => {
    //     if (res) {
    //       console.log('successfull');
    //     } else {
    //       console.log('fail');
    //     }
    //   });
  }

}
