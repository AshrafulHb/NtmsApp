import { Component, ChangeDetectorRef } from '@angular/core';
import { SharedModule } from '../../../../Reusable/shared/shared.module';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Tenant } from '../../../../Interfaces/tenant';
import { TenantService } from '../../../../Services/tenant.service';
import { ReportService } from '../../../../Services/report.service';
import { UtilityService } from '../../../../Reusable/utility.service';
import moment from 'moment';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-report',
  imports: [SharedModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  // providers: [{ provide: MAT_DATE_FORMATS, useValue: DATA_FORMATS }],
  providers: [provideMomentDateAdapter(DATA_FORMATS)],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportComponent {
  reportForm: FormGroup;
  tenantList: Tenant[] = [];
  startDate: string = '';
  endDate: string = '';
  reportData: any = null;
  readonly month = new FormControl(moment());

  constructor(
    private fb: FormBuilder,
    private _tenantService: TenantService,
    private _reportService: ReportService,
    private _utilityService: UtilityService,
    private cdr: ChangeDetectorRef
  ) {
    this.reportForm = this.fb.group({
      tenantId: ['', Validators.required],
      month: ['', Validators.required], // Ensure this is required
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

    this._tenantService.list().subscribe({
      next: (data) => {
        if (data.status) {
          this.tenantList = data.value.filter(
            (tenant: Tenant) => tenant.isActive
          );
        }
      },
    });
  }

  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.month.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.month.setValue(ctrlValue);

    // Set startDate and endDate (first and last day of the selected month)
    this.startDate = moment(normalizedMonthAndYear)
      .startOf('month')
      .format('DD/MM/YYYY');
    this.endDate = moment(normalizedMonthAndYear)
      .endOf('month')
      .format('DD/MM/YYYY');

    // Update the form controls
    this.reportForm.patchValue({
      month: moment(normalizedMonthAndYear).format('MMMM YYYY'), // Display format for the input
      startDate: this.startDate,
      endDate: this.endDate,
    });

    this.reportForm.updateValueAndValidity();
    this.cdr.detectChanges(); // Trigger change detection

    datepicker.close();
  }

  report() {
    // If form is invalid, show an alert and prevent report generation
    /*  if (this.reportForm.invalid) {
      this._utilityService.showAlert(
        'Please fill in all required fields',
        'Oops!'
      );
      return;
    } */

    this._reportService
      .report(this.reportForm.value.tenantId, this.startDate, this.endDate)
      .subscribe({
        next: (data) => {
          if (data.status) {
            this.reportData = data.value; // Populate reportData
          } else {
            this._utilityService.showAlert('No report found', 'Oops!');
          }
        },
        error: (e) => {
          console.error(e);
          this._utilityService.showAlert('Something went wrong', 'Error');
        },
      });
  }

  // Generate PDF function
  generatePDF(form: HTMLElement) {
    const data: HTMLElement | null = document.querySelector('.container'); // Target the container div
    if (!data) return;
    this.hideForm(form);
    html2canvas(data).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('monthly-bill.pdf');
    });
    setTimeout(() => {
      this.unhideForm(form);
    }, 1000); // Simulate saving delay
  }

  saveAsJPEG(form: HTMLElement) {
    const data: HTMLElement | null = document.querySelector('.container');
    if (!data) return;
    this.hideForm(form);

    html2canvas(data).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg', 1.0); // High quality
      link.download = 'monthly-bill.jpeg';
      link.click();
    });
    setTimeout(() => {
      this.unhideForm(form);
    }, 1000); // Simulate saving delay
  }
  hideForm(form: HTMLElement) {
    form.style.display = 'none';
  }
  unhideForm(form: HTMLElement) {
    form.style.display = 'block';
  }
}
