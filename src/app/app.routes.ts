import { Routes } from '@angular/router';
import { ProductsComponent } from '../components/products/products.component';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { ProductDetailComponent } from '../components/product-detail/product-detail.component';
import { LoginGuard } from '../guard/login.guard';
import { CheckoutComponent } from '../components/checkout/checkout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LoginGuard] },
];
