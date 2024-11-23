import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from '../../../../Reusable/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Flat } from '../../../../Interfaces/flat';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlatService } from '../../../../Services/flat.service';
import { TenantService } from '../../../../Services/tenant.service';
import { UtilityService } from '../../../../Reusable/utility.service';
import { Tenant } from '../../../../Interfaces/tenant';
import { isEqual } from 'lodash';

@Component({
  selector: 'app-tenant-model',
  imports: [SharedModule],
  templateUrl: './tenant-model.component.html',
  styleUrl: './tenant-model.component.css',
})
export class TenantModelComponent implements OnInit {
  tenantForm: FormGroup;
  titleCaption: string = 'Add';
  buttonCaption: string = 'Save';
  initialFormValues: any; // To store the initial state of the form.

  flatList: Flat[] = [];
  constructor(
    private tenantModel: MatDialogRef<TenantModelComponent>,
    @Inject(MAT_DIALOG_DATA) public tenantData: Tenant,
    private fb: FormBuilder,
    private _flatService: FlatService,
    private _tenantService: TenantService,
    private _utilityService: UtilityService
  ) {
    this.tenantForm = this.fb.group({
      name: ['', Validators.required],
      occupation: ['', Validators.required],
      paddress: ['', Validators.required],
      telephone: ['', Validators.required],
      startDate: ['', Validators.required],
      isActive: ['1', Validators.required],
      flatId: ['', Validators.required],
    });
    if (this.tenantData != null) {
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
    if (this.tenantData != null) {
      this.tenantForm.patchValue({
        name: this.tenantData.name,
        occupation: this.tenantData.occupation,
        paddress: this.tenantData.paddress,
        telephone: this.tenantData.telephone,
        startDate: this.tenantData.startDate,
        isActive: this.tenantData.isActive.toString(),
        flatId: this.tenantData.flatId,
      });
    }
    this.initialFormValues = this.tenantForm.getRawValue();
  }

  saveEditTenant() {
    // Compare current form values with initial values.
    const currentFormValues = this.tenantForm.getRawValue();

    if (isEqual(this.initialFormValues, currentFormValues)) {
      this._utilityService.showAlert('No changes detected.', 'Info');
      return;
    }
    const _tenant: Tenant = {
      id: this.tenantData == null ? 0 : this.tenantData.id,
      name: this.tenantForm.value.name,
      occupation: this.tenantForm.value.occupation,
      paddress: this.tenantForm.value.paddress,
      telephone: this.tenantForm.value.telephone,
      startDate: this.tenantForm.value.startDate,
      isActive: parseInt(this.tenantForm.value.isActive),
      flatId: this.tenantForm.value.flatId,
      flatDescription: '',
    };
    if (this.tenantData == null) {
      this._tenantService.create(_tenant).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilityService.showAlert('Tenant added successfully', 'Exit');
            this.tenantModel.close('true');
          } else
            this._utilityService.showAlert('Failed to add Tenant', 'Error');
        },
        error: (e) => {},
      });
    } else {
      this._tenantService.edit(_tenant).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilityService.showAlert(
              'Tenant successfully edited ',
              'Exit'
            );
            this.tenantModel.close('true');
          } else
            this._utilityService.showAlert('Failed to edit Tenant', 'Error');
        },
        error: (e) => {},
      });
    }
  }
}
