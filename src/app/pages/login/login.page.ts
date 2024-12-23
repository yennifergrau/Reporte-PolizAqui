import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../../models/LoginInterface'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  title: string = 'Iniciar sesión';
  subtitle: string = 'Olvidaste tu contraseña';
  formLogin!: FormGroup;
  passwordFieldType: string = 'password'; 
  passwordIcon: string = 'eye-off'; 
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
    private toastController: ToastController
  ) {
    this.formulario();
  }

  ngOnInit() {}

  formulario(): void {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get emailControl(): AbstractControl {
    return this.formLogin.get('email')!;
  }

  get passwordControl(): AbstractControl {
    return this.formLogin.get('password')!;
  }

  togglePasswordVisibility() {
    if (this.passwordFieldType === 'password') {
      this.passwordFieldType = 'text';
      this.passwordIcon = 'eye';
    } else {
      this.passwordFieldType = 'password';
      this.passwordIcon = 'eye-off';
    }
  }

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color
    });
    await toast.present();
  }

  RoutingNavigate() {
    this.navCtrl.navigateRoot(['forgot']);
  }

  async Submit() {
    if (this.formLogin.valid) {
      this.loading = true;
  
      const { email, password } = this.formLogin.value;
      this.authService.login(email, password).subscribe(
        (res: any) => {
          console.log(res);
          
          this.loading = false;
          if (res.code === 200) {
            this.presentToast('Inicio exitoso...', 'success');
            const decodedToken: DecodedToken = jwtDecode(res.token);
  
            localStorage.setItem('currentUser', JSON.stringify(decodedToken));
            this.navCtrl.navigateRoot(['report']);
        
          }
        },
        (error) => {
          this.loading = false;
          this.presentToast('Credenciales inválidas', 'danger');
        }
      );
    } else {
      this.presentToast('Completa los campos', 'danger');
    }
  }
  

}
