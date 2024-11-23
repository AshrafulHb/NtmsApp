import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Ereading } from '../../../../Interfaces/ereading';
import { EreadingService } from '../../../../Services/ereading.service';
import { UtilityService } from '../../../../Reusable/utility.service';
import { SharedModule } from '../../../../Reusable/shared/shared.module';
import { MAT_DATE_FORMATS } from '@angular/material/core';
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
  selector: 'app-ereading-model',
  imports: [SharedModule],
  templateUrl: './ereading-model.component.html',
  styleUrl: './ereading-model.component.css',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: DATA_FORMATS }],
})
export class EreadingModelComponent implements OnInit {
  readingForm: FormGroup;
  updateTitle: string = 'Add';
  updateButton: string = 'Save';
  initialFormValues: any; // To store the initial state of the form.

  constructor(
    private dialog: MatDialogRef<EreadingModelComponent>,
    @Inject(MAT_DIALOG_DATA) public readingData: Ereading,
    private fb: FormBuilder,
    private _eReadingService: EreadingService,
    private _utilityService: UtilityService
  ) {
    this.readingForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      previousReading: [readingData.previousReading, Validators.required],
      currentReading: ['', Validators.required],
      emeterNumber: [readingData.emeterNumber, Validators.required],
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
        emeterNumber: this.readingData.emeterNumber,
      });
    }
    // Store the initial form values for comparison.
    this.initialFormValues = this.readingForm.getRawValue();
  }

  /* ngOnInit(): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    if (this.readingData == null || this.readingData.id == 0) {
      this.readingForm.patchValue({
        startDate: startOfMonth,
        endDate: endOfMonth,
      });
    } else {
      // If readingData is provided, use its values
      this.readingForm.patchValue({
        startDate: this.readingData.startDate ?? startOfMonth,
        endDate: this.readingData.endDate ?? endOfMonth,
        previousReading: this.readingData.previousReading,
        currentReading: this.readingData.currentReading,
        emeterNumber: this.readingData.emeterNumber,
      });
    }
      if (this.readingData != null) {
      this.readingForm.patchValue({
        startDate: this.readingData.startDate,
        endDate: this.readingData.endDate,
        previousReading: this.readingData.previousReading,
        currentReading: this.readingData.currentReading,
        emeterNumber: this.readingData.emeterNumber,
      });
      console.log(this.readingForm.value.endDate);
    }
  }*/

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
    const _reading: Ereading = {
      id: this.readingData == null ? 0 : this.readingData.id,
      startDate: this.readingForm.value.startDate,
      endDate: this.readingForm.value.endDate,
      previousReading: this.readingForm.value.previousReading,
      currentReading: this.readingForm.value.currentReading,
      emeterNumber: this.readingForm.value.emeterNumber,
      // emeterId:this.readingForm.value.emeterId
      emeterId: this.readingData.emeterId,
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
      this._eReadingService.create(_reading).subscribe({
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
      this._eReadingService.edit(_reading).subscribe({
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
