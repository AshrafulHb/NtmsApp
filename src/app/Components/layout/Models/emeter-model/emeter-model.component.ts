import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from '../../../../Reusable/shared/shared.module';
import { Emeter } from '../../../../Interfaces/emeter';
import { EmeterService } from '../../../../Services/emeter.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilityService } from '../../../../Reusable/utility.service';
import { FlatService } from '../../../../Services/flat.service';
import { Flat } from '../../../../Interfaces/flat';
import { isEqual } from 'lodash';

@Component({
  selector: 'app-emeter-model',
  imports: [SharedModule],
  templateUrl: './emeter-model.component.html',
  styleUrl: './emeter-model.component.css',
})
export class EmeterModelComponent implements OnInit {
  meterForm: FormGroup;
  titleCaption: string = 'Add';
  buttonCaption: string = 'Save';
  initialFormValues: any; // To store the initial state of the form.

  flatList: Flat[] = [];

  constructor(
    private meterModel: MatDialogRef<EmeterModelComponent>,
    @Inject(MAT_DIALOG_DATA) public meterData: Emeter,
    private fb: FormBuilder,
    private _flatService: FlatService,
    private _meterService: EmeterService,
    private _utilityService: UtilityService
  ) {
    this.meterForm = this.fb.group({
      meterNumber: ['', Validators.required],
      isActive: ['1', Validators.required],
      flatId: [''],
      flatDescription: [''],
    });
    if (this.meterData != null) {
      this.titleCaption = 'Edit';
      this.buttonCaption = 'Update';
    }
    this._flatService.list().subscribe({
      next: (data) => {
        if (data.status) this.flatList = data.value;
      },
      error: (e) => {},
    });
  }

  ngOnInit(): void {
    if (this.meterData != null) {
      this.meterForm.patchValue({
        meterNumber: this.meterData.meterNumber,
        isActive: this.meterData.isActive.toString(),
        flatId: this.meterData.flatId,
        flatDescription: this.meterData.flatDescription,
      });
    }
    this.initialFormValues = this.meterForm.getRawValue();
  }
  saveEditMeter() {
    // Compare current form values with initial values.
    const currentFormValues = this.meterForm.getRawValue();

    if (isEqual(this.initialFormValues, currentFormValues)) {
      this._utilityService.showAlert('No changes detected.', 'Info');
      return;
    }
    const _meter: Emeter = {
      id: this.meterData == null ? 0 : this.meterData.id,
      meterNumber: this.meterForm.value.meterNumber,

      isActive: parseInt(this.meterForm.value.isActive),
      flatId: this.meterForm.value.flatId,
      flatDescription: '',
    };
    if (this.meterData == null) {
      this._meterService.create(_meter).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilityService.showAlert('Meter added successfully', 'Exit');
            this.meterModel.close('true');
          } else this._utilityService.showAlert('Failed to add Meter', 'Error');
        },
        error: (e) => {},
      });
    } else {
      this._meterService.edit(_meter).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilityService.showAlert(
              'Meter successfully edited ',
              'Exit'
            );
            this.meterModel.close('true');
          } else
            this._utilityService.showAlert('Failed to edit Meter', 'Error');
        },
        error: (e) => {},
      });
    }
  }
}