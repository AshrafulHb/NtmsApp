import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../Reusable/shared/shared.module';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Emeter } from '../../../../Interfaces/emeter';
import { UtilityService } from '../../../../Reusable/utility.service';
import { EmeterService } from '../../../../Services/emeter.service';
import { EmeterModelComponent } from '../../Models/emeter-model/emeter-model.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-emeter',
  imports: [SharedModule, MatCheckboxModule],
  templateUrl: './emeter.component.html',
  styleUrl: './emeter.component.css',
})
export class EmeterComponent implements OnInit, AfterViewInit {
  tableColumns: string[] = [
    'meterNumber',
    'flatDescription',
    'isActive',
    'action',
  ];
  initialData: Emeter[] = [];
  meterDataList = new MatTableDataSource(this.initialData);
  showOnlyActive: boolean = false;
  @ViewChild(MatPaginator) paginationTable!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _meterService: EmeterService,
    private _utilityService: UtilityService
  ) {}

  getMeters() {
    this._meterService.list().subscribe({
      next: (data) => {
        if (data.status) {
          this.initialData = data.value;
          this.applyActiveFilter();
        } //this.meterDataList.data = data.value;
        else this._utilityService.showAlert('No meter found', 'Oops');
      },
      error: (e) => {},
    });
  }
  ngOnInit(): void {
    this.getMeters();
  }
  ngAfterViewInit(): void {
    this.meterDataList.paginator = this.paginationTable;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.meterDataList.filter = filterValue.trim().toLocaleLowerCase();
    this.meterDataList.filter = filterValue;
    this.meterDataList.filterPredicate = (emeter: Emeter, filter: string) => {
      const matchesFilter = emeter.meterNumber
        .toLocaleLowerCase()
        .includes(filter);
      const isActiveMatch = this.showOnlyActive ? emeter.isActive === 1 : true;
      return matchesFilter && isActiveMatch;
    };
  }

  toggleActiveFilter(showOnlyActive: boolean) {
    this.showOnlyActive = showOnlyActive;
    this.applyActiveFilter();
  }

  applyActiveFilter() {
    const filteredData = this.showOnlyActive
      ? this.initialData.filter((emeter) => emeter.isActive === 1)
      : this.initialData;
    this.meterDataList.data = filteredData;
  }

  newMeter() {
    this.dialog
      .open(EmeterModelComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'true') this.getMeters();
      });
  }

  editMeter(meter: Emeter) {
    this.dialog
      .open(EmeterModelComponent, {
        disableClose: true,
        data: meter,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'true') this.getMeters();
      });
  }
  deleteMeter(meter: Emeter) {
    Swal.fire({
      title: 'Do you want to delete meter?',
      text: meter.meterNumber,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, return',
    }).then((result) => {
      if (result.isConfirmed) {
        this._meterService.delete(meter.id).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilityService.showAlert(
                'The meter succesfully deleted',
                '!'
              );
              this.getMeters();
            } else
              this._utilityService.showAlert('Failed to delete meter', 'Error');
          },
          error: (e) => {},
        });
      }
    });
  }
}
