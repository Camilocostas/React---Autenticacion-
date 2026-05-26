    // src/components/ActivarCuenta.jsx
    import { useEffect, useState } from 'react';
    import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
    import { activarUsuario } from '../services/api';

    function ActivarCuenta() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [estado, setEstado] = useState('cargando');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        if (!id || !token) {
        setEstado('error');
        setMensaje('Enlace de activación inválido. Faltan parámetros.');
        return;
        }
        activar();
    }, []);

    const activar = async () => {
        try {
        await activarUsuario(token, id);
        setEstado('exitoso');
        setMensaje('Tu cuenta ha sido activada correctamente. Ya puedes iniciar sesión.');
        } catch (err) {
        console.error('Error al activar cuenta:', err);
        setEstado('error');
        setMensaje('No se pudo activar la cuenta. El enlace puede haber expirado.');
        }
    };

    return (
        <div>
        <h2>Activación de cuenta</h2>
        {estado === 'cargando' && <p>Activando tu cuenta...</p>}
        {estado === 'exitoso' && <p style={{ color: 'green' }}>✅ {mensaje}</p>}
        {estado === 'error' && <p style={{ color: 'red' }}>❌ {mensaje}</p>}
        {estado !== 'cargando' && (
            <button onClick={() => navigate('/')}>Ir al Login</button>
        )}
        </div>
    );
    }

    export default ActivarCuenta;