export interface Playera {
    id?: number
    nombre: string
    descripcion: string
    precio: number
    stock: number
    color: string
    talla: string
    tipo: string
    material: string
    imagen_url: string
    fecha_creacion?: Date;
    fecha_actualizacion?: Date;
}
