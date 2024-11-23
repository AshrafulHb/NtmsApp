import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../Reusable/shared/shared.module';
import Swal from 'sweetalert2';
import { Tenant } from '../../../../Interfaces/tenant';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { TenantService } from '../../../../Services/tenant.service';
import { UtilityService } from '../../../../Reusable/utility.service';
import { TenantModelComponent } from '../../Models/tenant-model/tenant-model.component';

@Component({
    selector: 'app-tenant',
    imports: [SharedModule],
    templateUrl: './tenant.component.html',
    styleUrl: './tenant.component.css'
})
export class TenantComponent implements OnInit, AfterViewInit {
  tableColumns: string[] = [
    'name',
    'occupation',
    'paddress',
    'telephone',
    'startDate',
    'flatDescription',
    'isActive',

    'action',
  ];
  initialData: Tenant[] = [];
  tenantDataList = new MatTableDataSource(this.initialData);
  @ViewChild(MatPaginator) paginationTable!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _tenantservice: TenantService,
    private _utilityService: UtilityService
  ) {}

  getTenants() {
    this._tenantservice.list().subscribe({
      next: (data) => {
        if (data.status) this.tenantDataList.data = data.value;
        else this._utilityService.showAlert('No tenant found', 'Oops');
      },
      error: (e) => {},
    });
  }
  ngOnInit(): void {
    this.getTenants();
  }
  ngAfterViewInit(): void {
    this.tenantDataList.paginator = this.paginationTable;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tenantDataList.filter = filterValue.trim().toLocaleLowerCase();
  }

  newTenant() {
    this.dialog
      .open(TenantModelComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'true') this.getTenants();
      });
  }

  editTenant(tenant: Tenant) {
    this.dialog
      .open(TenantModelComponent, {
        disableClose: true,
        data: tenant,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'true') this.getTenants();
      });
  }
  deleteTenant(tenant: Tenant) {
    Swal.fire({
      title: 'Do you want to delete tenant?',
      text: tenant.name,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, return',
    }).then((result) => {
      if (result.isConfirmed) {
        this._tenantservice.delete(tenant.id).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilityService.showAlert(
                'The tenant succesfully deleted',
                '!'
              );
              this.getTenants();
            } else
              this._utilityService.showAlert('Failed delete tenant', 'Error');
          },
          error: (e) => {},
        });
      }
    });
  }
}
