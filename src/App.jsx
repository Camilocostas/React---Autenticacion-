// src/App.jsx
import './App.css';
import { useState, useCallback } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ProductoLista from './components/ProductoLista';
import Admin from './components/Admin';
import useInactividad from './hooks/useInactividad';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [vistaAuth, setVistaAuth] = useState('login');
  const [vistaApp, setVistaApp] = useState('productos'); // 'productos' | 'admin'
  const [mensajeLogout, setMensajeLogout] = useState('');

  const handleLogout = useCallback((porInactividad = false) => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    setVistaAuth('login');
    setVistaApp('productos');
    if (porInactividad) {
      setMensajeLogout('Tu sesión se cerró por inactividad. Por favor inicia sesión de nuevo.');
    } else {
      setMensajeLogout('');
    }
  }, []);

  const handleInactividad = useCallback(() => {
    handleLogout(true);
  }, [handleLogout]);

  useInactividad(!!token, handleInactividad);

  return (
    <div>
      <h1>Bienvenido a la tienda online</h1>

      {!token ? (
        <>
          {mensajeLogout && (
            <p style={{ color: 'orange', fontWeight: 'bold' }}>
              ⚠️ {mensajeLogout}
            </p>
          )}
          {vistaAuth === 'login' ? (
            <>
              <Login setToken={setToken} setRole={setRole} />
              <br />
              <button onClick={() => setVistaAuth('register')}>
                ¿No tienes cuenta? Regístrate
              </button>
            </>
          ) : (
            <Register onVolverLogin={() => setVistaAuth('login')} />
          )}
        </>
      ) : (
        <>
          <p>Rol actual: <strong>{role}</strong></p>

          <button
            onClick={() => handleLogout(false)}
            style={{ marginBottom: '12px', marginRight: '12px' }}
          >
            Cerrar sesión
          </button>

          {role === 'admin' && vistaApp !== 'admin' && (
            <button
              onClick={() => setVistaApp('admin')}
              style={{ marginBottom: '12px' }}
            >
              👥 Administrar usuarios
            </button>
          )}

          {vistaApp === 'admin' ? (
            <Admin token={token} onVolver={() => setVistaApp('productos')} />
          ) : (
            <ProductoLista token={token} role={role} />
          )}
        </>
      )}
    </div>
  );
}

export default App;