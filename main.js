// ===== MENÚ HAMBURGUESA =====
const botonHamburguesa = document.getElementById('botonHamburguesa');
const menuNav = document.getElementById('menuNav');

function cerrarMenu() {
    menuNav.classList.remove('abierto');
    botonHamburguesa.setAttribute('aria-expanded', 'false');
    botonHamburguesa.setAttribute('aria-label', 'Abrir menú');
    botonHamburguesa.textContent = '☰';
}

if (botonHamburguesa && menuNav) {
    botonHamburguesa.addEventListener('click', () => {
        const abierto = menuNav.classList.toggle('abierto');
        botonHamburguesa.setAttribute('aria-expanded', abierto);
        botonHamburguesa.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
        botonHamburguesa.textContent = abierto ? '✕' : '☰';
    });

    // Cierra el menú al elegir un enlace
    menuNav.querySelectorAll('a').forEach(enlace => {
        enlace.addEventListener('click', cerrarMenu);
    });

    // Cierra el menú si se agranda la pantalla
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) cerrarMenu();
    });
}

// ===== VALIDACIÓN DEL FORMULARIO DE CONTACTO =====
const formulario = document.querySelector('.formulario-contacto');

if (formulario) {
    const campoNombre = document.getElementById('nombre');
    const campoCorreo = document.getElementById('correo');
    const campoTelefono = document.getElementById('telefono');
    const campoMotivo = document.getElementById('motivo');
    const campoMensaje = document.getElementById('mensaje');
    const campos = [campoNombre, campoCorreo, campoTelefono, campoMotivo, campoMensaje];

    // Crea un <span> de error debajo de cada campo
    campos.forEach(campo => {
        const span = document.createElement('span');
        span.className = 'mensaje-error';
        span.id = 'error-' + campo.id;
        span.setAttribute('role', 'alert');
        campo.insertAdjacentElement('afterend', span);
        campo.setAttribute('aria-describedby', span.id);
    });

    // Caja de mensaje de éxito
    const cajaExito = document.createElement('p');
    cajaExito.className = 'mensaje-exito';
    cajaExito.setAttribute('role', 'status');
    cajaExito.hidden = true;
    formulario.appendChild(cajaExito);

    function mostrarError(campo, texto) {
        campo.classList.add('campo-error');
        campo.classList.remove('campo-valido');
        campo.setAttribute('aria-invalid', 'true');
        document.getElementById('error-' + campo.id).textContent = texto;
    }

    function mostrarValido(campo) {
        campo.classList.remove('campo-error');
        campo.classList.add('campo-valido');
        campo.setAttribute('aria-invalid', 'false');
        document.getElementById('error-' + campo.id).textContent = '';
    }

    // Cada función regresa true si el campo es válido
    function validarNombre() {
        const valor = campoNombre.value.trim();
        if (valor === '') return mostrarError(campoNombre, 'El nombre es obligatorio.'), false;
        if (valor.length < 3) return mostrarError(campoNombre, 'Escribe al menos 3 caracteres.'), false;
        if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.'-]+$/.test(valor))
            return mostrarError(campoNombre, 'El nombre solo puede tener letras y espacios.'), false;
        mostrarValido(campoNombre);
        return true;
    }

    function validarCorreo() {
        const valor = campoCorreo.value.trim();
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (valor === '') return mostrarError(campoCorreo, 'El correo es obligatorio.'), false;
        if (!regexCorreo.test(valor))
            return mostrarError(campoCorreo, 'Escribe un correo válido, ej. nombre@correo.com'), false;
        mostrarValido(campoCorreo);
        return true;
    }

    function validarTelefono() {
        // Acepta espacios o guiones, pero revisa que sean 10 dígitos
        const valor = campoTelefono.value.replace(/[\s-]/g, '');
        if (valor === '') return mostrarError(campoTelefono, 'El teléfono es obligatorio.'), false;
        if (!/^\d{10}$/.test(valor))
            return mostrarError(campoTelefono, 'Ingresa un número de exactamente 10 dígitos (solo números).'), false;
        mostrarValido(campoTelefono);
        return true;
    }

    function validarMotivo() {
        if (campoMotivo.value === '')
            return mostrarError(campoMotivo, 'Selecciona un motivo de consulta.'), false;
        mostrarValido(campoMotivo);
        return true;
    }

    function validarMensaje() {
        const valor = campoMensaje.value.trim();
        if (valor === '') return mostrarError(campoMensaje, 'El mensaje es obligatorio.'), false;
        if (valor.length < 10)
            return mostrarError(campoMensaje, 'Cuéntanos un poco más (mínimo 10 caracteres).'), false;
        mostrarValido(campoMensaje);
        return true;
    }

    // Validación en tiempo real al salir de cada campo
    campoNombre.addEventListener('blur', validarNombre);
    campoCorreo.addEventListener('blur', validarCorreo);
    campoTelefono.addEventListener('blur', validarTelefono);
    campoMotivo.addEventListener('change', validarMotivo);
    campoMotivo.addEventListener('blur', validarMotivo);
    campoMensaje.addEventListener('blur', validarMensaje);

    // Si ya hay error, se corrige mientras el usuario escribe
    [campoNombre, campoCorreo, campoTelefono, campoMensaje].forEach(campo => {
        campo.addEventListener('input', () => {
            cajaExito.hidden = true;
            if (campo.classList.contains('campo-error')) {
                ({ nombre: validarNombre, correo: validarCorreo,
                   telefono: validarTelefono, mensaje: validarMensaje })[campo.id]();
            }
        });
    });

    // Envío
    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();

        // Se ejecutan todas (sin cortar) para mostrar todos los errores juntos
        const resultados = [
            validarNombre(), validarCorreo(), validarTelefono(),
            validarMotivo(), validarMensaje()
        ];

        if (resultados.includes(false)) {
            cajaExito.hidden = true;
            // Lleva el cursor al primer campo con error
            formulario.querySelector('.campo-error').focus();
            return;
        }

        cajaExito.textContent = '✅ ¡Gracias, ' + campoNombre.value.trim() +
            '! Tu mensaje fue enviado correctamente. Te responderemos pronto.';
        cajaExito.hidden = false;
        formulario.reset();
        campos.forEach(c => {
            c.classList.remove('campo-valido', 'campo-error');
            c.removeAttribute('aria-invalid');
        });
    });
}