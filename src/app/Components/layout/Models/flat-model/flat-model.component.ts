import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from '../../../../Reusable/shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Flat } from '../../../../Interfaces/flat';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlatService } from '../../../../Services/flat.service';
import { UtilityService } from '../../../../Reusable/utility.service';
import { isEqual } from 'lodash';
@Component({
  selector: 'app-flat-model',
  imports: [SharedModule],
  templateUrl: './flat-model.component.html',
  styleUrl: './flat-model.component.css',
})
export class FlatModelComponent implements OnInit {
  flatForm: FormGroup;
  titleCaption: string = 'Add';
  buttonCaption: string = 'Save';
  initialFormValues: any; // To store the initial state of the form.

  constructor(
    private flatModel: MatDialogRef<FlatModelComponent>,
    @Inject(MAT_DIALOG_DATA) public flatData: Flat,
    private fb: FormBuilder,
    private _flatService: FlatService,
    private _utilityService: UtilityService
  ) {
    this.flatForm = this.fb.group({
      code: ['', Validators.required],

      rent: ['', Validators.required],
    });
    if (this.flatData != null) {
      this.titleCaption = 'Edit';
      this.buttonCaption = 'Update';
    }
  }

  ngOnInit(): void {
    if (this.flatData != null) {
      this.flatForm.patchValue({
        code: this.flatData.code,
        rent: this.flatData.rent,
      });
    }
    this.initialFormValues = this.flatForm.getRawValue();
  }

  saveEditFlat() {
    // Compare current form values with initial values.
    const currentFormValues = this.flatForm.getRawValue();

    if (isEqual(this.initialFormValues, currentFormValues)) {
      this._utilityService.showAlert('No changes detected.', 'Info');
      return;
    }
    const _flat: Flat = {
      id: this.flatData == null ? 0 : this.flatData.id,
      code: this.flatForm.value.code,
      rent: this.flatForm.value.rent,
    };
    if (this.flatData == null) {
      this._flatService.create(_flat).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilityService.showAlert('Flat added successfully', 'Exit');
            this.flatModel.close('true');
          } else this._utilityService.showAlert('Failed to add Flat', 'Error');
        },
        error: (e) => {},
      });
    } else {
      this._flatService.edit(_flat).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilityService.showAlert('Flat successfully edited ', 'Exit');
            this.flatModel.close('true');
          } else this._utilityService.showAlert('Failed to edit Flat', 'Error');
        },
        error: (e) => {},
      });
    }
  }
}
