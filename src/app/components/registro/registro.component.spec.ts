import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { RegistroComponent } from './registro.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;

    // Mock de ActivatedRoute
    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => 'registro' 
        }
      }
    };
  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroComponent, ReactiveFormsModule, NavbarComponent, CommonModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deberia inicializar el formulario correctamente', () =>{
    expect(component.registrationForm.valid).toBeFalsy();
  });

  it('should validate password format', () => {
    const control = component.registrationForm.get('contrasenaUsuario1');
    control?.setValue('ValidPassword1'); // Contraseña válida según el regex
    expect(control?.valid).toBeTruthy();

    control?.setValue('invalidpassword'); // Contraseña inválida según el regex
    expect(control?.valid).toBeFalsy();
    expect(control?.errors?.['contrasenaInvalida']).toBeTruthy();
  });

});
