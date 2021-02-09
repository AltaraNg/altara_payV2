import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { RegisterPage } from '../register/register.page';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { LoaderService } from 'src/app/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private ionLoader: LoaderService

  ) { }


  ionViewWillEnter() {
    this.authService.getToken().then(() => {
      if (this.authService.isLoggedIn) {
        this.navCtrl.navigateRoot('/dashboard');
      }
    });
  }

  ngOnInit() {
  }

  // Dismiss Login Modal
  // dismissLogin() {
  //   this.modalController.dismiss();
  // }

  // // On Register button tap, dismiss login modal and open register modal
  // async registerModal() {
  //   this.dismissLogin();
  //   const registerModal = await this.modalController.create({
  //     component: RegisterPage
  //   });
  //   return await registerModal.present();
  // }

  login(form: NgForm) {
    if (form.value.email === "" || form.value.password === "") {
      return this.alertService.presentToast("Kindly enter your login details.");
    }
    this.ionLoader.showLoader();
    this.authService.login(form.value.email, form.value.password).subscribe(
      data => {
        this.ionLoader.hideLoader();
        this.alertService.presentToast("Logged In");
        this.navCtrl.navigateRoot('/dashboard');
      },
      error => {
        this.ionLoader.hideLoader();
        this.alertService.presentToast("Wrong Credentials");

        console.error('===> error <=== ', error);
      }
    );
  }


}
