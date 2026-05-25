    // src/components/Register.jsx
    import { useState } from 'react';
    import { register } from '../services/api';

    function Register({ onVolverLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleRegistro = async (e) => {
        e.preventDefault();
        setMensaje('');
        setError('');

        // Validación básica
        if (!email || !password) {
        setError('El correo y la contraseña son obligatorios.');
        return;
        }

        if (password.length < 4) {
        setError('La contraseña debe tener al menos 4 caracteres.');
        return;
        }

        setCargando(true);

        try {
        await register({ email, password, role });
        setMensaje(`Usuario ${email} registrado correctamente. Ahora puedes iniciar sesión.`);
        // Limpiar formulario
        setEmail('');
        setPassword('');
        setRole('user');
        } catch (err) {
        console.error('Error en registro:', err);

        // json-server-auth devuelve 400 si el correo ya existe
        if (err.response?.status === 400) {
            setError('Este correo ya está registrado.');
        } else {
            setError('Error al registrar. Intenta de nuevo.');
        }
        } finally {
        setCargando(false);
        }
    };

    return (
        <div>
        <h2>Registro de usuario</h2>

        {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <br />

        <input
            type="password"
            placeholder="Contraseña (mínimo 4 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <br />

        <label>Rol:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
        </select>
        <br /><br />

        <button onClick={handleRegistro} disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrar'}
        </button>

        <br /><br />

        <button onClick={onVolverLogin}>
            ← Volver al Login
        </button>
        </div>
    );
    }

    export default Register;