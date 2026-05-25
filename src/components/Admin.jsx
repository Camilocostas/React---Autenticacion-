    // src/components/Admin.jsx
    import { useEffect, useState } from 'react';
    import { obtenerUsuarios, editarUsuario, eliminarUsuario } from '../services/api';

    function Admin({ token, onVolver }) {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [editandoId, setEditandoId] = useState(null);
    const [rolEditado, setRolEditado] = useState('');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        setCargando(true);
        setError('');
        try {
        const res = await obtenerUsuarios(token);
        setUsuarios(res.data);
        } catch (err) {
        console.error('Error cargando usuarios:', err);
        setError('No se pudieron cargar los usuarios.');
        } finally {
        setCargando(false);
        }
    };

    const handleEditarClick = (usuario) => {
        setEditandoId(usuario.id);
        setRolEditado(usuario.role ?? 'user');
        setMensaje('');
    };

    const handleGuardarEdicion = async (id) => {
        try {
        await editarUsuario(token, id, { role: rolEditado });
        setMensaje(`Usuario ${id} actualizado correctamente.`);
        setEditandoId(null);
        cargarUsuarios();
        } catch (err) {
        console.error('Error al editar:', err);
        setError('No se pudo editar el usuario.');
        }
    };

    const handleCancelarEdicion = () => {
        setEditandoId(null);
        setRolEditado('');
    };

    const handleEliminar = async (usuario) => {
        const confirmar = window.confirm(
        `¿Estás seguro de eliminar a ${usuario.email}?`
        );
        if (!confirmar) return;

        try {
        await eliminarUsuario(token, usuario.id);
        setMensaje(`Usuario ${usuario.email} eliminado.`);
        cargarUsuarios();
        } catch (err) {
        console.error('Error al eliminar:', err);
        setError('No se pudo eliminar el usuario.');
        }
    };

    if (cargando) return <p>Cargando usuarios...</p>;

    return (
        <div>
        <h2>Panel de Administración — Usuarios</h2>

        <button onClick={onVolver} style={{ marginBottom: '16px' }}>
            ← Volver a productos
        </button>

        {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <table border="1" cellPadding="8" cellSpacing="0">
            <thead>
            <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Activo</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.email}</td>
                <td>
                    {editandoId === usuario.id ? (
                    <select
                        value={rolEditado}
                        onChange={(e) => setRolEditado(e.target.value)}
                    >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                    </select>
                    ) : (
                    usuario.role ?? 'user'
                    )}
                </td>
                <td>{usuario.activo ? '✅' : '❌'}</td>
                <td>
                    {editandoId === usuario.id ? (
                    <>
                        <button onClick={() => handleGuardarEdicion(usuario.id)}>
                        Guardar
                        </button>
                        <button
                        onClick={handleCancelarEdicion}
                        style={{ marginLeft: '8px' }}
                        >
                        Cancelar
                        </button>
                    </>
                    ) : (
                    <>
                        <button onClick={() => handleEditarClick(usuario)}>
                        Editar
                        </button>
                        <button
                        onClick={() => handleEliminar(usuario)}
                        style={{ marginLeft: '8px', color: 'red' }}
                        >
                        Eliminar
                        </button>
                    </>
                    )}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
    }

    export default Admin;