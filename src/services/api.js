    // src/services/api.js
    import axios from 'axios';

    const API_URL = 'http://localhost:3000';

    const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    });

    // LOGIN
    export const login = async (credentials) => {
    try {
        const response = await apiClient.post('/login', {
        email: credentials.email,
        password: credentials.password,
        });
        return response;
    } catch (error) {
        console.error('Error en login:', error);
        throw error;
    }
    };

    // REGISTER
    export const register = async (userData) => {
    try {
        const response = await apiClient.post('/register', {
        email: userData.email,
        password: userData.password,
        role: userData.role,
        activo: false,
        });
        return response;
    } catch (error) {
        console.error('Error en register:', error);
        throw error;
    }
    };

    // OBTENER PRODUCTOS (requiere token)
    export const obtenerProductos = async (token) => {
    try {
        const response = await apiClient.get('/productos', {
        headers: { Authorization: `Bearer ${token}` },
        });
        return response;
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
    }
    };

    // OBTENER USUARIOS (requiere token admin)
    export const obtenerUsuarios = async (token) => {
    try {
        const response = await apiClient.get('/users', {
        headers: { Authorization: `Bearer ${token}` },
        });
        return response;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
    };

    // EDITAR USUARIO (requiere token)
    export const editarUsuario = async (token, id, datos) => {
    try {
        const response = await apiClient.patch(`/users/${id}`, datos, {
        headers: { Authorization: `Bearer ${token}` },
        });
        return response;
    } catch (error) {
        console.error('Error al editar usuario:', error);
        throw error;
    }
    };

    // ELIMINAR USUARIO (requiere token)
    export const eliminarUsuario = async (token, id) => {
    try {
        const response = await apiClient.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        return response;
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        throw error;
    }
    };

    // ACTIVAR CUENTA
    export const activarUsuario = async (token, id) => {
    try {
        const response = await apiClient.patch(
        `/users/${id}`,
        { activo: true },
        { headers: { Authorization: `Bearer ${token}` } }
        );
        return response;
    } catch (error) {
        console.error('Error al activar cuenta:', error);
        throw error;
    }
    };

    // OBTENER DASHBOARD (requiere token)
    export const obtenerDashboard = async (token, userId) => {
    try {
        const response = await apiClient.get(`/dashboard?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        return response;
    } catch (error) {
        console.error('Error al obtener dashboard:', error);
        throw error;
    }
    };

    // REGISTRAR SESIÓN (requiere token)
    export const registrarSesion = async (token, userId) => {
    try {
        const response = await apiClient.post(
        '/sesiones',
        {
            userId: userId,
            timestamp: new Date().toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
        );
        return response;
    } catch (error) {
        console.error('Error al registrar sesión:', error);
        throw error;
    }
    };

    // OBTENER SESIONES (requiere token)
    export const obtenerSesiones = async (token, userId) => {
    try {
        const response = await apiClient.get(`/sesiones?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        return response;
    } catch (error) {
        console.error('Error al obtener sesiones:', error);
        throw error;
    }
    };

    // LOGOUT
    export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    };