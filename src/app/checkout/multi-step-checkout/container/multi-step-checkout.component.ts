import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { Store } from '@ngrx/store';
import * as fromCartStore from '../../../cart/store';
import { CheckoutService } from '../../services/checkout.service';

import { Address } from './../../models/address-model';

@Component({
  selector: 'y-multi-step-checkout',
  templateUrl: './multi-step-checkout.component.html',
  styleUrls: ['./multi-step-checkout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiStepCheckoutComponent implements OnInit {
  step = 1;

  countries$: Observable<any>;

  form = this.fb.group({
    address: this.fb.group({
      titleCode: ['mr', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      line1: ['', Validators.required],
      line2: ['', Validators.required],
      town: '',
      region: this.fb.group({
        isocode: 'JP-27'
      }),
      country: this.fb.group({
        isocode: 'JP'
      }),
      postalCode: ['', Validators.required],
      phone: ''
    }),
    shippingMethod: this.fb.group({}),
    paymentMethod: this.fb.group({})
  });

  constructor(
    private fb: FormBuilder,
    protected checkoutService: CheckoutService,
    protected store: Store<fromCartStore.CartState>
  ) {}

  ngOnInit() {}

  setStep(completeStep) {
    if (this.step > completeStep) {
      this.step = completeStep;
    }
  }

  addAddress(address: Address) {
    this.checkoutService.createAndSetAddress(address);
    this.step = 2;
  }
}
