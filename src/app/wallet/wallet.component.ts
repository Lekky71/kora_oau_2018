import { Component, OnInit } from '@angular/core';
import {Savings} from '../models/savings';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  savings: Savings[] = [];
  constructor() { }

  ngOnInit() {
  }

  addSavings(data: Savings) {
    this.savings.push(data);
  }

}
