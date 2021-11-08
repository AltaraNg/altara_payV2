import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import {
	ConfirmDialogModel,
	ConfirmDialogComponent,
} from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import {
	FormBuilder,
	FormGroup,
	Validators,
	FormControl,
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { AlertService } from '../../services/alert.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from 'src/app/services/env.service';
import { tap, map } from 'rxjs/operators';
import { LoaderService } from 'src/app/loader.service';
import { calculate, cashLoan } from 'src/app/helpers/calculator';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.page.html',
	styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
	minNum = 1;
	maxNum = 31;
	user: User;
	isLinear = true;
	product: {
		name: string;
		type: string;
		plan: string;
		price: number;
		downpayment: number;
		repayment: number;
	};
	saleTypes: any;
	salePlans: any;
	saleType: any;
	salePlan: any;
	saleDetails: any;
	salePlanPercent: any;
	saleDetail: any;
	salePlanInterest: any;
	salePlanMargin: any;
	salePlanPeriod: any;
	salesType: any;
	productForm = new FormGroup({
		name: new FormControl(''),
		type: new FormControl(''),
		plan: new FormGroup({
			price: new FormControl(''),
			downpayment: new FormControl(''),
			repayment: new FormControl(''),
		}),
	});

	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;
	thirdFormGroup: FormGroup;
	fourthFormGroup: FormGroup;
	fifthFormGroup: FormGroup;
	sixthFormGroup: FormGroup;
	seventhFormGroup: FormGroup;
	eightFormGroup: FormGroup;
	isUpdated: boolean = true;
	customerData: any;
	update: any;
	productData: any;
	productPrice: number;
	productName: any = '';
	dataToSave: any;
	amount: number;
	ref: number;
	remainder: any;
	repayLevel: any;
	repayValue: any;
	downpayValue: any;
	order = {
		return: 0,
		p_reciept: '',
		p_date: '',
		cate_gory: 1,
		custp_id: '',
		product_sku: '',
		product_price: '',
		down_pay: '',
		sales_agent: '',
		product_name: '',
		product_gty: 1,
		sale_type: '',
		discount: 8,
		repaymt: '',
		pay_mtd: 4,
		dep_to: 1,
		referrer_id: '',
	};
	repay = {
		repayid: '',
		date_payed: '',
		amount_payed: 0,
		period: '',
		nowdate: '',
		nextdate: '',
		pay_bank: 1,
		pay_mtd: 4,
	};
	b_code: any;
	sub_acct: any;
	order_id: string;
	verifyData: any;
	lastReceipt: any;
	transfer: boolean = false;
	result: string = '';
	key: any;
	sKey: any;
	pKey: any;
	nextReciept: any;
	productType: any;
	paymentGateways: any;
	receiptText: boolean = true;
	salesPlanId: any;
	myControl = new FormControl();
	repaymentDuration: any;
	repaymentCyclesopt: any;
	downPaymentRates: any;
	businessTypes: any;	
	paymentMethods: any;
	orderTypes: any;
	banks: any;

	repayment_duration: any;
	repayment_cyclesopt: any;
	downPayment_rate: any;
	business_type: any;
	payment_method: any;
	bank: any;
	salesCategory: any;
	saleCategory: any;
	roles: any;
	calculation: any;
	fPayment: any;
	pPrice: any;
	rPayment: any;
	repaymentCircle: any;
	rDuration: any;

	options: any = [];
	constructor(
		private _formBuilder: FormBuilder,
		private menu: MenuController,
		private authService: AuthService,
		private alertService: AlertService,
		private platform: Platform,
		private storage: NativeStorage,
		private navCtrl: NavController,
		public dialog: MatDialog,
		private http: HttpClient,
		private env: EnvService,
		private ionLoader: LoaderService
	) {
		this.menu.enable(true);
		this.getRepaymentCycle();
		this.getRepaymentDuration();
		this.getDownPaymentRates();
		this.getBusinessTypes();
		this.getBanks();
		this.getPaymentMethod();
		this.getSalesCategory();
		this.getCalculation();
		this.getOrderTypes();
		this.getPaymentGateways();
	}

	ngOnInit() {
		this.saleTypes = [
			{ id: 1, name: 'New -0%', percent: 0 },
			// { id: 2, name: "sala-promo -0%", percent: 0 },
			// { id: 3, name: "group5 -5%", percent: 5 },
			// { id: 4, name: "group10 -10%", percent: 10 },
			// { id: 5, name: "xmas-promo -0%", percent: 0 },
			{ id: 2, name: 'Renewal -5%', percent: 5 },
			// { id: 7, name: "family-friend -5%", percent: 5 },
			// { id: 8, name: "Direct Debit -5%", percent: 5 }
			// { id: 9, name: "Opening -10%", percent: 10 }
		];
		this.salePlans = [
			{
				type: 'Products',
				details: [
					{
						id: 1,
						name: '6 month plan 0%',
						period: 6,
						percent: 0,
					},
					{
						id: 2,
						name: '6 month plan 20%',
						period: 6,
						percent: 20,
					},
					{
						id: 3,
						name: '6 month plan 40%',
						period: 6,
						percent: 40,
					},
					{
						id: 4,
						name: '6 month plan 60%',
						period: 6,
						percent: 60,
					},
					{
						id: 5,
						name: '6 month plan 80%',
						period: 6,
						percent: 80,
					},
					{
						id: 6,
						name: '3 month plan 20%',
						period: 3,
						percent: 20,
					},
					{
						id: 7,
						name: '3 month plan 40%',
						period: 3,
						percent: 40,
					},
				],
			},
			{
				type: 'Cash Loan',
				details: [
					{
						id: 1,
						name: '6 month - 20% equity(still have product)',
						period: 6,
						percent: 20,
						type: 'haveProduct',
					},
					{
						id: 2,
						name: '6 month - 20% equity(w/o product)',
						period: 6,
						percent: 20,
						type: 'withoutProduct',
					},
				],
			},
		];

		this.b_code = [
			{ id: 2, code: 'ACCT_z6a4tsvupmoo0hz' },
			{ id: 3, code: 'ACCT_z6a4tsvupmoo0hz' },
			{ id: 4, code: 'ACCT_93q2vycqxrg4nau' },
			{ id: 5, code: 'ACCT_ahye96qmminhs36' },
			{ id: 6, code: 'ACCT_jpd6kcd4n8t9zu5' },
			{ id: 8, code: 'ACCT_8p45z039s2inwwe' },
			{ id: 9, code: 'ACCT_88vzjvjeskbfe39' },
			{ id: 11, code: 'ACCT_w3ola5amahnl7mc' },
			{ id: 12, code: 'ACCT_fmntykscho1l47g' },
			{ id: 13, code: 'ACCT_7rnedh9mxiz1oc6' },
			{ id: 14, code: 'ACCT_5ozavs8mu7439jr' },
			{ id: 15, code: 'ACCT_iljpbd8m7rd72yw' },
			{ id: 16, code: 'ACCT_iljpbd8m7rd72yw' },
			{ id: 17, code: 'ACCT_93q2vycqxrg4nau' },
			{ id: 18, code: 'ACCT_93q2vycqxrg4nau' },
		];

		this.sixthFormGroup = this._formBuilder.group({
			repaymentPrice: [''],
			totalPrice: [''],
			downPayment: [''],
		});

		this.seventhFormGroup = this._formBuilder.group({
			salaryDay: [
				'',
				[
					Validators.required,
					Validators.min(this.minNum),
					Validators.max(this.maxNum),
				],
			],
			salaryDay2: [
				'',
				[
					Validators.required,
					Validators.min(this.minNum),
					Validators.max(this.maxNum),
				],
			],
			salaryDay3: [
				'',
				[
					Validators.required,
					Validators.min(this.minNum),
					Validators.max(this.maxNum),
				],
			],
			salaryProof: ['', Validators.required],
			guarantorSigned: ['', Validators.required],
			addressVisited: ['', Validators.required],
			creditReport: ['', Validators.required],
			creditPoints: ['', Validators.required],
		});
		this.eightFormGroup = this._formBuilder.group({
			repayment_duration_id: ['', Validators.required],
			repayment_cycle_id: ['', Validators.required],
			business_type_id: ['', Validators.required],
			payment_type_id: ['', Validators.required],
			payment_gateway_id: ['', Validators.required],
			custom_date: [''],
		});

		this.firstFormGroup = this._formBuilder.group({
			customerId: ['', Validators.required],
		});
		this.secondFormGroup = this._formBuilder.group({
			email: ['', Validators.required],
			first_name: ['', Validators.required],
			middle_name: [''],
			last_name: ['', Validators.required],
			phoneNo: ['', Validators.required],
			dateOfBirth: ['', Validators.required],
			sector: ['', Validators.required],
			occupation: ['', Validators.required],
			company: ['', Validators.required],
			income: ['', Validators.required],
			household: ['', Validators.required],
		});
		this.thirdFormGroup = this._formBuilder.group({
			productSku: ['', Validators.required],
			serial_number: [''],
		});
		this.fourthFormGroup = this._formBuilder.group({
			saleType: ['', Validators.required],
			// salePlan: ["", Validators.required],
			// saleDetail: ["", Validators.required],
			saleCategory: ['', Validators.required],
			owner: ['', Validators.required],
		});
		this.fifthFormGroup = this._formBuilder.group({
			makePayment: ['1', Validators.required],
			downPayment: [{ value: 0.0, disabled: true }, Validators.required],
			enterAmount: [0.0, Validators.required],
		});

		// this.onChanges();
	}

	confirmDialog(stepper: MatStepper): void {
		const message = `Are you sure the customer made transfer?`;

		const dialogData = new ConfirmDialogModel('Confirm Transfer', message);

		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			maxWidth: '400px',
			data: dialogData,
		});

		dialogRef.afterClosed().subscribe((dialogResult) => {
			this.result = dialogResult;
			if (this.result) {
				this.transferDone(stepper);
			}
		});
	}

	ionViewWillEnter() {
		this.getPkey('public');
		this.getSkey('secret');
	}

	getPkey(key_type: string) {
		this.authService.getkey(key_type).subscribe((key) => {
			this.key = key['data'].find((data) => data.name === key_type);

			this.pKey = this.key.key;
		});
	}

	getSkey(key_type: string) {
		this.authService.getkey(key_type).subscribe((key) => {
			this.key = key['data'].find((data) => data.name === key_type);
			this.sKey = this.key.key;
		});
	}

	Clicked() {
		this.transfer = !this.transfer;
	}

	enable() {
		this.receiptText = !this.receiptText;
	}

	// onChanges(): void {
	//   this.fourthFormGroup.get("salePlan").valueChanges.subscribe(val => {
	//     this.salePlans.forEach(element => {
	//       if (element.type == val) {
	//         this.productType = val;
	//         this.saleDetails = element.details;
	//       }
	//     });

	//   });
	// }

	get radioValue() {
		return this.fifthFormGroup.get('makePayment').value;
	}

	checkId(stepper: MatStepper) {
		this.authService
			.comfirmId(this.firstFormGroup.value.customerId)
			.subscribe((result) => {
				this.customerData = result;
				if (this.customerData.customer.length === 0) {
					this.alertService.presentToast('Invalid Customer ID');
				} else {
					this.getreciept();
					this.secondFormGroup = this._formBuilder.group({
						email: [this.customerData.customer[0].email, Validators.required],
						first_name: [
							this.customerData.customer[0].first_name,
							Validators.required,
						],
						middle_name: [this.customerData.customer[0].middle_name],
						last_name: [
							this.customerData.customer[0].last_name,
							Validators.required,
						],
						phoneNo: [
							this.customerData.customer[0].telephone,
							Validators.required,
						],
						dateOfBirth: [
							this.customerData.customer[0].date_of_birth,
							Validators.required,
						],
						sector: [
							this.customerData.customer[0].employment_status,
							Validators.required,
						],
						occupation: [
							this.customerData.customer[0].occupation,
							Validators.required,
						],
						company: [
							this.customerData.customer[0].name_of_company_or_business,
							Validators.required,
						],
						income: [
							this.customerData.customer[0].current_sal_or_business_income,
							Validators.required,
						],
						household: [
							this.customerData.customer[0].people_in_household,
							Validators.required,
						],
					});

					stepper.next();
				}
			});
	}
	// 130-0796-CHE-ELO-AP

	confirmDocData(stepper: MatStepper) {
		stepper.next();
	}

	confirmData(stepper: MatStepper) {
		this.authService
			.updatesCustomerInfo(
				this.firstFormGroup.value.customerId,
				this.secondFormGroup.value.email,
				this.secondFormGroup.value.first_name,
				this.secondFormGroup.value.middle_name,
				this.secondFormGroup.value.last_name,
				this.secondFormGroup.value.phoneNo,
				this.secondFormGroup.value.dateOfBirth,
				this.secondFormGroup.value.sector,
				this.secondFormGroup.value.occupation,
				this.secondFormGroup.value.company,
				this.secondFormGroup.value.income,
				this.secondFormGroup.value.household
			)
			.subscribe((result) => {
				this.update = result;
				this.isUpdated = this.update.error;
				if (this.isUpdated == false) {
					// create customer in paystack
					this.alertService.presentToast(
						'Customer Info Comfirmed .. Saving Data to Paystack'
					);
					this.authService
						.createCustomer(
							this.firstFormGroup.value.customerId,
							this.secondFormGroup.value.email,
							this.secondFormGroup.value.first_name,
							this.secondFormGroup.value.last_name,
							this.secondFormGroup.value.phoneNo,
							this.sKey
						)
						.subscribe((response) => {
							this.dataToSave = response;
							if (this.dataToSave != {}) {
								this.alertService.presentToast(
									'Customer Data Saved to Paystack'
								);
								this.authService
									.paystackCustomer(
										this.firstFormGroup.value.customerId,
										this.dataToSave.data.customer_code
									)
									.subscribe((res) => {
										if (res) {
										}
									});
								if (!(this.secondFormGroup.value.sector === 'formal')) {
									this.seventhFormGroup = this._formBuilder.group({
										salaryDay: [
											{ value: null, disabled: true },
											Validators.required,
										],
										salaryDay2: [
											{ value: null, disabled: true },
											Validators.required,
										],
										salaryDay3: [
											{ value: null, disabled: true },
											Validators.required,
										],
										salaryProof: ['', Validators.required],
										guarantorSigned: ['', Validators.required],
										addressVisited: ['', Validators.required],
										creditReport: ['', Validators.required],
										creditPoints: ['', Validators.required],
									});
								} else {
									this.seventhFormGroup = this._formBuilder.group({
										salaryDay: [
											'',
											[
												Validators.required,
												Validators.min(this.minNum),
												Validators.max(this.maxNum),
											],
										],
										salaryDay2: [
											'',
											[
												Validators.required,
												Validators.min(this.minNum),
												Validators.max(this.maxNum),
											],
										],
										salaryDay3: [
											'',
											[
												Validators.required,
												Validators.min(this.minNum),
												Validators.max(this.maxNum),
											],
										],
										salaryProof: ['', Validators.required],
										guarantorSigned: ['', Validators.required],
										addressVisited: ['', Validators.required],
										creditReport: ['', Validators.required],
										creditPoints: ['', Validators.required],
									});
								}
								stepper.next();
							} else {
								this.alertService.presentToast(
									'Problem Saving Data to Paystack'
								);
							}
						});
				} else {
					this.alertService.presentToast('Comfirmation Error');
				}
			});
	}

	checkProductSku(stepper: MatStepper) {
		// this.authService
		//   .comfirmProduct(this.thirdFormGroup.value.productSku)
		//   .subscribe(result => {
		//     // console.log(result);
		//     this.productData = result;
		if (this.productData.length === 0) {
			this.alertService.presentToast('Product Not Available');
		} else {
			// this.nextReciept = this.computeR(this.lastReceipt);
			// console.log(this.productData.users[0].product_name);
			this.productPrice = this.productData.price;
			// this.sixthFormGroup.get('productName').setValue(this.productData.users[0].product_name);
			this.productName = this.productData.product_name;
			// this.platform.ready().then(() => {
			//   this.storage
			//     .setItem("branch_id", this.productData.users[0].store_name)
			//     .then(
			//       () => {
			//         console.log("branch ID Stored");
			//       },
			//       error => console.error("Error storing item", error)
			//     );
			// });
			stepper.next();
		}
	}

	processBankcode() {
		this.authService.getBranchId().then(() => {
			// console.log(this.authService.branch_id);
			this.b_code.forEach((element) => {
				if (element.id == Number(this.authService.branch_id)) {
					this.sub_acct = element.code;
					// console.log(this.sub_acct);
				}
			});
		});
	}

	saveData(stepper: MatStepper, transfer: boolean) {
		var re: any;

		var auth_code =
			transfer == false
				? this.verifyData.data.authorization.authorization_code
				: null;
		this.createOrder().subscribe((res) => {
			const orderdata = res['data']['order_number'];

			if (res) {
				this.alertService.presentToast('Order Logged Succesfully!');
				this.authService
					.pushDDdata(
						this.firstFormGroup.value.customerId,
						orderdata,
						this.seventhFormGroup.value.salaryDay
							? this.seventhFormGroup.value.salaryDay
							: null,
						this.seventhFormGroup.value.salaryDay2
							? this.seventhFormGroup.value.salaryDay2
							: null,
						this.seventhFormGroup.value.salaryDay3
							? this.seventhFormGroup.value.salaryDay3
							: null,
						this.seventhFormGroup.value.salaryProof,
						this.seventhFormGroup.value.guarantorSigned,
						this.seventhFormGroup.value.addressVisited,
						this.seventhFormGroup.value.creditReport,
						this.seventhFormGroup.value.creditPoints,
						this.secondFormGroup.value.sector == 'formal' ? 1 : 0
					)
					.subscribe((res) => {
						if (res) {
							this.pushauthCode(
								orderdata,
								auth_code,
								// Math.floor(Math.random() * 1000),
								stepper
							);
						}
						this.resetForm(stepper);
					});
			} else {
				this.alertService.presentToast('Error Occured!');
			}
		});
	}

	getreciept() {
		var re: any;
		this.authService.getBranchId().then(() => {
			this.authService.getLastreceipt().subscribe((result) => {
				re = result;
				if (re && re.id && re.id.length == 0) {
					this.lastReceipt = '';
				} else {
					this.lastReceipt = re.id[0].id;
				}
				// this.lastReceipt = 'LSIW00022'
			});
		});
	}

	computeR(rec: any) {
		var prefx = [
			{ id: 2, pre: 'APCH' },
			{ id: 3, pre: 'APDU' },
			{ id: 4, pre: 'APIW' },
			{ id: 5, pre: 'APAG' },
			{ id: 6, pre: 'APBO' },
			{ id: 8, pre: 'LSBO' },
			{ id: 9, pre: 'APAP' },
			{ id: 11, pre: 'LSIW' },
			{ id: 12, pre: 'APTA' },
			{ id: 13, pre: 'APOW' },
			{ id: 14, pre: 'APOG' },
			{ id: 15, pre: 'APYO' },
			{ id: 16, pre: 'APFU' },
			{ id: 17, pre: 'AAAL' },
			{ id: 18, pre: 'AAIY' },
		];

		var nR: any, rec_dd: any, prefix: any, r: any;

		if (rec == '' || rec == undefined) {
			prefx.forEach((element) => {
				if (this.authService.branch_id == element.id) {
					nR = element.pre + '00001';
				}
			});
		} else {
			rec_dd = rec.substring(0, rec.length - 2);
			prefix = rec_dd.substring(0, 4);
			r = Number(rec_dd.substring(4)) + 1;

			nR =
				r.toString().length == 1
					? prefix + '0000' + r
					: r.toString().length == 2
					? prefix + '000' + r
					: r.toString().length == 3
					? prefix + '00' + r
					: r.toString().length == 4
					? prefix + '0' + r
					: prefix + r;
		}
		return nR + 'DD';
	}

	checkTypePlan(stepper: MatStepper) {
		// this.salePlans.forEach(element => {
		//   if (element.type == this.fourthFormGroup.value.salePlan) {
		//     this.saleDetails = element.details;
		//   }
		// });

		// this.saleDetails.forEach(element => {
		//   if (element.id == this.fourthFormGroup.value.saleDetail) {
		//     this.saleDetail = element.name;
		//     this.salePlanPercent = element.percent;
		//     this.salePlanPeriod = element.period;
		//     this.salesPlanId = element.id;
		//     this.salesType = element.type;
		//   }
		// });

		this.saleTypes.forEach((element) => {
			if (element.id == this.fourthFormGroup.value.saleType) {
				this.saleType = element.name;
			}
		});

		this.salesCategory.forEach((element) => {
			if (element.id == this.fourthFormGroup.value.saleCategory) {
				this.saleCategory = element.name;
			}
		});

		if (this.thirdFormGroup.value) {
			// this.priceCal();
			this.illustratedPrice(
				this.productPrice,
				this.salePlanPercent,
				this.salePlanPeriod,
				this.productType
			);

			stepper.next();
		} else {
			stepper.previous();
		}
	}

	nextStep(stepper: MatStepper) {
		if (
			this.eightFormGroup.value.repayment_cycle_id == 3 &&
			!this.eightFormGroup.value.custom_date
		) {
			return;
		}

		if (
			(this.eightFormGroup.value.repayment_cycle_id.name == 'custom' &&
				!this.eightFormGroup.value.custom_date) ||
			this.eightFormGroup.value.custom_date > 31
		) {
			return;
		}

		if (this.eightFormGroup.value.repayment_cycle_id.name != 'custom') {
			delete this.eightFormGroup.value.custom_date;
		}

		if (this.eightFormGroup.value) {
			stepper.next();
		} else {
			stepper.previous();
		}
		this.getCalc();
	}

	makePayment(stepper: MatStepper) {
		if (this.fifthFormGroup.value) {
			stepper.next();
		} else {
			stepper.previous();
		}
	}

	checkP(wPrice, val, type) {
		if (type != 'Cash Loan') {
			return val;
		} else {
			return Math.ceil(val / 100) * 100;
		}
	}

	rawCal(wPrice, plan, month, type) {
		wPrice = Number(wPrice);

		let params = [
			{
				month: 12,
				pim: [
					{ plan: 0, int: 3, marg: 0.35 },
					{ plan: 20, int: 2.5, marg: 0.29 },
					{ plan: 40, int: 2.5, marg: 0.3 },
					{ plan: 60, int: 2.5, marg: 0.3 },
					{ plan: 80, int: 2.5, marg: 0.3 },
				],
			},
			{
				month: 6,
				pim: [
					{ plan: 0, int: 3.3, marg: 0.27 },
					{ plan: 20, int: 3, marg: 0.22 },
					{ plan: 40, int: 3, marg: 0.22 },
					{ plan: 60, int: 3, marg: 0.23 },
					{ plan: 80, int: 3, marg: 0.25 },
				],
			},
			{
				month: 3,
				pim: [
					{ plan: 0, int: 5, marg: 0.3 },
					{ plan: 20, int: 3, marg: 0.23 },
					{ plan: 40, int: 4, marg: 0.23 },
					{ plan: 60, int: 4, marg: 0.23 },
					{ plan: 80, int: 4, marg: 0.23 },
				],
			},
		];

		let cash_params = [
			{
				month: 6,
				pim: [
					{ type: 'haveProduct', plan: 20, int: 2.75, marg: 0 },
					{ type: 'withoutProduct', plan: 20, int: 3.15, marg: 0 },
				],
			},
		];

		let mPrice;
		let dpPrice;
		let rInt;
		let trInt;
		let tbTax;
		let taTax;
		let rePay;
		let margin;
		let int;
		let rPrice;
		let f_params;

		f_params = type != 'Cash Loan' ? params : cash_params;

		if (type != 'Cash Loan') {
			f_params.forEach((element) => {
				if (month == element.month) {
					element.pim.forEach((element2) => {
						if (element2.plan == plan) {
							int = element2.int;
							margin = element2.marg;
						}
					});
				}
			});
		} else {
			f_params.forEach((element) => {
				if (month == element.month) {
					element.pim.forEach((element2) => {
						if (element2.type == this.salesType) {
							int = element2.int;
							margin = element2.marg;
						}
					});
				}
			});
		}

		var monthParam = month == 12 ? 24 : month == 6 ? 12 : 6;

		// market price
		mPrice = this.checkP(wPrice, wPrice * margin + wPrice, type);

		// downpayment price
		dpPrice = this.checkP(wPrice, mPrice * (plan / 100), type);

		//residual price
		rPrice = this.checkP(wPrice, mPrice - dpPrice, type);

		//interest on residual
		rInt = this.checkP(wPrice, rPrice * (int / 100), type);

		// totalresidual after interest
		trInt = this.checkP(
			wPrice,
			(rPrice / monthParam + rInt) * monthParam,
			type
		);

		// total before tax
		tbTax = this.checkP(wPrice, trInt + dpPrice, type);

		// total after tax
		taTax = this.checkP(wPrice, tbTax + tbTax * 0.05, type);

		return taTax;
	}

	illustratedPrice(wPrice, plan, month, type) {
		let newDp;
		let newRp;
		let mRepay;
		let newTax;
		// total after tax
		let taTax = this.rawCal(wPrice, plan, month, type);

		var monthParam = month == 12 ? 24 : month == 6 ? 12 : 6;

		// new downpayment price
		newDp = this.checkP(wPrice, taTax * (plan / 100), type);

		//new residual price
		newRp = this.checkP(wPrice, taTax - newDp, type);

		//Montly repayment price
		mRepay = this.checkP(wPrice, newRp / monthParam, type);

		if (type != 'Cash Loan') {
			newTax =
				Math.floor(newDp / 100) * 100 +
				Math.floor(mRepay / 100) * 100 * monthParam;

			let downP = Math.floor(newDp / 100) * 100;
			if (downP == 0) {
				downP = downP + 100;
			}

			this.sixthFormGroup = this._formBuilder.group({
				repaymentPrice: [Math.floor(mRepay / 100) * 100 * 2],
				totalPrice: [newTax],
				downPayment: [downP],
			});
		} else {
			newTax = Math.floor(0.2 * wPrice) + mRepay * monthParam;
			let downP = Math.floor(0.2 * wPrice);
			if (downP == 0) {
				downP = downP + 100;
			}

			this.sixthFormGroup = this._formBuilder.group({
				repaymentPrice: [Math.floor(mRepay / 100) * 100 * 2],
				totalPrice: [newTax],
				downPayment: [downP],
			});
		}
	}

	processAmount(stepper: MatStepper) {
		this.fifthFormGroup = this._formBuilder.group({
			makePayment: [this.fifthFormGroup.value.makePayment, Validators.required],
			downPayment: [
				{ value: this.sixthFormGroup.value.downPayment, disabled: true },
				Validators.required,
			],
			enterAmount: [this.fifthFormGroup.value.enterAmount, Validators.required],
		});
		stepper.next();
	}

	processPayment(stepper: MatStepper) {
		this.processBankcode();
		this.ref = Math.floor(Math.random() * 1000000000 + 1);

		if (
			this.fifthFormGroup.value.makePayment == '2' &&
			this.fifthFormGroup.value.enterAmount <=
				this.sixthFormGroup.value.downPayment
		) {
			this.alertService.presentToast(
				' Amount must be greater than Down Payment'
			);
		} else {
			if (this.fifthFormGroup.value.makePayment == '2') {
				this.amount = Number(this.fifthFormGroup.value.enterAmount + '00');
			} else {
				this.amount = Number(this.sixthFormGroup.value.downPayment + '00');
			}
			// this.testPayDone(stepper);
			stepper.next();
		}
	}

	paymentCancel(stepper: MatStepper) {}

	transferDone(stepper: MatStepper) {
		this.saveData(stepper, this.transfer);
	}

	paymentDone($event, stepper: MatStepper) {
		this.authService
			.generateAuthKey(this.ref, this.sKey)
			.subscribe((result) => {
				this.verifyData = result;
				if (result) {
					this.saveData(stepper, this.transfer);
				}
			});
	}

	toFormData(obj: any) {
		var form_data = new FormData();
		for (var key in obj) {
			form_data.append(key, obj[key]);
		}
		return form_data;
	}

	pushauthCode(order_id: any, auth_code: any, stepper: MatStepper) {
		if (auth_code !== null) {
			this.authService.logAuthcode(order_id, auth_code).subscribe((result) => {
				if (result) {
					this.authService.getEpId().then(() => {
						this.order.sales_agent = this.authService.id;
						this.pushOrder(stepper);
					});
				}
			});
		} else {
			this.authService.getEpId().then(() => {
				this.order.sales_agent = this.authService.id;
				this.pushOrder(stepper);
			});
		}
	}

	pushOrder(stepper: MatStepper) {
		let today = new Date();
		let date =
			today.getFullYear() +
			'-' +
			(today.getMonth() + 1) +
			'-' +
			today.getDate();
		this.order.p_date = date;
		this.order.custp_id = this.firstFormGroup.value.customerId;
		this.order.p_reciept = this.nextReciept;
		this.order.product_sku = this.thirdFormGroup.value.productSku.toUpperCase();
		this.order.product_price = this.sixthFormGroup.value.totalPrice;

		if (this.amount == Number(this.sixthFormGroup.value.downPayment + '00')) {
			this.repayLevel = 'firstpayment';
		} else {
			this.remainder =
				this.amount - Number(this.sixthFormGroup.value.downPayment + '00');
			this.repayLevel = '1st';
		}
		this.order.down_pay = this.sixthFormGroup.value.downPayment;
		this.order.sale_type = this.salesPlanId;
		this.order.repaymt = this.sixthFormGroup.value.repaymentPrice;
		this.order.referrer_id = this.firstFormGroup.value.customerId;
		this.order.product_name = this.productName;
		let formData = this.toFormData(this.order);

		// this.authService.postOrder(formData).subscribe(result => {
		//   if (result) {
		//     console.log(result);
		//     this.alertService.presentToast("Order Posted");
		//     this.pushRepayment(stepper);
		//   } else {
		//     this.alertService.presentToast(
		//       "Payment Made but an Issue occured, Contact Support"
		//     );
		//   }
		// });
	}

	addDays(date: Date, days: number) {
		var result = new Date(date);
		result.setDate(date.getDate() + days);
		return result;
	}

	formatDate(date: Date) {
		return (
			date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
		);
	}

	pushRepayment(stepper: MatStepper) {
		this.repay.repayid = this.nextReciept;
		this.repay.date_payed = this.order.p_date;
		this.repay.amount_payed = this.remainder / 100;
		this.repay.period = this.repayLevel;
		this.repay.nowdate = this.order.p_date;
		this.repay.nextdate = this.formatDate(
			this.addDays(new Date(this.order.p_date), 28)
		);
		let formData = this.toFormData(this.repay);

		this.authService.updateRepayment(formData).subscribe((result) => {
			if (result) {
				this.alertService.presentToast('Repayment Posted');
				this.resetForm(stepper);
			}
		});
	}

	logout() {
		this.authService.logout();
		if (this.authService.isLoggedIn) {
			this.alertService.presentToast('Problem Logging Out');
		} else {
			this.navCtrl.navigateRoot('/login');
		}
	}

	reactivate() {
		this.navCtrl.navigateRoot('/reactivation');
	}

	resetForm(stepper: MatStepper) {
		this.lastReceipt = '';
		this.nextReciept = '';
		stepper.reset();
		this.ngOnInit();
		this.firstFormGroup.reset;
		this.secondFormGroup.reset;
		this.thirdFormGroup.reset;
		this.fourthFormGroup.reset;
		this.fifthFormGroup.reset;
		this.sixthFormGroup.reset;
		this.seventhFormGroup.reset;
	}

	keyPress(event: KeyboardEvent) {
		this.authService
			.comfirmProduct(this.thirdFormGroup.value.productSku)
			.subscribe(
				async (res: any) => {
					this.options = res.data.data;
					if (this.options.length === 0) {
						this.alertService.presentToast('Product Not Available');
					}
				},
				(error) => {}
			);
	}

	selectedItem(data) {
		this.productData = data;
	}

	getRepaymentCycle() {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${localStorage.getItem('token')}`,
		});
		let options = { headers: headers };
		return this.http
			.get(this.env.NEW_API_URL + '/api/repayment_cycle', options)
			.subscribe((res) => {
				this.repaymentCyclesopt = res['data']['data'].filter(
					(x) => x['name'] != 'monthly'
				);
			});
	}

	getRepaymentDuration() {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${localStorage.getItem('token')}`,
		});
		let options = { headers: headers };
		return this.http
			.get(this.env.NEW_API_URL + '/api/repayment_duration', options)
			.subscribe((res) => {
				this.repaymentDuration = res['data']['data'];
			});
	}

	getDownPaymentRates() {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${localStorage.getItem('token')}`,
		});
		let options = { headers: headers };
		return this.http
			.get(this.env.NEW_API_URL + '/api/down_payment_rate', options)
			.subscribe((res) => {
				this.downPaymentRates = res['data']['data'];
			});
	}

	getBusinessTypes() {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${localStorage.getItem('token')}`,
		});
		let options = { headers: headers };
		return this.http
			.get(this.env.NEW_API_URL + '/api/business_type', options)
			.subscribe((res) => {
				this.businessTypes = res['data']['data']
					.filter((data) => data.slug.includes('ap_') && data.status)
					.sort((a, b) => (a.name > b.name ? 1 : -1));
			});
	}

	getPaymentMethod() {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${localStorage.getItem('token')}`,
		});
		let options = { headers: headers };
		return this.http
			.get(this.env.NEW_API_URL + '/api/payment_method', options)
			.subscribe((res) => {
				this.paymentMethods = res['paymentMethods'].filter(
					(data) =>
						data.name.includes('direct-debit') || data.name.includes('transfer')
				);
			});
	}

	getOrderTypes() {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${localStorage.getItem('token')}`,
		});
		let options = { headers: headers };
		return this.http
			.get(this.env.NEW_API_URL + '/api/order-types', options)
			.subscribe((res) => {
				this.orderTypes = res['orderTypes'];
			});
	}

	getPaymentGateways() {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${localStorage.getItem('token')}`,
		});
		let options = { headers: headers };
		return this.http
			.get(this.env.NEW_API_URL + '/api/paymentgateways', options)
			.subscribe((res) => {
				this.paymentGateways = res['paymentgateways'];
			});
	}

	getBanks() {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${localStorage.getItem('token')}`,
		});
		let options = { headers: headers };
		return this.http
			.get(this.env.NEW_API_URL + '/api/bank', options)
			.subscribe((res) => {
				this.banks = res['banks'];
			});
	}

	getCalculation() {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${localStorage.getItem('token')}`,
		});
		let options = { headers: headers };
		return this.http
			.get(this.env.NEW_API_URL + '/api/price_calculator', options)
			.subscribe((res) => {
				this.calculation = res['data'];
			});
	}

	createOrder() {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${localStorage.getItem('token')}`,
		});
		let options = { headers: headers };

		let orderType = this.orderTypes.find((item) => {
			return item.name === 'Altara Pay';
		});

		const data = {
			...this.eightFormGroup.value,
			'order_type_id': orderType.id,
			'repayment_cycle_id': this.eightFormGroup.value.repayment_cycle_id.id,
			'repayment_duration_id':
				this.eightFormGroup.value.repayment_duration_id.id,
			'down_payment_rate_id': this.eightFormGroup.value.payment_type_id.id,
			'payment_type_id': this.eightFormGroup.value.payment_type_id.id,
			'payment_gateway_id': this.eightFormGroup.value.payment_gateway_id.id,
			'business_type_id': this.eightFormGroup.value.business_type_id.id,
			'customer_id': this.firstFormGroup.value.customerId,
			'inventory_id': this.productData.id,
			'branch_id': localStorage.getItem('branchId'),
			'down_payment':
				this.fifthFormGroup.value.makePayment == '2'
					? +(+this.fifthFormGroup.value.enterAmount).toFixed(2)
					: +(+this.sixthFormGroup.value.downPayment).toFixed(2),
			'repayment': +(+this.sixthFormGroup.value.repaymentPrice).toFixed(2),
			'product_price': +(+this.pPrice).toFixed(2),
			'bank_id': 1,
			'sales_category_id': this.fourthFormGroup.value.saleCategory,
			'owner_id': this.fourthFormGroup.value.owner,
			'payment_method_id': this.transfer
				? this.paymentMethods.find((data) => data.name === 'transfer').id
				: this.paymentMethods.find((data) => data.name === 'direct-debit').id,
		};
		if (this.thirdFormGroup.value.serial_number) {
			data.serial_number = this.thirdFormGroup.value.serial_number;
		}
		return this.http
			.post(this.env.NEW_API_URL + '/api/new_order', data, options)
			.pipe(
				tap((data) => {
					return data;
				})
			);
	}

	getSalesCategory() {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${localStorage.getItem('token')}`,
		});
		let options = { headers: headers };
		return this.http
			.get(this.env.NEW_API_URL + '/api/sales_category', options)
			.subscribe((res) => {
				this.salesCategory = res['data']['data'];
			});
	}

	fetchRoles() {
		this.ionLoader.showLoader();
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${localStorage.getItem('token')}`,
		});
		let options = { headers: headers };
		return this.http
			.get(
				this.env.NEW_API_URL +
					`/api/sales-category/${this.fourthFormGroup.value.saleCategory}/roles`,
				options
			)
			.subscribe((res) => {
				this.ionLoader.hideLoader();

				// this.roles = ;

				this.roles = this.mergeArrays(res['data']).sort((a, b) =>
					a['full_name'].localeCompare(b['full_name'])
				);
			});
	}

	mergeArrays(parent) {
		let result = [];
		parent.forEach((elem) => {
			result = result.concat(elem.users);
		});
		return result;
	}

	getCalc() {
		try {
			const data0 = {
				...this.eightFormGroup.value,
				'customer_id': this.firstFormGroup.value.customerId,
				'inventory_id': this.productData.id,
				'branch_id': localStorage.getItem('branchId'),
				'down_payment':
					this.fifthFormGroup.value.makePayment == '2'
						? this.fifthFormGroup.value.enterAmount
						: this.sixthFormGroup.value.downPayment,
				'repayment': this.sixthFormGroup.value.repaymentPrice,
				'product_price': this.pPrice,
				'bank_id': 1,
				'sales_category_id': this.fourthFormGroup.value.saleCategory,
				'owner_id': this.fourthFormGroup.value.owner,
				'payment_method_id': this.transfer
					? this.paymentMethods.find((data) => data.name === 'transfer').id
					: this.paymentMethods.find((data) => data.name === 'direct-debit').id,
				...{
					branch_id: localStorage.getItem('branch_id'),
					status_id: 1,
				},
			};

			const caly = this.calculation;

			const data = caly.filter(
				(x) =>
					x.business_type_id === data0.business_type_id.id &&
					x.down_payment_rate_id === data0.payment_type_id.id &&
					x.repayment_duration_id === data0.repayment_duration_id.id
			)[0];

			const { total, actualDownpayment, actualRepayment } =
				this.eightFormGroup.value.business_type_id.name.includes('Cash Loan') ||
				this.eightFormGroup.value.business_type_id.name.includes('Rentals')
					? cashLoan(this.productData.price, data0, data)
					: calculate(this.productData.price, data0, data);

			this.repaymentCircle = data0.repayment_cycle_id.value;
			this.rDuration = data0.repayment_duration_id.value;
			this.fPayment = actualDownpayment;
			this.rPayment =
				this.fourthFormGroup.value.saleType === 2
					? actualRepayment - 0.05 * actualRepayment
					: actualRepayment;
			this.pPrice = total;
			this.repayValue = data0.repayment_duration_id.name;
			this.downpayValue = data0.payment_type_id.percent;
			this.sixthFormGroup = this._formBuilder.group({
				repaymentPrice: [actualRepayment],
				totalPrice: [total],
				downPayment: [actualDownpayment],
			});
		} catch (e) {
			this.repaymentCircle = '0';
			this.rDuration = '0';
			this.fPayment = '0';
			this.rPayment = '0';
			this.pPrice = '0';
		}
	}
}
