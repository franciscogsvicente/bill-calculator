import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddPersonComponent } from './add-person/add-person.component';

import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  billForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    total: new FormControl(null, [Validators.required]),
    start: new FormControl(null, [Validators.required]),
    end: new FormControl(null, [Validators.required]),
  });

  valuePerDay: number = 0;
  tenants: Array<any> = [];

  constructor(public dialog: MatDialog) {}

  addPerson(): void {
    if (this.billForm.valid) {
      let dialogRef = this.dialog.open(AddPersonComponent, {
        data: {
          billing_period: {
            start: this.billForm.get('start')?.value,
            end: this.billForm.get('end')?.value,
          },
        },
      });

      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          this.tenants.push({ ...res, id: this.tenants.length });
          this.calculateBilling();
        }
      });
    }
  }

  calculateBilling() {
    const billingPeriodStart = moment(this.billForm.get('start')?.value);
    const billingPeriodEnd = moment(this.billForm.get('end')?.value);

    let billingPeriodDates = this.getDaysBetweenDates(
      billingPeriodStart,
      billingPeriodEnd
    ).map((day: any) => {
      let tenants: any[] = [];
      return {
        date: day,
        tenants,
      };
    });

    this.valuePerDay =
      this.billForm.get('total')?.value / billingPeriodDates.length;

    const addPersonToBillingDate = (tenant: any, day: any) => {
      const index = billingPeriodDates.findIndex((item: any) => {
        return item.date.isSame(day);
      });

      if (index !== -1) {
        billingPeriodDates[index].tenants.push(tenant);
      }
    };

    this.tenants.forEach((tenant: any) => {
      const tenantDates = this.getDaysBetweenDates(
        moment(tenant.start),
        moment(tenant.end)
      );

      tenantDates.forEach((date: any) => {
        if (
          date.isBetween(billingPeriodStart, billingPeriodEnd, undefined, [])
        ) {
          addPersonToBillingDate(tenant, date);
        }
      });
    });

    console.log(billingPeriodDates);

    const isTenantInDay = (tenant: any, day: any) => {
      return day.tenants.findIndex((t: any) => t.id === tenant.id) !== -1 ? true : false;
    };

    this.tenants.forEach((person: any) => {

      person.value_pay = 0;

      billingPeriodDates.forEach((date: any) => {
        // Check if person is in this day
        if (isTenantInDay(person, date)) {
          let valuePerPerson = this.valuePerDay / date.tenants.length;
          person.value_pay += valuePerPerson;
        }
      });
    });

    console.log(this.tenants);

  }

  getDaysBetweenDates(startDate: any, endDate: any): Array<any> {
    let dates = [];

    let currDate = moment(startDate).clone();
    let lastDate = moment(endDate).clone();

    while (currDate.diff(lastDate) <= 0) {
      dates.push(currDate.clone());
      currDate.add(1, 'days');
    }

    return dates;
  }
}
