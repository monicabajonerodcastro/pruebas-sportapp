const { test, expect } = require('@playwright/test');

const _URL_AGREGAR_SOCIO = "/socio"
const _URL_SOCIOS = "/socios"

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Correo", {exact: true}).fill('correo@gmail.com');
  await page.getByPlaceholder("Contraseña", {exact: true}).fill('123456');

  // Clic al botón de iniciar sesión
  await page.getByRole('button', {name: 'ingresar'}).click()
  await expect(page).toHaveURL(_URL_SOCIOS)
});

test.describe('Pantalla Socios', () => {
    test('Debería mostrar campo de búsqueda', async ({ page }) => {
        // Buscar el elemento con el campo de búsqueda
        const cuadroBusqueda = page.getByPlaceholder("Buscar socio de negocio...", {exact: true});
        await expect(cuadroBusqueda).toBeVisible()
    })

    test('Debería mostrar lista de socios', async ({ page }) => {
        // Buscar el elemento con las card de socios
        const cardsSocios = await page.getByTestId("socio-card").count();
        expect(cardsSocios).toBeGreaterThan(0)
    })

    test('Debería mostrar botón de agregar socio', async ({ page }) => {
        // Buscar el botón de agregar socio
        const botonAgregarSocio = page.getByTestId('agregar-socio')
        await expect(botonAgregarSocio).toBeVisible()
    })

    test('Debería buscar por texto', async ({ page }) => {
        // Buscar un nombre de socio de negocio y llenar el campo de búsqueda con el nombre
        await page.getByPlaceholder("Buscar socio de negocio...", {exact: true}).fill("Luis")

        // Se debe mostrar al menos una carta con el socio de negocio
        const cardsSocios = await page.getByTestId("socio-card").count();
        expect(cardsSocios).toBeGreaterThan(0)
    })

    test('Debería buscar por texto sin resultados', async ({ page }) => {
        // Buscar un nombre de socio de negocio y llenar el campo de búsqueda con el nombre
        await page.getByPlaceholder("Buscar socio de negocio...", {exact: true}).fill("qwertyuiop")

        // No se debe mostrar cartas con socios de negocios
        const cardsSocios = await page.getByTestId("socio-card").count();
        expect(cardsSocios).toBe(0)
    })
});

test.describe('Pantalla Creación de Socios', () => {
    test('Debería agregar socio de negocio', async ({ page }) => {
        //Mock registro socio de negocio exitoso
        await page.route('**/administracion/socio', async route => {
            const json = {"description": "Socio Registrado con exito"};
            await route.fulfill({ json });
        });

        // Click en el botón de agregar socio
        await page.getByTestId('agregar-socio').click()
        await expect(page).toHaveURL(_URL_AGREGAR_SOCIO)

        // Llenar los campos con la información correspondiente
        await page.getByPlaceholder("Nombres", {exact: true}).fill("Rodrigo")
        await page.getByPlaceholder("Apellidos", {exact: true}).fill("Rodriguez")

        await page.getByPlaceholder("Usuario", {exact: true}).fill("rodrigo.rodriguez")
        await page.getByPlaceholder("E-mail", {exact: true}).fill("rodrigo.rodriguez@gmail.com")

        await page.getByTestId('tipo-identificacion').selectOption({ value: 'CC' })
        await page.getByPlaceholder("Número de identificación", {exact: true}).fill("1234567890")

        await page.getByPlaceholder("Contraseña", {exact: true}).fill("123456")
        await page.getByPlaceholder("Confirmar contraseña", {exact: true}).fill("123456")

        await page.getByPlaceholder("Detalle", {exact: true}).fill("Socio de Negocio para Transporte")

        await page.getByRole('button', {name: ' Guardar '}).click()
        await expect(page.getByTestId('exitoCreacion')).toBeVisible();

        await page.waitForTimeout(2500);
        await expect(page).toHaveURL("/socios")

    })

    test('Validaciones creación socio de negocio - Campo: Nombres', async ({ page }) => {
    
        // Click en el botón de agregar socio
        await page.getByTestId('agregar-socio').click()
        await expect(page).toHaveURL(_URL_AGREGAR_SOCIO)
    
        const campo = page.getByPlaceholder("Nombres", {exact: true})
    
        // Clic en el campo sin llenar información
        await campo.fill("");
        await campo.blur();
    
        // Buscar mensaje de alerta requerido
        let alerta = page.getByTestId("alerta-nombre");
        let mensajeAlerta = await alerta.textContent()
    
        // Validar requerido
        await expect(alerta).toBeVisible()
        expect(mensajeAlerta.trim()).toEqual("Se requiere el nombre")
    })

    test('Validaciones creación socio de negocio - Campo: Apellidos', async ({ page }) => {
    
        // Click en el botón de agregar socio
        await page.getByTestId('agregar-socio').click()
        await expect(page).toHaveURL(_URL_AGREGAR_SOCIO)
    
        const campo = page.getByPlaceholder("Apellidos", {exact: true})
    
        // Clic en el campo sin llenar información
        await campo.fill("");
        await campo.blur();
    
        // Buscar mensaje de alerta requerido
        let alerta = page.getByTestId("alerta-apellido");
        let mensajeAlerta = await alerta.textContent()
    
        // Validar requerido
        await expect(alerta).toBeVisible()
        expect(mensajeAlerta.trim()).toEqual("Se requieren los apellidos")
    })

    test('Validaciones creación socio de negocio - Campo: Usuario', async ({ page }) => {
    
        // Click en el botón de agregar socio
        await page.getByTestId('agregar-socio').click()
        await expect(page).toHaveURL(_URL_AGREGAR_SOCIO)
    
        const campo = page.getByPlaceholder("Usuario", {exact: true})
    
        // Clic en el campo sin llenar información
        await campo.fill("");
        await campo.blur();
    
        // Buscar mensaje de alerta requerido
        let alerta = page.getByTestId("alerta-username");
        let mensajeAlerta = await alerta.textContent()
    
        // Validar requerido
        await expect(alerta).toBeVisible()
        expect(mensajeAlerta.trim()).toEqual("Se requiere el username")
    })

    test('Validaciones creación socio de negocio - Campo: E-mail', async ({ page }) => {
    
        // Click en el botón de agregar socio
        await page.getByTestId('agregar-socio').click()
        await expect(page).toHaveURL(_URL_AGREGAR_SOCIO)
    
        const campo = page.getByPlaceholder("E-mail", {exact: true})
    
        // Clic en el campo sin llenar información
        await campo.fill("");
        await campo.blur();
    
        // Buscar mensaje de alerta requerido
        let alerta = page.getByTestId("alerta-email");
        let mensajeAlerta = await alerta.textContent()
    
        // Validar requerido
        await expect(alerta).toBeVisible()
        expect(mensajeAlerta.trim()).toEqual("Se requiere el email")
    })

    test('Validaciones creación socio de negocio - Campo: Tipo Identificación', async ({ page }) => {
    
        // Click en el botón de agregar socio
        await page.getByTestId('agregar-socio').click()
        await expect(page).toHaveURL(_URL_AGREGAR_SOCIO)
    
        const campo = page.getByTestId("tipo-identificacion")
    
        // Clic en el campo sin llenar información
        await campo.click();
        await campo.blur();
    
        // Buscar mensaje de alerta requerido
        let alerta = page.getByTestId("alerta-tipo-identificacion");
        let mensajeAlerta = await alerta.textContent()
    
        // Validar requerido
        await expect(alerta).toBeVisible()
        expect(mensajeAlerta.trim()).toEqual("Se requiere el tipo de identificación")
    })

    test('Validaciones creación socio de negocio - Campo: Número de identificación', async ({ page }) => {
    
        // Click en el botón de agregar socio
        await page.getByTestId('agregar-socio').click()
        await expect(page).toHaveURL(_URL_AGREGAR_SOCIO)
    
        const campo = page.getByPlaceholder("Número de identificación", {exact: true})
    
        // Clic en el campo sin llenar información
        await campo.fill("");
        await campo.blur();
    
        // Buscar mensaje de alerta requerido
        let alerta = page.getByTestId("alerta-num-identificacion");
        let mensajeAlerta = await alerta.textContent()
    
        // Validar requerido
        await expect(alerta).toBeVisible()
        expect(mensajeAlerta.trim()).toEqual("Se requiere el número de identificación")
    })

    test('Validaciones creación socio de negocio - Campo: Contraseña', async ({ page }) => {
    
        // Click en el botón de agregar socio
        await page.getByTestId('agregar-socio').click()
        await expect(page).toHaveURL(_URL_AGREGAR_SOCIO)
    
        const campo = page.getByPlaceholder("Contraseña", {exact: true})
    
        // Clic en el campo sin llenar información
        await campo.fill("");
        await campo.blur();
    
        // Buscar mensaje de alerta requerido
        let alerta = page.getByTestId("alerta-password");
        let mensajeAlerta = await alerta.textContent()
    
        // Validar requerido
        await expect(alerta).toBeVisible()
        expect(mensajeAlerta.trim()).toEqual("Se requiere la contraseña")
    })

    test('Validaciones creación socio de negocio - Campo: Confirmación Contraseña', async ({ page }) => {
    
        // Click en el botón de agregar socio
        await page.getByTestId('agregar-socio').click()
        await expect(page).toHaveURL(_URL_AGREGAR_SOCIO)
    
        let campo = page.getByPlaceholder("Confirmar contraseña", {exact: true})
    
        // Clic en el campo sin llenar información
        await campo.fill("");
        await campo.blur();
    
        // Buscar mensaje de alerta requerido
        let alerta = page.getByTestId("alerta-confirmacion-password");
        let mensajeAlerta = await alerta.textContent()
    
        // Validar requerido
        await expect(alerta).toBeVisible()
        expect(mensajeAlerta.trim()).toEqual("Se requiere la contraseña")

        // Validación de contraseñas iguales
        await campo.fill("123456");

        campo = page.getByPlaceholder("Contraseña", {exact: true})
        await campo.fill("");
        await campo.blur();

        alerta = page.getByTestId("alerta-password-match");
        mensajeAlerta = await alerta.textContent()

        // Validar contraseñas iguales
        await expect(alerta).toBeVisible()
        expect(mensajeAlerta.trim()).toEqual("Las contraseñas no coinciden")
    })
});

test.describe('Pantalla Detalle Socios', () => {
    test('Debería cargar el detalle', async ({ page }) => {
        const json = 
            {"respuesta": {
                "apellido": "Perez",
                "detalle": "Socio de deporte",
                "email": "socio@gmail.com",
                "id": "781c65f5-4580-41fe-beba-6f9672b1212d",
                "nombre": "Luis",
                "numero_identificacion": "123456",
                "tipo_id": "CC",
                "username": "pedro.perez"
            },
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTU3Mjc3MzgsImlhdCI6MTcxNTcyNTkzOCwic3ViIjoiZjI5MjBmOWItZjA3MS00NGVkLTkwMzUtYzBmMDdlYzY4YzNmIn0.GL2nKBxmrRCeXKegYCaLg5dunlyK8q5sBHLCZQUH-3s"
        }
        //Mock consulta de socio de negocio
        await page.route('**/administracion/socios/**', async route => { 
            await route.fulfill({ json });
        });

        // Click en el botón de ver detalle
        const botonVerDetalle = page.getByTestId("ver-detalle").first()
        const idSocio = await botonVerDetalle.getAttribute("socio-id")
        await botonVerDetalle.click()
        await expect(page).toHaveURL("/socio/"+idSocio)

        // Pantalla detalle de socio
        let valorCampo = await page.getByPlaceholder("Nombres", {exact: true}).inputValue();;
        expect(valorCampo).toEqual(json["respuesta"]["nombre"])

        valorCampo = await page.getByPlaceholder("Apellidos", {exact: true}).inputValue();;
        expect(valorCampo).toEqual(json["respuesta"]["apellido"])

        valorCampo = await page.getByPlaceholder("Usuario", {exact: true}).inputValue();;
        expect(valorCampo).toEqual(json["respuesta"]["username"])

        valorCampo = await page.getByPlaceholder("E-mail", {exact: true}).inputValue();;
        expect(valorCampo).toEqual(json["respuesta"]["email"])

        valorCampo = await page.getByPlaceholder("Detalle", {exact: true}).inputValue();;
        expect(valorCampo).toEqual(json["respuesta"]["detalle"])

        await page.getByTestId('volver-detalle-socio').click()
        await expect(page).toHaveURL(_URL_SOCIOS)
    })
});