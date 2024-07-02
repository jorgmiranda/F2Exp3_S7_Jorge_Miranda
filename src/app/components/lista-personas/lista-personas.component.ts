import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonService } from '../../services/json.service';
import { HttpClientModule } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { Usuario } from '../../model/usuario';

declare var bootstrap: any;

@Component({
  selector: 'app-lista-personas',
  standalone: true,
  imports: [NavbarComponent, HttpClientModule, CommonModule, ReactiveFormsModule],
  templateUrl: './lista-personas.component.html',
  styleUrl: './lista-personas.component.scss',
  providers: [JsonService]
})
export class ListaPersonasComponent implements OnInit{
  personas: any[] = [];
  //Atributos del modal
  modalTitle: string = '';
  modalInstance: any;
  //fomulario
  mantenedorForm!: FormGroup;
  //id de edición
  editingId: number | null = null;

  constructor(private jsonService: JsonService, private fb: FormBuilder) {}

  ngOnInit(): void {
      this.jsonService.getJsonData().subscribe(data => {
        this.personas = data;
      })
      this.inicializarFormulario();
      this.modalInstance = new bootstrap.Modal(document.getElementById('personaModal'));
  }

  inicializarFormulario() {
    this.mantenedorForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      correoUsuario: ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', [Validators.required, this.validarEdad.bind(this)]],
      contrasenaUsuario1: ['', [Validators.required, this.validarContrasenaFormato()]],
      contrasenaUsuario2: ['', Validators.required],
      direccionDespacho: ['']
    }, {
      validators: this.validarContrasenasIguales
    });
  }

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

  validarContrasenasIguales(formGroup: FormGroup): { [key: string]: any } | null {
    const contrasena1 = formGroup.get('contrasenaUsuario1')?.value;
    const contrasena2 = formGroup.get('contrasenaUsuario2')?.value;
    return contrasena1 === contrasena2 ? null : { contrasenasNoCoinciden: true };
  }

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

  //Logica Modal
  abrirModal(persona?: Usuario): void {
    if (persona) {
      this.modalTitle = 'Modificar Persona';
      console.log(persona.fechaNacimiento);
      this.mantenedorForm.patchValue(persona);
      this.editingId = persona.id;
      
    } else {
      this.modalTitle = 'Agregar Persona';
      this.mantenedorForm.reset();
      this.editingId = null;
    }
    this.modalInstance.show();
  }

  submitForm(): void {
    if (this.mantenedorForm.valid) {
      const persona = this.mantenedorForm.value;
      if (this.editingId !== null) {
        // Lógica para actualizar la persona
        const usuarioActualizado: Usuario = {
          id: this.editingId!,
          nombreCompleto: this.mantenedorForm.get('nombreCompleto')?.value,
          nombreUsuario: this.mantenedorForm.get('nombreUsuario')?.value,
          correoUsuario: this.mantenedorForm.get('correoUsuario')?.value,
          fechaNacimiento: this.mantenedorForm.get('fechaNacimiento')?.value,
          contrasena: this.mantenedorForm.get('contrasenaUsuario1')?.value,
          direccionDespacho: this.mantenedorForm.get('direccionDespacho')?.value,
          sesionIniciada: false
        };
         // Actualiza la lista de usuarios
        this.personas = this.personas.map(u => u.id === this.editingId ? usuarioActualizado : u);
        this.jsonService.metodoPersona(this.personas);
      } else {
        // Lógica para agregar nueva persona
        const nuevoUsuario: Usuario = {
          id: this.personas.length > 0 ? Math.max(...this.personas.map((p: any) => p.id)) + 1 : 1,
          nombreCompleto: this.mantenedorForm.get('nombreCompleto')?.value,
          nombreUsuario: this.mantenedorForm.get('nombreUsuario')?.value,
          contrasena: this.mantenedorForm.get('contrasenaUsuario1')?.value,
          correoUsuario: this.mantenedorForm.get('correoUsuario')?.value,
          fechaNacimiento: this.mantenedorForm.get('fechaNacimiento')?.value,
          direccionDespacho: this.mantenedorForm.get('direccionDespacho')?.value,
          sesionIniciada: false
        }
        this.personas.push(nuevoUsuario);
        this.jsonService.metodoPersona(this.personas);
      }
      
      this.modalInstance.hide();
    } else {
      alert('Favor de ingresar los campos obligatorios');
    }
  }

  //Logia eliminar
  eliminar(persona: any): void {
    const index = this.personas.findIndex((elemento: any) => elemento.id === persona.id);
    
    if (index !== -1) {
      this.personas.splice(index, 1);
      this.jsonService.metodoPersona(this.personas);
    } else {
      window.alert('El elemento de la lista no existe');
    }
  }
}
