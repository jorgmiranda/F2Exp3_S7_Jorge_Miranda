export interface Usuario {
    id: number;
    /**
     * Nombre completo del usuario
     * @example "Jorge Miranda"
     */
    nombreCompleto: string;
    /**
     * Nombre de usuario, variable utilizada para inciar sesión
     * @example "jorg.sanchezm"
     */
    nombreUsuario: string;
    /**
     * Correo del usuario
     * @example "jorge.miranda@gmail.com"
     */
    correoUsuario: string;
    /**
     * Dirección de despacho del usuario
     * @example "Calle 123, Ciudad, Santiago"
     */
    direccionDespacho: string;
    /**
     * Contraseña del usuario
     * @example "1234.Pass"
     */
    contrasena: string;
    /**
     * Fecha de nacimiento del usuario
     * @example "12-03-1997"
     */
    fechaNacimiento: string;
    /** 
     * Indicador si el usuario tiene la sesión iniciada.
    */
    sesionIniciada: boolean;
}
