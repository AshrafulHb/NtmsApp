import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from '../../../../Reusable/shared/shared.module';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Wreading } from '../../../../Interfaces/wreading';
import { WreadingService } from '../../../../Services/wreading.service';
import { UtilityService } from '../../../../Reusable/utility.service';
import { isEqual } from 'lodash';

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
  selector: 'app-wreading-model',
  imports: [SharedModule],
  templateUrl: './wreading-model.component.html',
  styleUrl: './wreading-model.component.css',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: DATA_FORMATS }],
})
export class WreadingModelComponent implements OnInit {
  readingForm: FormGroup;
  updateTitle: string = 'Add';
  updateButton: string = 'Save';
  initialFormValues: any; // To store the initial state of the form.

  constructor(
    private dialog: MatDialogRef<WreadingModelComponent>,
    @Inject(MAT_DIALOG_DATA) public readingData: Wreading,
    private fb: FormBuilder,
    private _wReadingService: WreadingService,
    private _utilityService: UtilityService
  ) {
    this.readingForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      previousReading: [readingData.previousReading, Validators.required],
      currentReading: ['', Validators.required],
      wmeterNumber: [readingData.wmeterNumber, Validators.required],
    });
    if (readingData.id > 0) {
      this.updateTitle = 'Edit';
      this.updateButton = 'Update';
    }
  }
  ngOnInit(): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    if (this.readingData == null || this.readingData.id == 0) {
      // New record - set default startDate and endDate
      this.readingForm.patchValue({
        startDate: startOfMonth,
        endDate: endOfMonth,
      });
    } else {
      // Existing record - parse startDate and endDate
      const startDate = this.parseDateString(this.readingData.startDate);
      const endDate = this.parseDateString(this.readingData.endDate);
      this.readingForm.patchValue({
        startDate: startDate,
        endDate: endDate,
        previousReading: this.readingData.previousReading,
        currentReading: this.readingData.currentReading,
        wmeterNumber: this.readingData.wmeterNumber,
      });
    }
    this.initialFormValues = this.readingForm.getRawValue();
  }
  // Helper function to parse 'dd/MM/yyyy' format to Date object
  parseDateString(dateStr: string): Date | null {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  saveEditReadings() {
    // Compare current form values with initial values.
    const currentFormValues = this.readingForm.getRawValue();

    if (isEqual(this.initialFormValues, currentFormValues)) {
      this._utilityService.showAlert('No changes detected.', 'Info');
      return;
    }
    const _reading: Wreading = {
      id: this.readingData == null ? 0 : this.readingData.id,
      startDate: this.readingForm.value.startDate,
      endDate: this.readingForm.value.endDate,
      previousReading: this.readingForm.value.previousReading,
      currentReading: this.readingForm.value.currentReading,
      wmeterNumber: this.readingForm.value.wmeterNumber,
      // emeterId:this.readingForm.value.emeterId
      wmeterId: this.readingData.wmeterId,
    };
    if (
      _reading.startDate == _reading.endDate ||
      _reading.startDate > _reading.endDate
    ) {
      this._utilityService.showAlert(
        'End date must be later than start date!',
        'Error'
      );
    }
    if (_reading.currentReading < _reading.previousReading) {
      this._utilityService.showAlert(
        'Current reading cand be less than previous reading!',
        'Error'
      );
    } else if (this.readingData.id == 0) {
      this._wReadingService.create(_reading).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilityService.showAlert('Reading successfully added', '');
            this.dialog.close('true');
          } else
            this._utilityService.showAlert('Failed to add reading', 'Oops!');
        },
        error: (e) => {},
      });
    } else {
      this._wReadingService.edit(_reading).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilityService.showAlert('Readind successfully edited', '');
            this.dialog.close('true');
          } else
            this._utilityService.showAlert('Failed to edit reading', 'Error');
        },
        error: (e) => {},
      });
    }
  }
}
