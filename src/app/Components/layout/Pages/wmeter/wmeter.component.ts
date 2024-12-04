import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../Reusable/shared/shared.module';
import { Wmeter } from '../../../../Interfaces/wmeter';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { WmeterService } from '../../../../Services/wmeter.service';
import { UtilityService } from '../../../../Reusable/utility.service';
import { WmeterModelComponent } from '../../Models/wmeter-model/wmeter-model.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wmeter',
  imports: [SharedModule],
  templateUrl: './wmeter.component.html',
  styleUrl: './wmeter.component.css',
})
export class WmeterComponent implements OnInit, AfterViewInit {
  tableColumns: string[] = ['meterNumber', 'flatCode', 'isActive', 'action'];
  initialData: Wmeter[] = [];
  meterDataList = new MatTableDataSource(this.initialData);
  @ViewChild(MatPaginator) paginationTable!: MatPaginator;
  constructor(
    private dialog: MatDialog,
    private _meterService: WmeterService,
    private _utilityService: UtilityService
  ) {}

  getMeters() {
    this._meterService.list().subscribe({
      next: (data) => {
        if (data.status) this.meterDataList.data = data.value;
        else this._utilityService.showAlert('No meter found', 'Oops');
      },
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
    this.meterDataList.filter = filterValue.trim().toLocaleLowerCase();
  }

  newMeter() {
    this.dialog
      .open(WmeterModelComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'true') this.getMeters();
      });
  }

  editMeter(meter: Wmeter) {
    this.dialog
      .open(WmeterModelComponent, {
        disableClose: true,
        data: meter,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'true') this.getMeters();
      });
  }
  deleteMeter(meter: Wmeter) {
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
