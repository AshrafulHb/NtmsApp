import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../Reusable/shared/shared.module';
import { Flat } from '../../../../Interfaces/flat';
import { FlatService } from '../../../../Services/flat.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UtilityService } from '../../../../Reusable/utility.service';
import { FlatModelComponent } from '../../Models/flat-model/flat-model.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-flat',
  imports: [SharedModule],
  templateUrl: './flat.component.html',
  styleUrl: './flat.component.css',
})
export class FlatComponent implements OnInit, AfterViewInit {
  tableColumns: string[] = ['code', 'rent', 'gasBill', 'cleanerBill', 'action'];
  initialData: Flat[] = [];
  flatDataList = new MatTableDataSource(this.initialData);
  @ViewChild(MatPaginator) paginationTable!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _flatService: FlatService,
    private _utilityService: UtilityService
  ) {}

  getFlats() {
    this._flatService.list().subscribe({
      next: (data) => {
        if (data.status) this.flatDataList.data = data.value;
        else this._utilityService.showAlert('No flat found', 'Oops');
      },
      error: (e) => {},
    });
  }
  ngOnInit(): void {
    this.getFlats();
  }

  ngAfterViewInit(): void {
    this.flatDataList.paginator = this.paginationTable;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.flatDataList.filter = filterValue.trim().toLocaleLowerCase();
  }

  newFlat() {
    this.dialog
      .open(FlatModelComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'true') this.getFlats();
      });
  }

  editFlat(flat: Flat) {
    this.dialog
      .open(FlatModelComponent, {
        disableClose: true,
        data: flat,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'true') this.getFlats();
      });
  }
  deleteFlat(flat: Flat) {
    Swal.fire({
      title: 'Do you want to delete flat?',
      text: flat.code,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, return',
    }).then((result) => {
      if (result.isConfirmed) {
        this._flatService.delete(flat.id).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilityService.showAlert(
                'The flat succesfully deleted',
                '!'
              );
              this.getFlats();
            } else
              this._utilityService.showAlert('Failed delete flat', 'Error');
          },
          error: (e) => {},
        });
      }
    });
  }
}
