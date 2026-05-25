    // src/components/ProductoLista.jsx
    import { useEffect, useState } from 'react';
    import { obtenerProductos } from '../services/api';

    function ProductoLista({ token, role }) {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarProductos();
    }, [token]);

    const cargarProductos = async () => {
        setCargando(true);
        setError('');
        try {
        const res = await obtenerProductos(token);
        setProductos(res.data);
        } catch (err) {
        console.error('Error cargando productos:', err);
        setError('No se pudieron cargar los productos.');
        if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.reload();
        }
        } finally {
        setCargando(false);
        }
    };

    const handleEditar = (producto) => {
        alert(`Editar: ${producto.nombre}`);
    };

    const handleEliminar = (producto) => {
        alert(`Eliminar: ${producto.nombre}`);
    };

    if (cargando) return <p>Cargando productos...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
        <h2>Lista de Productos</h2>
        {productos.map((producto) => (
            <div
            key={producto.id}
            style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}
            >
            <p>
                <strong>{producto.nombre}</strong> — ${producto.precio}
            </p>

            {role === 'admin' && (
                <div>
                <button onClick={() => handleEditar(producto)}>
                    Editar
                </button>
                <button
                    onClick={() => handleEliminar(producto)}
                    style={{ marginLeft: '8px', color: 'red' }}
                >
                    Eliminar
                </button>
                </div>
            )}
            </div>
        ))}
        </div>
    );
    }

    export default ProductoLista;