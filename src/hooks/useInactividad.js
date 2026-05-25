    // src/hooks/useInactividad.js
    import { useEffect, useRef } from 'react';

    // Tiempo en milisegundos (5 minutos = 300000)
    // Usamos 2 minutos (120000) para poder probarlo más fácil
    const TIEMPO_INACTIVIDAD = 2 * 60 * 1000;
    //const TIEMPO_INACTIVIDAD = 10 * 1000; // 10 segundos para prueba

    // Eventos que se consideran "actividad del usuario"
    const EVENTOS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    function useInactividad(activo, onInactividad) {
    const temporizadorRef = useRef(null);

    useEffect(() => {
        // Solo ejecutar si el usuario está autenticado
        if (!activo) return;

        const reiniciarTemporizador = () => {
        // Cancelar el temporizador anterior
        if (temporizadorRef.current) {
            clearTimeout(temporizadorRef.current);
        }

        // Iniciar nuevo temporizador
        temporizadorRef.current = setTimeout(() => {
            onInactividad();
        }, TIEMPO_INACTIVIDAD);
        };

        // Registrar todos los eventos de actividad
        EVENTOS.forEach((evento) => {
        window.addEventListener(evento, reiniciarTemporizador);
        });

        // Iniciar el temporizador al montar
        reiniciarTemporizador();

        // Limpieza al desmontar o cuando el usuario cierra sesión
        return () => {
        if (temporizadorRef.current) {
            clearTimeout(temporizadorRef.current);
        }
        EVENTOS.forEach((evento) => {
            window.removeEventListener(evento, reiniciarTemporizador);
        });
        };
    }, [activo, onInactividad]);
    }

    export default useInactividad;