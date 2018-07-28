import { BrowserModule } from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { WalletComponent } from './wallet/wallet.component';
import { BudgetComponent } from './budget/budget.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import {AuthService} from './services/auth.service';
import {BudgetService} from './services/budget.service';
import {WalletService} from './services/wallet.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component';
import { AddBillingComponent } from './add-billing/add-billing.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'wallet', component: WalletComponent },
  { path: 'expenses', component: BudgetComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'add-billing', component: AddBillingComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    WalletComponent,
    BudgetComponent,
    SignupComponent,
    LoginComponent,
    DashboardComponent,
    TransactionsComponent,
    AddBillingComponent,
    SidebarComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthService,
    BudgetService,
    WalletService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
