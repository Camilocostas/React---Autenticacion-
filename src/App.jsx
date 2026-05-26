// src/App.jsx
import './App.css';
import { useState, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ProductoLista from './components/ProductoLista';
import Admin from './components/Admin';
import Dashboard from './components/Dashboard';
import Historial from './components/Historial';
import ActivarCuenta from './components/ActivarCuenta';
import useInactividad from './hooks/useInactividad';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [vistaAuth, setVistaAuth] = useState('login');
  const [vistaApp, setVistaApp] = useState('productos'); // 'productos'|'admin'|'dashboard'|'historial'
  const [mensajeLogout, setMensajeLogout] = useState('');
  const navigate = useNavigate();

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
    navigate('/');
  }, [navigate]);

  const handleInactividad = useCallback(() => {
    handleLogout(true);
  }, [handleLogout]);

  useInactividad(!!token, handleInactividad);

  return (
    <Routes>
      <Route path="/activar/:id" element={<ActivarCuenta />} />
      <Route
        path="/"
        element={
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
                    style={{ marginBottom: '12px', marginRight: '12px' }}
                  >
                    👥 Administrar usuarios
                  </button>
                )}

                {vistaApp !== 'dashboard' && (
                  <button
                    onClick={() => setVistaApp('dashboard')}
                    style={{ marginBottom: '12px', marginRight: '12px' }}
                  >
                    📊 Mi Dashboard
                  </button>
                )}

                {vistaApp !== 'historial' && (
                  <button
                    onClick={() => setVistaApp('historial')}
                    style={{ marginBottom: '12px' }}
                  >
                    🕐 Historial de sesiones
                  </button>
                )}

                {vistaApp === 'admin' && (
                  <Admin token={token} onVolver={() => setVistaApp('productos')} />
                )}
                {vistaApp === 'dashboard' && (
                  <Dashboard token={token} onVolver={() => setVistaApp('productos')} />
                )}
                {vistaApp === 'historial' && (
                  <Historial token={token} onVolver={() => setVistaApp('productos')} />
                )}
                {vistaApp === 'productos' && (
                  <ProductoLista token={token} role={role} />
                )}
              </>
            )}
          </div>
        }
      />
    </Routes>
  );
}

export default App;