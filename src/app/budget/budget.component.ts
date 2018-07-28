import { Component, OnInit } from '@angular/core';
import {BudgetService} from '../services/budget.service';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {

  constructor(private budgetService: BudgetService) { }

  ngOnInit() {
  }

  addTransaction(data) {
    this.budgetService.addSpending(data)
      .subscribe( res => {
        if (res) {
          console.log('successfull');
        } else {
          console.log('fail');
        }
      });
  }

}
