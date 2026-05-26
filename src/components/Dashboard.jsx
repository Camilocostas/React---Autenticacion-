    // src/components/Dashboard.jsx
    import { useEffect, useState } from 'react';
    import { obtenerDashboard } from '../services/api';
    import { decodificarToken } from '../utils/jwt';

    function Dashboard({ token, onVolver }) {
    const [datos, setDatos] = useState(null);
    const [userId, setUserId] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Decodificar el token para obtener el userId
        const decoded = decodificarToken(token);

        if (!decoded || !decoded.sub) {
        setError('No se pudo identificar al usuario desde el token.');
        setCargando(false);
        return;
        }

        setUserId(decoded.sub);
        cargarDashboard(decoded.sub);
    }, [token]);

    const cargarDashboard = async (id) => {
        setCargando(true);
        setError('');
        try {
        const res = await obtenerDashboard(token, id);

        if (res.data.length === 0) {
            setError('No hay datos de dashboard para este usuario.');
            return;
        }

        // El endpoint devuelve un array — tomamos el primer resultado
        setDatos(res.data[0]);
        } catch (err) {
        console.error('Error cargando dashboard:', err);
        setError('No se pudo cargar el dashboard.');
        } finally {
        setCargando(false);
        }
    };

    if (cargando) return <p>Cargando dashboard...</p>;

    return (
        <div>
        <h2>Mi Dashboard</h2>

        <button onClick={onVolver} style={{ marginBottom: '16px' }}>
            ← Volver a productos
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {datos && (
            <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
            <p><strong>ID de usuario:</strong> {userId}</p>
            <p><strong>Total de compras:</strong> {datos.totalCompras}</p>
            <p><strong>Última conexión:</strong> {datos.ultimaConexion}</p>
            <p><strong>Productos favoritos:</strong></p>
            <ul>
                {datos.productosFavoritos.map((p, i) => (
                <li key={i}>{p}</li>
                ))}
            </ul>
            </div>
        )}
        </div>
    );
    }

    export default Dashboard;