import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class JsonService {
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Authorization": "Bearer 815a93d1-f2ca-4589-b247-0dc416a89048"
    })
  }

  private jsonURL = "https://firebasestorage.googleapis.com/v0/b/formativa6.appspot.com/o/usuarios.json?alt=media&token=815a93d1-f2ca-4589-b247-0dc416a89048";

  private lista:any;

  constructor(private http:HttpClient) {}

  getJsonData(): Observable<any>{
    return this.http.get(this.jsonURL)
  }

  metodoPersona(listaPersonas:any){
    console.log(listaPersonas);
    this.http.post(this.jsonURL, listaPersonas, this.httpOptions).subscribe(
      response => {
        console.log('Archivo JSON sobreescrito con exito', response);
      },
      error => {
        console.error("Error al sobreescribir el archivo JSON", error);
      })
  }
}

