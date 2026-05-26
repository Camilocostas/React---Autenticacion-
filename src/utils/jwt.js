// src/utils/jwt.js
// Decodifica el payload de un JWT sin verificar la firma
// Solo para uso en frontend — nunca usar para validar seguridad
export function decodificarToken(token) {
    try {
    // El JWT tiene 3 partes separadas por puntos: header.payload.signature
    const payload = token.split('.')[1];

    // El payload está en Base64URL — reemplazamos caracteres para usar atob()
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

    // Decodificamos y parseamos el JSON
    const decoded = JSON.parse(atob(base64));
    return decoded;
    } catch (err) {
    console.error('Error al decodificar token:', err);
    return null;
    }
}