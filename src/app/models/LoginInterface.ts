export interface DecodedToken {
    cedula_rif: string;
    nombre: string;
    email: string;
    telefono: string;
    date_created: string;
    date_expires: string;
    usuario: 'aliado' | 'usuario'
  }
  