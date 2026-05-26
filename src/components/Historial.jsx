    // src/components/Historial.jsx
    import { useEffect, useState } from 'react';
    import { obtenerSesiones } from '../services/api';
    import { decodificarToken } from '../utils/jwt';

    function Historial({ token, onVolver }) {
    const [sesiones, setSesiones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const decoded = decodificarToken(token);

        if (!decoded?.sub) {
        setError('No se pudo identificar al usuario.');
        setCargando(false);
        return;
        }

        setUserId(decoded.sub);
        cargarSesiones(decoded.sub);
    }, [token]);

    const cargarSesiones = async (id) => {
        setCargando(true);
        setError('');
        try {
        const res = await obtenerSesiones(token, id);
        // Ordenar de más reciente a más antigua
        const ordenadas = res.data.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setSesiones(ordenadas);
        } catch (err) {
        console.error('Error cargando sesiones:', err);
        setError('No se pudo cargar el historial de sesiones.');
        } finally {
        setCargando(false);
        }
    };

    const formatearFecha = (isoString) => {
        const fecha = new Date(isoString);
        return fecha.toLocaleString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        });
    };

    if (cargando) return <p>Cargando historial...</p>;

    return (
        <div>
        <h2>Historial de sesiones</h2>

        <button onClick={onVolver} style={{ marginBottom: '16px' }}>
            ← Volver a productos
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {sesiones.length === 0 ? (
            <p>No hay sesiones registradas.</p>
        ) : (
            <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
                <tr>
                <th>#</th>
                <th>Usuario ID</th>
                <th>Fecha y hora</th>
                </tr>
            </thead>
            <tbody>
                {sesiones.map((sesion, index) => (
                <tr key={sesion.id}>
                    <td>{index + 1}</td>
                    <td>{sesion.userId}</td>
                    <td>{formatearFecha(sesion.timestamp)}</td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </div>
    );
    }

    export default Historial;