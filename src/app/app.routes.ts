import { Routes } from '@angular/router';
import { LayoutComponent } from './Components/layout/layout.component';
import { TenantComponent } from './Components/layout/Pages/tenant/tenant.component';
import { FlatComponent } from './Components/layout/Pages/flat/flat.component';
import { EmeterComponent } from './Components/layout/Pages/emeter/emeter.component';
import { EreadingComponent } from './Components/layout/Pages/ereading/ereading.component';
import { ReportComponent } from './Components/layout/Pages/report/report.component';

export const routes: Routes = [
  { path: '', component: LayoutComponent, pathMatch: 'full' },
  { path: 'layout', component: LayoutComponent, pathMatch: 'full' },
  {
    path: 'pages',
    component: LayoutComponent,
    children: [
      { path: 'tenant', component: TenantComponent },
      { path: 'flat', component: FlatComponent },
      { path: 'emeter', component: EmeterComponent },
      { path: 'ereading', component: EreadingComponent },
      { path: 'report', component: ReportComponent },
    ],
  },
  { path: '**', redirectTo: 'layout', pathMatch: 'full' },
];
