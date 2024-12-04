import { ChangeDetectorRef, Component } from '@angular/core';
import { SharedModule } from '../../../../Reusable/shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Wmeter } from '../../../../Interfaces/wmeter';
import { Wreading } from '../../../../Interfaces/wreading';
import { UtilityService } from '../../../../Reusable/utility.service';
import { WmeterService } from '../../../../Services/wmeter.service';
import { WreadingService } from '../../../../Services/wreading.service';
import moment from 'moment';
import Swal from 'sweetalert2';
import { WreadingModelComponent } from '../../Models/wreading-model/wreading-model.component';

export const DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-wreading',
  imports: [SharedModule],
  templateUrl: './wreading.component.html',
  styleUrl: './wreading.component.css',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: DATA_FORMATS }],
})
export class WreadingComponent {
  readingForm: FormGroup;
  // readingList: Ereading[] = [];
  meterList: Wmeter[] = [];
  tableColumns: string[] = [
    'wmeterNumber',
    'startDate',
    'endDate',
    'previousReading',
    'currentReading',
    'action',
  ];
  initialData: Wreading[] = [];
  readingData = new MatTableDataSource(this.initialData);

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _readingService: WreadingService,
    private _meterService: WmeterService,
    private _utilityService: UtilityService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.readingForm = this.fb.group({
      meterId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
    this._meterService.list().subscribe({
      next: (data) => {
        if (data.status) {
          this.meterList = data.value;
        }
      },
      error: (e) => {},
    });
  }

  searchReadings() {
    let _startDate = moment(this.readingForm.value.startDate).format(
      'DD/MM/YYYY'
    );
    let _endDate = moment(this.readingForm.value.endDate).format('DD/MM/YYYY');

    if (_startDate === 'Invalid date' || _endDate === 'Invalid date') {
      this._utilityService.showAlert('Must enter both dates', 'Oops!');
      return;
    }
    this._readingService
      .load(this.readingForm.value.meterId, _startDate, _endDate)
      .subscribe({
        next: (data) => {
          //   console.log('API Response:', data);
          if (data.status) {
            this.initialData = data.value;
            //    this.readingData.data = data.value;
            /*  const result = Array.isArray(data.value)
              ? data.value
              : [data.value];
            this.readingData.data = result;
            console.log('Table Data:', this.readingData.data);*/
            const result = [data.value];
            this.readingData.data = result;
            this.changeDetectorRef.detectChanges();
          } else this._utilityService.showAlert('No reading found', 'Oops!');
        },
        error: (e) => {},
      });
  }

  newReading(reading: Wreading) {
    this._readingService.loadLastReading(reading.wmeterId).subscribe({
      next: (result) => {
        if (result.status)
          this.dialog
            .open(WreadingModelComponent, {
              disableClose: true,

              data: {
                wmeterNumber: reading.wmeterNumber,
                previousReading: result.value.currentReading,
                wmeterId: reading.wmeterId,
                id: 0,
              },
            })
            .afterClosed()
            .subscribe((result) => {
              if (result === 'true') this.searchReadings();
            });
      },
    });
  }
  editReading(reading: Wreading) {
    this.dialog
      .open(WreadingModelComponent, {
        disableClose: true,
        data: reading,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'true') this.searchReadings();
      });
  }
  deleteReading(reading: Wreading) {
    Swal.fire({
      title: 'Do you want to delete reading?',
      text: reading.wmeterNumber,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, return',
    }).then((result) => {
      if (result.isConfirmed) {
        this._readingService.delete(reading.id).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilityService.showAlert(
                'The reading succesfully deleted',
                '!'
              );
              this.searchReadings();
            } else
              this._utilityService.showAlert(
                'Could not delete product',
                'Error'
              );
          },
          error: (e) => {},
        });
      }
    });
  }
}
