document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtención de Elementos del DOM
    const inputNombre = document.getElementById('nombre');
    const inputEmail = document.getElementById('email');
    const inputEdad = document.getElementById('edad');
    
    const errorNombre = document.getElementById('error-nombre');
    const errorEmail = document.getElementById('error-email');
    const errorEdad = document.getElementById('error-edad');

    const btnGuardar = document.getElementById('btnGuardar');
    const btnVerDatos = document.getElementById('btnVerDatos');
    const btnLimpiarFormulario = document.getElementById('btnLimpiarFormulario');
    const btnBorrarDatos = document.getElementById('btnBorrarDatos');

    const seccionResultado = document.querySelector('.resultado'); // La sección completa de resultados
    const resNombre = document.getElementById('res-nombre');
    const resEmail = document.getElementById('res-email');
    const resEdad = document.getElementById('res-edad');

    // 2. Funciones de Validación
    
    // Función de validación de Email simple
    const validarEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validarCampos = () => {
        let esValido = true;
        
        // Limpiar errores previos
        errorNombre.textContent = '';
        errorEmail.textContent = '';
        errorEdad.textContent = '';

        // Validar Nombre
        if (inputNombre.value.trim() === '') {
            errorNombre.textContent = 'El nombre es obligatorio.';
            esValido = false;
        }

        // Validar Email
        if (inputEmail.value.trim() === '') {
            errorEmail.textContent = 'El email es obligatorio.';
            esValido = false;
        } else if (!validarEmail(inputEmail.value.trim())) {
            errorEmail.textContent = 'El formato del email no es válido.';
            esValido = false;
        }

        // Validar Edad
        const edad = parseInt(inputEdad.value.trim());
        if (isNaN(edad) || edad <= 0) {
            errorEdad.textContent = 'La edad es obligatoria y debe ser un número positivo.';
            esValido = false;
        }

        return esValido;
    };

    // 3. Funciones de LocalStorage y Lógica
    
    const guardarDatos = () => {
        // Ocultar la sección de resultados si está visible
        seccionResultado.classList.add('hidden'); 

        if (validarCampos()) {
            const usuario = {
                nombre: inputNombre.value.trim(),
                email: inputEmail.value.trim(),
                edad: parseInt(inputEdad.value.trim())
            };

            localStorage.setItem('usuarioData', JSON.stringify(usuario));
            
            alert('✅ Datos guardados correctamente en LocalStorage.');
            limpiarFormulario();
            // No llamar a mostrarDatos aquí, solo se mostrará al hacer clic en "Ver Datos"
        } else {
            alert('❌ Por favor, corrige los errores en el formulario.');
        }
    };

    const mostrarDatos = () => {
        const dataString = localStorage.getItem('usuarioData');

        if (dataString) {
            const usuario = JSON.parse(dataString);

            resNombre.textContent = usuario.nombre || 'N/A';
            resEmail.textContent = usuario.email || 'N/A';
            resEdad.textContent = usuario.edad || 'N/A';
            
            seccionResultado.classList.remove('hidden'); // Mostrar la sección de resultados
            alert('Datos tomados del LocalStorage y mostrados.');
        } else {
            resNombre.textContent = 'No hay datos guardados';
            resEmail.textContent = 'No hay datos guardados';
            resEdad.textContent = 'No hay datos guardados';
            seccionResultado.classList.remove('hidden'); // Mostrar la sección con el mensaje de "No hay datos"
            alert('No se encontraron datos de usuario en LocalStorage.');
        }
    };

    const limpiarFormulario = () => {
        inputNombre.value = '';
        inputEmail.value = '';
        inputEdad.value = '';
        errorNombre.textContent = '';
        errorEmail.textContent = '';
        errorEdad.textContent = '';
    };

    const borrarDatos = () => {
        localStorage.removeItem('usuarioData');
        
        // Limpiar la sección de resultados y ocultarla
        resNombre.textContent = '';
        resEmail.textContent = '';
        resEdad.textContent = '';
        seccionResultado.classList.add('hidden'); // Ocultar la sección

        alert('🗑️ Datos borrados de LocalStorage.');
    };

    // 4. Asignación de Eventos
    btnGuardar.addEventListener('click', guardarDatos);
    btnVerDatos.addEventListener('click', mostrarDatos);
    btnLimpiarFormulario.addEventListener('click', limpiarFormulario);
    btnBorrarDatos.addEventListener('click', borrarDatos);

    // No se llama a mostrarDatos() al inicio para que no se muestre por defecto.
});