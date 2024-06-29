import { RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './components/productos/productos.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { RegistroComponent } from './components/registro/registro.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {path: 'inicio', component: InicioComponent},
    {path: 'producto/:seccion', component: ProductosComponent},
    {path: 'registro', component: RegistroComponent},
    //Pagina de inicio
    {path: '**', redirectTo: 'inicio'}

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
