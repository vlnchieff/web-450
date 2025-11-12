import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartComponent } from '../../../shared/chart/chart.component';


@Component({
  selector: 'app-sales-by-region-and-product',
  standalone: true,
  imports: [ReactiveFormsModule, ChartComponent],
  template: `'
    <h1>Sales by Region and Product</h1>
    <div class="charts-container">
          <div class="card">
            <app-chart
              [type]="'bar'"
              [label]="'Revenue by Timeframe'"
              [data]="[10000, 20000, 30000]"
              [labels]="['Monthly', 'Quarterly', 'Yearly']">
            </app-chart>
          </div>
          <div class="card">
            <app-chart
              [type]="'pie'"
              [label]="'Sales by Region'"
              [data]="[3000, 2000, 1000, 4000]"
              [labels]="['North', 'South', 'East', 'West']">
            </app-chart>
          </div>
        </div>
      <h1>Sales by Product
      <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>Admin</td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>User</td>
            </tr>
          </tbody>
        </table>
    ',

})
export class SalesByRegionAndProductComponent {
  totalSales: number[] = [];
  salesPeople: string[] = [];
  regions: string[] = [];

  regionForm = this.fb.group({
    region: [null, Validators.compose([Validators.required])]
}
