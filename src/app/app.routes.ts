import { Routes } from '@angular/router';
import { LayoutComponent } from './Components/layout/layout.component';
import { TenantComponent } from './Components/layout/Pages/tenant/tenant.component';
import { FlatComponent } from './Components/layout/Pages/flat/flat.component';
import { EmeterComponent } from './Components/layout/Pages/emeter/emeter.component';
import { EreadingComponent } from './Components/layout/Pages/ereading/ereading.component';
import { ReportComponent } from './Components/layout/Pages/report/report.component';
import { WmeterComponent } from './Components/layout/Pages/wmeter/wmeter.component';
import { WreadingComponent } from './Components/layout/Pages/wreading/wreading.component';
import { ErulesComponent } from './Components/layout/Pages/erules/erules.component';
import { WrulesComponent } from './Components/layout/Pages/wrules/wrules.component';

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
      { path: 'wmeter', component: WmeterComponent },
      { path: 'wreading', component: WreadingComponent },
      { path: 'report', component: ReportComponent },
      { path: 'erules', component: ErulesComponent },
      { path: 'wrules', component: WrulesComponent },
    ],
  },
  { path: '**', redirectTo: 'layout', pathMatch: 'full' },
];
