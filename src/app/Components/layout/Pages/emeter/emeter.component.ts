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

@Component({
    selector: 'app-emeter',
    imports: [SharedModule],
    templateUrl: './emeter.component.html',
    styleUrl: './emeter.component.css'
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
  @ViewChild(MatPaginator) paginationTable!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _meterService: EmeterService,
    private _utilityService: UtilityService
  ) {}

  getMeters() {
    this._meterService.list().subscribe({
      next: (data) => {
        if (data.status) this.meterDataList.data = data.value;
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
    this.meterDataList.filter = filterValue.trim().toLocaleLowerCase();
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
