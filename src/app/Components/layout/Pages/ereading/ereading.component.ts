import {
  AfterViewInit,
  Component,
  ViewChild,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import moment from 'moment';

import { MatTableDataSource } from '@angular/material/table';
//import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from '../../../../Reusable/utility.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { SharedModule } from '../../../../Reusable/shared/shared.module';
import { Ereading } from '../../../../Interfaces/ereading';
import { MatDialog } from '@angular/material/dialog';
import { EreadingService } from '../../../../Services/ereading.service';
import { EmeterService } from '../../../../Services/emeter.service';
import { Emeter } from '../../../../Interfaces/emeter';
import { EreadingModelComponent } from '../../Models/ereading-model/ereading-model.component';
import Swal from 'sweetalert2';

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
  selector: 'app-ereading',
  imports: [SharedModule],
  templateUrl: './ereading.component.html',
  styleUrl: './ereading.component.css',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: DATA_FORMATS }],
})
export class EreadingComponent implements OnInit {
  readingForm: FormGroup;
  // readingList: Ereading[] = [];
  meterList: Emeter[] = [];
  tableColumns: string[] = [
    'emeterNumber',
    'startDate',
    'endDate',
    'previousReading',
    'currentReading',
    'action',
  ];
  initialData: Ereading[] = [];
  readingData = new MatTableDataSource(this.initialData);

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _readingService: EreadingService,
    private _meterService: EmeterService,
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
    /*this.readingForm.get('emeterNumber')?.valueChanges.subscribe((value) => {
      this.readingForm.patchValue({
        meterId: '',
        startDate: '',
        endDate: '',
      });
    });*/
  }
  ngOnInit(): void {}

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
  newReading(reading: Ereading) {
    this._readingService.loadLastReading(reading.emeterId).subscribe({
      next: (result) => {
        if (result.status)
          this.dialog
            .open(EreadingModelComponent, {
              disableClose: true,
              width: '400px',
              data: {
                emeterNumber: reading.emeterNumber,
                previousReading: result.value.currentReading,
                emeterId: reading.emeterId,
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
  editReading(reading: Ereading) {
    this.dialog
      .open(EreadingModelComponent, {
        disableClose: true,
        width: '400px',
        data: reading,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'true') this.searchReadings();
      });
  }
  deleteReading(reading: Ereading) {
    Swal.fire({
      title: 'Do you want to delete reading?',
      text: reading.emeterNumber,
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
