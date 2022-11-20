import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';


@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.css'],
})
export class AddPersonComponent implements OnInit {
  personForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    start: new FormControl(null, [Validators.required]),
    end: new FormControl(null, [Validators.required]),
  });

  billingPeriodDays: number = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddPersonComponent>) {}

  ngOnInit(): void {

  }

  checkBoxChanged(event: MatCheckboxChange) {
    if (event.checked) {
      this.personForm.get('start')?.setValue(this.data.billing_period.start);
      this.personForm.get('end')?.setValue(this.data.billing_period.end);
    } else {
      this.personForm.get('start')?.reset();
      this.personForm.get('end')?.reset();
    }

  }

  addPerson(): void {
    if(this.personForm.valid){
      this.dialogRef.close(this.personForm.value);
    }
  }
}
