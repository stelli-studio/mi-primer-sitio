document.addEventListener("DOMContentLoaded", function() {

    // =================================
    // ELEMENTOS DEL FORMULARIO
    // =================================

    const formulario = document.getElementById("formulario");

    // =================================
    // MENÚ LATERAL
    // =================================

    const abrirMenu = document.getElementById("abrirMenu");
    const cerrarMenu = document.getElementById("cerrarMenu");
    const menuLateral = document.getElementById("menuLateral");
    const fondoMenu = document.getElementById("fondoMenu");

    function abrir() {
        menuLateral.classList.add("activo");
        fondoMenu.classList.add("activo");
        abrirMenu.setAttribute("aria-expanded", "true");
    }

    function cerrar() {
        menuLateral.classList.remove("activo");
        fondoMenu.classList.remove("activo");
        abrirMenu.setAttribute("aria-expanded", "false");
    }

    abrirMenu.addEventListener("click", abrir);
    cerrarMenu.addEventListener("click", cerrar);
    fondoMenu.addEventListener("click", cerrar);

    // =================================
    // FECHA DE NACIMIENTO
    // =================================

    const dia = document.getElementById("diaNacimiento");
    const mes = document.getElementById("mesNacimiento");
    const anio = document.getElementById("anioNacimiento");

    const anioActual = new Date().getFullYear();

    anio.innerHTML = '<option value="">Año</option>';

    for (let año = anioActual; año >= 1900; año--) {
        anio.add(new Option(año, año));
    }

    function actualizarDias() {

        const mesElegido = Number(mes.value);
        const anioElegido = Number(anio.value);

        let cantidadDias = 31;

        if (
            mesElegido === 4 ||
            mesElegido === 6 ||
            mesElegido === 9 ||
            mesElegido === 11
        ) {
            cantidadDias = 30;
        }

        if (mesElegido === 2) {
            cantidadDias = anioElegido
                ? new Date(anioElegido, 2, 0).getDate()
                : 29;
        }

        const diaAnterior = dia.value;

        dia.innerHTML = '<option value="">Día</option>';

        for (let i = 1; i <= cantidadDias; i++) {
            dia.add(new Option(i, i));
        }

        if (diaAnterior && Number(diaAnterior) <= cantidadDias) {
            dia.value = diaAnterior;
        }
    }

    mes.addEventListener("change", actualizarDias);
    anio.addEventListener("change", actualizarDias);

    actualizarDias();

    // =================================
    // TARJETA FICTICIA
    // =================================

    const tarjeta = document.getElementById("tarjeta");

    function comprobarMayoriaEdad() {

        const diaElegido = Number(dia.value);
        const mesElegido = Number(mes.value);
        const anioElegido = Number(anio.value);

        tarjeta.disabled = true;
        tarjeta.value = "";

        if (!diaElegido || !mesElegido || !anioElegido) {
            tarjeta.placeholder = "Disponible solo para mayores de edad";
            return;
        }

        const nacimiento = new Date(
            anioElegido,
            mesElegido - 1,
            diaElegido
        );

        const hoy = new Date();

        let edadCalculada =
            hoy.getFullYear() - nacimiento.getFullYear();

        const faltaCumplir =
            hoy.getMonth() < nacimiento.getMonth() ||
            (hoy.getMonth() === nacimiento.getMonth() &&
             hoy.getDate() < nacimiento.getDate());

        if (faltaCumplir) {
            edadCalculada--;
        }

        if (edadCalculada >= 18) {
            tarjeta.disabled = false;
            tarjeta.placeholder = "XXXX XXXX XXXX XXXX";
        } else {
            tarjeta.placeholder = "Disponible solo para mayores de edad";
        }
    }

    dia.addEventListener("change", comprobarMayoriaEdad);
    mes.addEventListener("change", comprobarMayoriaEdad);
    anio.addEventListener("change", comprobarMayoriaEdad);

    tarjeta.addEventListener("input", function() {

        let numero = this.value.replace(/\D/g, "").slice(0, 16);

        this.value = numero.match(/.{1,4}/g)?.join(" ") || "";

    });

    // =================================
    // NOMBRES Y APELLIDOS
    // =================================

    function prepararTexto(id) {

        const campo = document.getElementById(id);

        campo.addEventListener("input", function() {

            this.value = this.value
                .replace(/[^\p{L} ]/gu, "")
                .toLocaleUpperCase("es-MX")
                .slice(0, 100);

        });
    }

    prepararTexto("nombre");
    prepararTexto("paterno");
    prepararTexto("materno");

    // =================================
    // EDAD: SOLO NÚMEROS
    // =================================

    const edad = document.getElementById("edad");

    edad.addEventListener("input", function() {
        this.value = this.value.replace(/\D/g, "").slice(0, 3);
    });

    // =================================
    // VALIDAR NOMBRES Y APELLIDOS
    // =================================

    function validarTexto(id, errorId) {

        const campo = document.getElementById(id);
        const error = document.getElementById(errorId);

        const texto = campo.value.trim().toUpperCase();

        if (texto === "") {
            error.textContent = "Este campo es obligatorio.";
            return false;
        }

        if (!/^[\p{L} ]+$/u.test(texto)) {
            error.textContent = "Solo se permiten letras y espacios.";
            return false;
        }

        if (/[BCDFGHJKLMNÑPQRSTVWXYZ]{3,}/i.test(texto)) {
            error.textContent = "Es obligatorio escribir vocales.";
            return false;
        }

        error.textContent = "";
        return true;
    }

    // =================================
    // VALIDAR EDAD
    // =================================

    function validarEdad() {

        const error = document.getElementById("errorEdad");

        if (edad.value.trim() === "") {
            error.textContent = "La edad es obligatoria.";
            return false;
        }

        if (!/^\d{1,3}$/.test(edad.value)) {
            error.textContent = "Solo se permiten números, máximo 3 dígitos.";
            return false;
        }

        error.textContent = "";
        return true;
    }

    // =================================
    // VALIDAR FECHA DE NACIMIENTO
    // =================================

    function validarFecha() {

        const diaElegido = Number(dia.value);
        const mesElegido = Number(mes.value);
        const anioElegido = Number(anio.value);

        const error = document.getElementById("errorFecha");

        if (!diaElegido || !mesElegido || !anioElegido) {
            error.textContent = "Selecciona el día, mes y año.";
            return false;
        }

        const nacimiento = new Date(
            anioElegido,
            mesElegido - 1,
            diaElegido
        );

        if (
            nacimiento.getFullYear() !== anioElegido ||
            nacimiento.getMonth() !== mesElegido - 1 ||
            nacimiento.getDate() !== diaElegido
        ) {
            error.textContent = "La fecha seleccionada no es válida.";
            return false;
        }

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (nacimiento > hoy) {
            error.textContent = "La fecha no puede ser futura.";
            return false;
        }

        error.textContent = "";
        return true;
    }

    // =================================
    // VALIDAR CORREO
    // =================================

    function validarCorreo() {

        const correo = document.getElementById("correo");
        const error = document.getElementById("errorCorreo");

        if (correo.value.trim() === "") {
            error.textContent = "El correo es obligatorio.";
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value)) {
            error.textContent = "Ingresa un correo válido.";
            return false;
        }

        error.textContent = "";
        return true;
    }

    // =================================
    // VALIDAR TARJETA FICTICIA
    // =================================

    function validarTarjeta() {

        const error = document.getElementById("errorTarjeta");

        if (tarjeta.disabled) {
            error.textContent = "";
            return true;
        }

        const numero = tarjeta.value.replace(/\D/g, "");

        if (numero === "") {
            error.textContent = "Este campo es obligatorio.";
            return false;
        }

        if (!/^\d{16}$/.test(numero)) {
            error.textContent = "Debe contener exactamente 16 números.";
            return false;
        }

        error.textContent = "";
        return true;
    }

    // =================================
    // VALIDAR FORMULARIO
    // =================================

    formulario.addEventListener("submit", function(event) {

        event.preventDefault();

        let valido = true;

        if (!validarTexto("nombre", "errorNombre")) {
            valido = false;
        }

        if (!validarTexto("paterno", "errorPaterno")) {
            valido = false;
        }

        if (!validarTexto("materno", "errorMaterno")) {
            valido = false;
        }

        if (!validarEdad()) {
            valido = false;
        }

        if (!validarFecha()) {
            valido = false;
        }

        if (!validarTarjeta()) {
            valido = false;
        }

        if (!validarCorreo()) {
            valido = false;
        }

        if (valido) {

            alert("¡Tus datos han sido aceptados correctamente!");

            formulario.reset();

            actualizarDias();

            tarjeta.disabled = true;
            tarjeta.placeholder = "Disponible solo para mayores de edad";

            document.querySelectorAll(".error").forEach(function(error) {
                error.textContent = "";
            });

        } else {

            alert("Revisa los campos marcados en rojo.");

        }

    });

});