import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Login',
    pathMatch: 'full'
  },
  {
    path: 'Login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'report',
    loadChildren: () => import('./pages/report/report.module').then( m => m.ReportPageModule)
  },
  {
    path: 'report-aliado',
    loadChildren: () => import('./pages/report-aliado/report-aliado.module').then( m => m.ReportAliadoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
