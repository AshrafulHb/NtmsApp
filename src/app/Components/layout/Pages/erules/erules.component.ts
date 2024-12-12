import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../Reusable/shared/shared.module';
import { EbillingRules } from '../../../../Interfaces/ebilling-rules';
import { MatTableDataSource } from '@angular/material/table';
import { EruleService } from '../../../../Services/erule.service';
import { UtilityService } from '../../../../Reusable/utility.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-erules',
  imports: [SharedModule],
  templateUrl: './erules.component.html',
  styleUrl: './erules.component.css',
})
export class ErulesComponent implements OnInit {
  initialData: any = null; // EbillingRules[] = [];
  // rulesData = new MatTableDataSource<EbillingRules>(this.initialData);
  //displayedColumns: string[] = ['id', 'from1', 'to1', 'rate1', 'actions']; // Add other columns as needed
  isEditing = false;
  isAdding = false;
  ruleForm: FormGroup;
  selectedRule: EbillingRules | null = null;

  constructor(
    private _ruleService: EruleService,
    private _utilityService: UtilityService,
    private fb: FormBuilder
  ) {
    this.ruleForm = this.fb.group({
      id: [null],
      from1: [''],
      to1: [''],

      from2: [''],
      to2: [''],
      from3: [''],
      to3: [''],

      from4: [''],
      to4: [''],
      rate1: [''],
      rate2: [''],
      rate3: [''],
      rate4: [''],
      demandCharge: [''],
      commercialRate: [''],
      commercialDc: [''],
      meterRent: [''],
      vat: [''],
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this._ruleService.load().subscribe({
      next: (data) => {
        if (data.status) {
          this.initialData = data.value;
          // const result = [data.value];
          //  this.rulesData.data = result;
        } else this._utilityService.showAlert('No rules found', 'Oops!');
      },
      error: (e) => {},
    });
  }

  addRule() {
    this.isAdding = true;
    this.isEditing = false;
    this.ruleForm.reset();
  }

  editRule(rule: EbillingRules) {
    this.isEditing = true;
    this.isAdding = false;
    this.selectedRule = rule;
    this.ruleForm.patchValue(rule);
  }

  saveRule() {
    const ruleData = this.ruleForm.value as EbillingRules;

    if (this.isEditing) {
      this._ruleService.edit(ruleData).subscribe({
        next: (response) => {
          if (response.status) {
            this._utilityService.showAlert(
              'Rule updated successfully!',
              'Success'
            );
            this.loadData();
            this.cancelEdit();
          } else {
            this._utilityService.showAlert('Failed to update rule', 'Error');
          }
        },
      });
    } else if (this.isAdding) {
      ruleData.id = ruleData.id == null ? 0 : ruleData.id;

      this._ruleService.create(ruleData).subscribe({
        next: (response) => {
          if (response.status) {
            this._utilityService.showAlert(
              'Rule added successfully!',
              'Success'
            );
            this.loadData();
            this.cancelEdit();
          } else {
            this._utilityService.showAlert('Failed to add rule', 'Error');
          }
        },
      });
    }
  }

  deleteRule(id: number) {
    if (confirm('Are you sure you want to delete this rule?')) {
      this._ruleService.delete(id).subscribe({
        next: (response) => {
          if (response.status) {
            this._utilityService.showAlert(
              'Rule deleted successfully!',
              'Success'
            );
            this.loadData();
          } else {
            this._utilityService.showAlert('Failed to delete rule', 'Error');
          }
        },
      });
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.isAdding = false;
    this.selectedRule = null;
    this.ruleForm.reset();
  }
}
