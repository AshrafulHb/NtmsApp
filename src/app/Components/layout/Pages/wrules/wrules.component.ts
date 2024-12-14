import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../Reusable/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WruleService } from '../../../../Services/wrule.service';
import { WbillingRules } from '../../../../Interfaces/wbilling-rules';
import { UtilityService } from '../../../../Reusable/utility.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-wrules',
  imports: [SharedModule],
  templateUrl: './wrules.component.html',
  styleUrl: './wrules.component.css',
})
export class WrulesComponent implements OnInit {
  displayedColumns: string[] = ['unitPrice', 'serviceCharge', 'vat', 'actions'];
  initialData: WbillingRules[] = [];
  rulesData = new MatTableDataSource<WbillingRules>(this.initialData);

  isEditing = false;
  isAdding = false;
  ruleForm: FormGroup;
  selectedRule: WbillingRules | null = null;

  constructor(
    private _ruleService: WruleService,
    private _utilityService: UtilityService,
    private fb: FormBuilder
  ) {
    this.ruleForm = this.fb.group({
      id: [0],
      unitPrice: ['', Validators.required],
      serviceCharge: ['', Validators.required],
      vat: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this._ruleService.load().subscribe({
      next: (data) => {
        if (data.status) {
          this.initialData = data.value;
          const result = [data.value];
          this.rulesData.data = result;
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

  editRule(rule: WbillingRules) {
    this.isEditing = true;
    this.isAdding = false;
    this.selectedRule = rule;
    this.ruleForm.patchValue(rule);
  }

  saveRule() {
    const ruleData = this.ruleForm.value as WbillingRules;

    if (this.isEditing) {
      this._ruleService.edit(ruleData).subscribe({
        next: (data) => {
          if (data.status) {
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
      this._ruleService.create(ruleData).subscribe({
        next: (data) => {
          if (data.status) {
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
        next: (data) => {
          if (data.status) {
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
