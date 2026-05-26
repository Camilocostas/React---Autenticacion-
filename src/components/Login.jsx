    // src/components/Login.jsx
    import { useState } from 'react';
    import { login, registrarSesion } from '../services/api';
    import { decodificarToken } from '../utils/jwt';

    function Login({ setToken, setRole }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const iniciarSesion = async (e) => {
        e.preventDefault();
        setError('');

        try {
        const res = await login({ email, password });

        const token = res.data.accessToken;
        const role = res.data.user.role ?? 'user';

        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        // Decodificar token para obtener userId y registrar la sesión
        const decoded = decodificarToken(token);
        if (decoded?.sub) {
            // No bloqueamos el login si falla el registro de sesión
            registrarSesion(token, decoded.sub).catch((err) =>
            console.error('No se pudo registrar la sesión:', err)
            );
        }

        setToken(token);
        setRole(role);
        } catch (err) {
        console.error('Login fallido:', err);
        setError('Correo o contraseña incorrectos');
        }
    };

    return (
        <div>
        <h2>Login</h2>

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
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={iniciarSesion}>Ingresar</button>
        </div>
    );
    }

    export default Login;