    // src/components/Register.jsx
    import { useState } from 'react';
    import { register } from '../services/api';

    function Register({ onVolverLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const [datosActivacion, setDatosActivacion] = useState(null);

    const handleRegistro = async (e) => {
        e.preventDefault();
        setError('');
        setDatosActivacion(null);

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
        const res = await register({ email, password, role });
        const { accessToken, user } = res.data;
        setDatosActivacion({
            id: user.id,
            email: user.email,
            token: accessToken,
        });
        setEmail('');
        setPassword('');
        setRole('user');
        } catch (err) {
        console.error('Error en registro:', err);
        if (err.response?.status === 400) {
            setError('Este correo ya está registrado.');
        } else {
            setError('Error al registrar. Intenta de nuevo.');
        }
        } finally {
        setCargando(false);
        }
    };

    // Pantalla de éxito con enlace de activación
    if (datosActivacion) {
        return (
        <div>
            <h2>Registro exitoso</h2>
            <p style={{ color: 'green' }}>
            Usuario <strong>{datosActivacion.email}</strong> creado correctamente.
            </p>
            <p>Para activar tu cuenta haz clic en el siguiente enlace:</p>
            <a href={`/activar/${datosActivacion.id}?token=${datosActivacion.token}`}>
            ✅ Activar mi cuenta
            </a>
            <br /><br />
            <button onClick={onVolverLogin}>← Volver al Login</button>
        </div>
        );
    }

    return (
        <div>
        <h2>Registro de usuario</h2>

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
        <label>Rol: </label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
        </select>
        <br /><br />

        <button onClick={handleRegistro} disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrar'}
        </button>
        <br /><br />
        <button onClick={onVolverLogin}>← Volver al Login</button>
        </div>
    );
    }

    export default Register;