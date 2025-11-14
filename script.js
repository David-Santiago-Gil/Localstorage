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
    
    const guardarDatos = () => {
        
        const valido = validarCampos();

        if (valido) {
            const nuevoUsuario = {
                nombre: inputNombre.value.trim(),
                email: inputEmail.value.trim(), // Usamos el email como identificador único
                edad: parseInt(inputEdad.value.trim())
            };

            let listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            
            // Buscar si el usuario ya existe por su email
            const indiceExistente = listaUsuarios.findIndex(
                usuario => usuario.email === nuevoUsuario.email
            );
            
            if (indiceExistente !== -1) {
                // 1. USUARIO EXISTE: Actualizar datos (Silencioso)
                listaUsuarios[indiceExistente] = nuevoUsuario;
            } else {
                // 2. USUARIO NO EXISTE: Añadir nuevo (Silencioso)
                listaUsuarios.push(nuevoUsuario);
            }

            // Guardar la lista actualizada en LocalStorage
            localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
            
            limpiarFormulario(false); // Limpieza silenciosa
            
            // 3. Refrescar la lista si está visible
            if (!seccionResultado.classList.contains('hidden')) {
                // Forzamos un ciclo de 'refresh': Ocultar y luego Mostrar de nuevo
                seccionResultado.classList.add('hidden'); 
                btnVerOcultarDatos.textContent = 'Ver Datos'; 
                
                setTimeout(() => {
                    toggleMostrarDatos();
                }, 10);
            }
            
        } else {
            // ALERTA RESTAURADA: Cuando la validación falla
            alert('❌ Por favor, corrige los errores en el formulario.'); 
        }
    };

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
            
            // Operación de borrado individual: Silenciosa
            
            setTimeout(() => {
                // Llama a toggleMostrarDatos() para re-renderizar la lista y ajustar el texto del botón.
                toggleMostrarDatos(); 
            }, 10); 
        }
    };

    const toggleMostrarDatos = () => {
        // >>>>> BLOQUE DE OCULTAR (Si ya está visible) <<<<<
        if (!seccionResultado.classList.contains('hidden')) {
            seccionResultado.classList.add('hidden');
            btnVerOcultarDatos.textContent = 'Ver Datos'; // Cambiar a 'Ver Datos'
            return;
        }

        // >>>>> BLOQUE DE MOSTRAR (Si está oculto) <<<<<
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
                seccionResultado.classList.add('hidden'); 
                btnVerOcultarDatos.textContent = 'Ver Datos';
                // ALERTA RESTAURADA: Cuando la lista está vacía
                alert('La lista de usuarios está vacía.'); 
            }
        } else {
            seccionResultado.classList.add('hidden'); 
            btnVerOcultarDatos.textContent = 'Ver Datos';
            // ALERTA RESTAURADA: Cuando no hay datos en LocalStorage
            alert('No se encontró la lista de usuarios en LocalStorage.'); 
        }
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
                // ALERTA RESTAURADA: Cuando no hay nada que limpiar
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
            // Limpieza del formulario: Silenciosa
        }
    };

    const borrarDatos = () => {
        // Ocultar la sección de resultados inmediatamente
        listaUsuariosContenedor.innerHTML = ''; 
        seccionResultado.classList.add('hidden'); 
        btnVerOcultarDatos.textContent = 'Ver Datos'; // Resetear el botón

        const dataString = localStorage.getItem('usuarios');
    
        if (!dataString || JSON.parse(dataString).length === 0) {
            // ALERTA RESTAURADA: Cuando no hay datos para borrar
            alert('❌ No hay datos para borrar.'); 
            return; 
        }
        
        // Si hay datos, procede a borrar
        localStorage.removeItem('usuarios'); 
        // Borrado total de datos: Silencioso
    };

    // 4. Asignación de Eventos
    btnGuardar.addEventListener('click', guardarDatos);
    btnVerOcultarDatos.addEventListener('click', toggleMostrarDatos); 
    btnLimpiarFormulario.addEventListener('click', () => limpiarFormulario(true)); 
    btnBorrarDatos.addEventListener('click', borrarDatos);
});

//44//