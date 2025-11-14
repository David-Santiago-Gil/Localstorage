document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtención de Elementos del DOM
    const inputNombre = document.getElementById('nombre');
    const inputEmail = document.getElementById('email');
    const inputEdad = document.getElementById('edad');
    
    const errorNombre = document.getElementById('error-nombre');
    const errorEmail = document.getElementById('error-email');
    const errorEdad = document.getElementById('error-edad');

    const btnGuardar = document.getElementById('btnGuardar');
    const btnVerOcultarDatos = document.getElementById('btnVerDatos'); 
    const btnLimpiarFormulario = document.getElementById('btnLimpiarFormulario');
    const btnBorrarDatos = document.getElementById('btnBorrarDatos');

    const seccionResultado = document.querySelector('.resultado'); 
    const listaUsuariosContenedor = document.getElementById('lista-usuarios-contenedor'); 
    

    // 2. Funciones de Validación
    
    const validarEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validarCampos = () => {
        let esValido = true;
        
        errorNombre.textContent = '';
        errorEmail.textContent = '';
        errorEdad.textContent = '';

        if (inputNombre.value.trim() === '') {
            errorNombre.textContent = 'El nombre es obligatorio.';
            esValido = false;
        }

        if (inputEmail.value.trim() === '') {
            errorEmail.textContent = 'El email es obligatorio.';
            esValido = false;
        } else if (!validarEmail(inputEmail.value.trim())) {
            errorEmail.textContent = 'El formato del email no es válido.';
            esValido = false;
        }

        const edad = parseInt(inputEdad.value.trim());
        if (isNaN(edad) || edad <= 0) {
            errorEdad.textContent = 'La edad es obligatoria y debe ser un número positivo.';
            esValido = false;
        }

        return esValido;
    };

    // 3. Funciones de LocalStorage y Lógica

    /**
     * Función principal para guardar un nuevo usuario.
     * Incluye la lógica para actualizar la lista visible sin recargar.
     */
    const guardarDatos = () => {
        const valido = validarCampos();

        if (valido) {
            const usuario = {
                nombre: inputNombre.value.trim(),
                email: inputEmail.value.trim(),
                edad: parseInt(inputEdad.value.trim())
            };

            let listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            
            // Añadir el nuevo usuario
            listaUsuarios.push(usuario);

            // Guardar en LocalStorage
            localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
            
            // 1. Mostrar Alerta
            alert(`✅ Usuario "${usuario.nombre}" guardado correctamente.`);
            
            // 2. Limpiar el formulario
            limpiarFormulario(false); // Limpieza silenciosa
            
            // 3. Actualizar la lista si está visible (sin refrescar la página)
            if (!seccionResultado.classList.contains('hidden')) {
                 renderizarDatos(); // Volver a pintar la lista con el nuevo dato
            }

        } else {
            alert('❌ Por favor, corrige los errores en el formulario.');
        }
    };

    // Función CORREGIDA
    const borrarUsuarioIndividual = (index) => {
        const dataString = localStorage.getItem('usuarios');
        if (!dataString) return;

        let listaUsuarios = JSON.parse(dataString);
        
        if (index >= 0 && index < listaUsuarios.length) {
            const nombreUsuario = listaUsuarios[index].nombre;
            
            // Eliminar el usuario en la posición 'index'
            listaUsuarios.splice(index, 1);
            
            // Guardar la nueva lista en LocalStorage
            localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
            
            alert(`🗑️ Usuario ${nombreUsuario} borrado correctamente. La lista ha sido reordenada.`);
            
            setTimeout(() => {
                // Volver a llamar a la función para re-renderizar la lista si está visible.
                if (!seccionResultado.classList.contains('hidden')) {
                    renderizarDatos(); 
                } else {
                    // Si no está visible, pero la lista quedó vacía, es mejor resetear el estado del botón
                    if (listaUsuarios.length === 0) {
                        btnVerOcultarDatos.textContent = 'Ver Datos';
                    }
                }
            }, 10); 
        }
    };

    /**
     * Función para PINTAR/RE-PINTAR la lista de usuarios.
     * La lista es PINTADA solo si el LocalStorage tiene datos.
     */
    const renderizarDatos = () => {
        const dataString = localStorage.getItem('usuarios'); 
        listaUsuariosContenedor.innerHTML = ''; 

        if (dataString) {
            const listaUsuarios = JSON.parse(dataString);

            if (listaUsuarios.length > 0) {
                let htmlResultado = '';
                
                listaUsuarios.forEach((usuario, index) => {
                    const numeroUsuario = index + 1;
                    
                    htmlResultado += `
                        <div class="usuario-item">
                            <h4>Usuario #${numeroUsuario}</h4>
                            <p><strong>Nombre:</strong> <span>${usuario.nombre}</span></p>
                            <p><strong>Email:</strong> <span>${usuario.email}</span></p>
                            <p><strong>Edad:</strong> <span>${usuario.edad}</span></p>
                            <button class="btn-borrar-usuario" data-index="${index}">Borrar Usuario</button>
                        </div>
                        <hr>
                    `;
                });
                
                listaUsuariosContenedor.innerHTML = htmlResultado;
                seccionResultado.classList.remove('hidden'); 
                btnVerOcultarDatos.textContent = 'Ocultar Datos'; // Cambiar a 'Ocultar Datos'
                
                // Asignar eventos a los botones de borrado individual
                document.querySelectorAll('.btn-borrar-usuario').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const indexToDelete = parseInt(e.target.dataset.index);
                        borrarUsuarioIndividual(indexToDelete);
                    });
                });
                
            } else {
                // Lista vacía, la ocultamos y reseteamos el botón
                seccionResultado.classList.add('hidden'); 
                btnVerOcultarDatos.textContent = 'Ver Datos';
                alert('La lista de usuarios está vacía.');
            }
        } else {
            // No hay datos, la ocultamos y reseteamos el botón
            seccionResultado.classList.add('hidden'); 
            btnVerOcultarDatos.textContent = 'Ver Datos';
            alert('No se encontró la lista de usuarios en LocalStorage.');
        }
    };

    /**
     * Función para alternar la visibilidad de la lista de datos.
     */
    const toggleMostrarDatos = () => {
        // Si la sección ya está visible, la oculta.
        if (!seccionResultado.classList.contains('hidden')) {
            seccionResultado.classList.add('hidden');
            btnVerOcultarDatos.textContent = 'Ver Datos'; // Cambiar a 'Ver Datos'
            return;
        }
        
        // Si está oculta, llama a renderizarDatos para pintarla y mostrarla.
        renderizarDatos();
    };

    const limpiarFormulario = (mostrarAlerta = true) => {
        let debeLimpiar = false;
        
        // 1. Verificar si hay algo que limpiar (si se llama desde el botón)
        if (mostrarAlerta) {
            const nombreVacio = inputNombre.value.trim() === '';
            const emailVacio = inputEmail.value.trim() === '';
            const edadVacia = inputEdad.value.trim() === '';
    
            const erroresVacios = 
                errorNombre.textContent === '' && 
                errorEmail.textContent === '' && 
                errorEdad.textContent === '';
            
            debeLimpiar = !(nombreVacio && emailVacio && edadVacia && erroresVacios);
    
            if (!debeLimpiar) {
                alert('❕ No hay nada para limpiar.');
                return;
            }
        } else {
            // Si se llama desde guardarDatos, siempre limpiamos (debeLimpiar = true)
            debeLimpiar = true;
        }

        // 2. Proceder a la limpieza
        inputNombre.value = '';
        inputEmail.value = '';
        inputEdad.value = '';
        errorNombre.textContent = '';
        errorEmail.textContent = '';
        errorEdad.textContent = '';
        
        // 3. Mostrar alerta solo si se solicitó (y si realmente había algo que limpiar)
        if (mostrarAlerta && debeLimpiar) {
            alert('🧹 Formulario limpiado correctamente.');
        }
    };

    const borrarDatos = () => {
        const dataString = localStorage.getItem('usuarios');
    
        if (!dataString || JSON.parse(dataString).length === 0) {
            alert('❌ No hay datos para borrar.');
            return; 
        }
        
        // Si hay datos, procede a borrar
        localStorage.removeItem('usuarios'); 
        alert('🗑️ Lista de usuarios borrada de LocalStorage.');
        
        // Ocultar la sección de resultados inmediatamente
        listaUsuariosContenedor.innerHTML = ''; 
        seccionResultado.classList.add('hidden'); 
        btnVerOcultarDatos.textContent = 'Ver Datos'; // Resetear el botón
    };

    // 4. Asignación de Eventos
    btnGuardar.addEventListener('click', guardarDatos);
    // Ahora btnVerOcultarDatos llama a la nueva función toggleMostrarDatos
    btnVerOcultarDatos.addEventListener('click', toggleMostrarDatos); 
    btnLimpiarFormulario.addEventListener('click', () => limpiarFormulario(true)); 
    btnBorrarDatos.addEventListener('click', borrarDatos);
});