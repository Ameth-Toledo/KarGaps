export interface User {
    id?: number;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    email: string;
    password_hash?: string;
    rol_id: number;
    avatar?: string | number;
    fecha_registro?: Date | string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    data: {
        token: string;
        userId: number;
        email: string;
        name: string;
    };
}

export interface UserData {
    token: string;
    userId: number;
    email: string;
    name: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
}