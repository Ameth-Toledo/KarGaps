export interface Gorra {
    id?: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    color: string;
    imagen_url: string;
    fecha_creacion?: Date;
    fecha_actualizacion?: Date;
}