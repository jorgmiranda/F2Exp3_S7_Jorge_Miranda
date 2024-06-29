import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors, ValidatorFn, AbstractControl  } from '@angular/forms'; 

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {

  registrationForm!: FormGroup;

  constructor (private fb: FormBuilder) {}

  ngOnInit(): void{
    this.registrationForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      correoUsuario: ['', [Validators.required, Validators.email]],
      fechaNacimientoUsuario: ['', [Validators.required, this.validarEdad.bind(this)]],
      contrasenaUsuario1: ['', [Validators.required, this.validarContrasenaFormato()]],
      contrasenaUsuario2:['', Validators.required],
      direccionDespacho: ''
    },{
      validators: this.validarContrasenasIguales
    })
  }



  registrarUsuario(): void {
    if(this.registrationForm.valid){
      console.log("Resultado: "+ this.registrationForm.get('nombreCompleto')!.value);
    }else{
      alert('Favor de ingregar los campos obligatorios')
    }
   
  }

  // Validador personalizado para verificar edad mínima
  validarEdad(control: { value: string }): { [key: string]: boolean } | null {
    if (control.value) {
      const fechaNacimiento = new Date(control.value);
      const edad = this.calcularEdad(fechaNacimiento);
      if (edad < 13) { // Ejemplo: verificar que la persona sea mayor de 13 años
        return { menorDeEdad: true };
      }
    }
    return null;
  } 

  calcularEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      return edad - 1;
    }
    return edad;
  }


  //Validar que las contraseñas sean las mismas
  validarContrasenasIguales(formGroup: FormGroup): { [key: string]: any } | null {
    const contrasena1 = formGroup.get('contrasenaUsuario1')?.value;
    const contrasena2 = formGroup.get('contrasenaUsuario2')?.value;

    return contrasena1 === contrasena2 ? null : { contrasenasNoCoinciden: true };
  }

  //Validar que tenga una mayuscula y un numero
  validarContrasenaFormato(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Si no hay valor, no se aplica la validación
      }

      const regex = /^(?=.*[0-9])(?=.*[A-Z]).{6,18}$/;
      const isValid = regex.test(control.value);

      return isValid ? null : { contrasenaInvalida: true };
    };
  }


  limpiarFormulario(): void {
    this.registrationForm.reset();
   
  }


}
