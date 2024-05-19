const { test, expect } = require('@playwright/test');

const _URL_SOCIOS = "/socios"
const _URL_SERVICIOS_PRODUCTOS = "/servicios"
const _URL_AGREGAR_SERVICIOS_PRODUCTOS = "/crear-servicio"

const _JSON_PRODUCTO_SERVICIO = {
    "respuesta": [
        {
            "descripcion": "Transporte al sitio de la competencia",
            "detalle": "Transporte al sitio de la competencia",
            "id": "d538c05e-ce84-4aa4-964f-62ec446a97a5",
            "id_deporte": "15077f2c-6c63-4c60-b9e4-3d6ba67ca8cb",
            "id_socio": "781c65f5-4580-41fe-beba-6f9672b1212d",
            "nombre": "Transporte",
            "valor": "30.0"
        },
    ],
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTU4NDIxNjYsImlhdCI6MTcxNTg0MDM2Niwic3ViIjoiZjI5MjBmOWItZjA3MS00NGVkLTkwMzUtYzBmMDdlYzY4YzNmIn0.nwEouF2O1Qj01OIw2ggBAFkjsRq180w0ZSg6vKFrjJE"
}

const _JSON_SOCIOS = {
    "respuesta": [
        {
            "apellido": "Fernadez",
            "detalle": "Socio de deporte",
            "email": "sociof@gmail.com",
            "id": "781c65f5-4580-41fe-beba-6f9672b1212d",
            "nombre": "Fernanda",
            "numero_identificacion": "123456",
            "tipo_id": "CC",
            "username": "fernanda.fernandez"
        }
    ],
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTU3NTAzMzAsImlhdCI6MTcxNTc0ODUzMCwic3ViIjoiZjI5MjBmOWItZjA3MS00NGVkLTkwMzUtYzBmMDdlYzY4YzNmIn0.rScvT5O140v9b0YgWs2u56WLXCmxvhtTUoRH9UZZU8A"
}

const _JSON_DEPORTES = [
    {
        "id": "15077f2c-6c63-4c60-b9e4-3d6ba67ca8cb",
        "nombre": "Atletismo"
    }
]

const _JSON_DIRECCION_DEPORTISTA = {
    "direccion": "Laureles - Estadio, Medellin, Medell\u00edn, Laureles, Medellin, Antioquia, Colombia",
    "id": "7448cc04-6ac5-48a1-9de4-68529f371677",
    "id_direccion": "ChIJM_bPTgcpRI4RQ3TBut_5hpk",
    "id_usuario": "f2920f9b-f071-44ed-9035-c0f07ec68c3f",
    "nombre": "La Macarena",
    "ubicacion_latitud": "6.2495185",
    "ubicacion_longitud": "-75.5805318"
}

const _JSON_PRODUCTO_SERVICIO_DETALLE = {
    "respuesta": 
        {
            "descripcion": "Transporte al sitio de la competencia",
            "detalle": "Transporte al sitio de la competencia",
            "id": "d538c05e-ce84-4aa4-964f-62ec446a97a5",
            "id_deporte": "15077f2c-6c63-4c60-b9e4-3d6ba67ca8cb",
            "id_socio": "781c65f5-4580-41fe-beba-6f9672b1212d",
            "nombre": "Transporte",
            "valor": "30.0"
        },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTU4NDIxNjYsImlhdCI6MTcxNTg0MDM2Niwic3ViIjoiZjI5MjBmOWItZjA3MS00NGVkLTkwMzUtYzBmMDdlYzY4YzNmIn0.nwEouF2O1Qj01OIw2ggBAFkjsRq180w0ZSg6vKFrjJE"
}

test.beforeEach(async ({ page }) => {
    // Mock consulta de servicios
    await page.route('**/administracion/producto_servicio', async (route, request) => {
        if (request.method() == "GET"){
            await route.fulfill({ json: _JSON_PRODUCTO_SERVICIO });
        }else{
            const json = {"description":"Producto o Servicio Registrado con exito"}
            await route.fulfill({ json });
        }
    });

    //Mock consulta socios de negocio
    await page.route('**/administracion/socios', async routeSocios => { 
        await routeSocios.fulfill({json: _JSON_SOCIOS});
    });

    //Mock consulta deportes
    await page.route('**/deporte/deportes', async routeDeportes => { 
        await routeDeportes.fulfill({json: _JSON_DEPORTES});
    });

    // Mock direccion deportista
    await page.route('**/personas/persona/direccion', async route => {
        await route.fulfill({ json: _JSON_DIRECCION_DEPORTISTA });
    });

    //Mock consulta detalle producto servicio
    await page.route('**/administracion/producto_servicio/**', async routeSocios => { 
        await routeSocios.fulfill({json: _JSON_PRODUCTO_SERVICIO_DETALLE});
    });

    await page.goto("/");
    await page.getByPlaceholder("Correo", {exact: true}).fill('correo@gmail.com');
    await page.getByPlaceholder("Contraseña", {exact: true}).fill('123456');

    // Clic al botón de iniciar sesión
    await page.getByRole('button', {name: 'ingresar'}).click()
    await expect(page).toHaveURL(_URL_SOCIOS)

    // Clic a la sección de "Servicios"
    await page.locator('[href="/servicios"]').click()
    await expect(page).toHaveURL(_URL_SERVICIOS_PRODUCTOS)
});
 
test.describe('Pantalla Servicios', () => {
    test('Debería mostrar campo de búsqueda', async ({ page }) => {
        // Buscar el elemento con el campo de búsqueda
        const cuadroBusqueda = page.getByPlaceholder("Buscar servicio ...", {exact: true});
        await expect(cuadroBusqueda).toBeVisible()
    })

    test('Debería mostrar lista de servicios', async ({ page }) => {
        // Buscar el elemento con las card de servicios
        await page.waitForTimeout(1000);
        const cardsServicios = await page.getByTestId("servicios-card").count();
        expect(cardsServicios).toBeGreaterThan(0)
    })

    test('Debería mostrar botón de agregar servicio', async ({ page }) => {
        // Buscar el botón de agregar servicio
        const botonAgregarservicio = page.getByTestId('agregar-servicio')
        await expect(botonAgregarservicio).toBeVisible()
    })

    test('Debería buscar por texto', async ({ page }) => {
        // Buscar un nombre de servicio y llenar el campo de búsqueda con el nombre
        await page.getByPlaceholder("Buscar servicio ...", {exact: true}).fill("Transpor")

        // Se debe mostrar al menos una carta con el servicios de negocio
        await page.waitForTimeout(1000);
        const cardsServicios = await page.getByTestId("servicios-card").count();
        expect(cardsServicios).toBeGreaterThan(0)
    })

    test('Debería buscar por texto sin resultados', async ({ page }) => {
        // Buscar un nombre de servicio y llenar el campo de búsqueda con el nombre
        await page.getByPlaceholder("Buscar servicio ...", {exact: true}).fill("qwertyuiop")

        // No se debe mostrar cartas con servicios de negocios
        await page.waitForTimeout(1500);
        const cardsServicios = await page.getByTestId("servicios-card").count();
        expect(cardsServicios).toBe(0)
    });
});

test.describe('Pantalla Creación de Servicios', () => {
    test('Debería agregar servicio', async ({ page }) => {
        
        // Click en el botón de agregar servicio
        await page.getByTestId('agregar-servicio').click()
        await expect(page).toHaveURL(_URL_AGREGAR_SERVICIOS_PRODUCTOS)

        // Llenar los campos con la información correspondiente
        await page.getByPlaceholder("Nombre", {exact: true}).fill("Alimentación")
        await page.getByPlaceholder("Valor (USD)", {exact: true}).fill("30")

        await page.getByPlaceholder("Detalles", {exact: true}).fill("Servicio de alimentación")

        await page.getByPlaceholder("Descripción", {exact: true}).fill("Se ofrece el servicio de alimentación después de la competencia")

        await page.getByTestId('socio-negocio').selectOption({index: 1})

        await page.getByTestId('deporte').selectOption({index: 1})

        await page.getByRole('button', {name: ' Guardar '}).click()
        await expect(page.getByTestId('exitoCreacion')).toBeVisible();

        await page.waitForTimeout(5500);
        await expect(page).toHaveURL(_URL_SERVICIOS_PRODUCTOS)

    })

    test('Validaciones creación servicio - Campo: Nombre', async ({ page }) => {
    
        // Click en el botón de agregar servicio
        await page.getByTestId('agregar-servicio').click()
        await expect(page).toHaveURL(_URL_AGREGAR_SERVICIOS_PRODUCTOS)
    
        const campo = page.getByPlaceholder("Nombre", {exact: true})
    
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

    test('Validaciones creación servicio - Campo: Valor (USD)', async ({ page }) => {
    
        // Click en el botón de agregar servicio
        await page.getByTestId('agregar-servicio').click()
        await expect(page).toHaveURL(_URL_AGREGAR_SERVICIOS_PRODUCTOS)
    
        const campo = page.getByPlaceholder("Valor (USD)", {exact: true})
    
        // Clic en el campo sin llenar información
        await campo.fill("");
        await campo.blur();
    
        // Buscar mensaje de alerta requerido
        let alerta = page.getByTestId("alerta-valor");
        let mensajeAlerta = await alerta.textContent()
    
        // Validar requerido
        await expect(alerta).toBeVisible()
        expect(mensajeAlerta.trim()).toEqual("Se requiere el valor")
    })

    test('Validaciones creación servicio - Campo: Detalles', async ({ page }) => {
    
        // Click en el botón de agregar servicio
        await page.getByTestId('agregar-servicio').click()
        await expect(page).toHaveURL(_URL_AGREGAR_SERVICIOS_PRODUCTOS)
    
        const campo = page.getByPlaceholder("Detalles", {exact: true})
    
        // Clic en el campo sin llenar información
        await campo.fill("");
        await campo.blur();
    
        // Buscar mensaje de alerta requerido
        let alerta = page.getByTestId("alerta-detalle");
        let mensajeAlerta = await alerta.textContent()
    
        // Validar requerido
        await expect(alerta).toBeVisible()
        expect(mensajeAlerta.trim()).toEqual("Se requiere el detalle")
    })

    test('Validaciones creación servicio - Campo: Descripción', async ({ page }) => {
    
        // Click en el botón de agregar servicio
        await page.getByTestId('agregar-servicio').click()
        await expect(page).toHaveURL(_URL_AGREGAR_SERVICIOS_PRODUCTOS)
    
        const campo = page.getByPlaceholder("Descripción", {exact: true})
    
        // Clic en el campo sin llenar información
        await campo.fill("");
        await campo.blur();
    
        // Buscar mensaje de alerta requerido
        let alerta = page.getByTestId("alerta-descripcion");
        let mensajeAlerta = await alerta.textContent()
    
        // Validar requerido
        await expect(alerta).toBeVisible()
        expect(mensajeAlerta.trim()).toEqual("Se requiere la descripción")
    })

    test('Validaciones creación servicio - Campo: Socio de negocio', async ({ page }) => {
    
        // Click en el botón de agregar servicio
        await page.getByTestId('agregar-servicio').click()
        await expect(page).toHaveURL(_URL_AGREGAR_SERVICIOS_PRODUCTOS)
    
        const campo = page.getByTestId("socio-negocio")
    
        // Clic en el campo sin llenar información
        await campo.click();
        await campo.blur();
    
        // Buscar mensaje de alerta requerido
        let alerta = page.getByTestId("alerta-socio");
        let mensajeAlerta = await alerta.textContent()
    
        // Validar requerido
        await expect(alerta).toBeVisible()
        expect(mensajeAlerta.trim()).toEqual("Se require el socio")
    })

    test('Validaciones creación servicio - Campo: Deporte', async ({ page }) => {
    
        // Click en el botón de agregar servicio
        await page.getByTestId('agregar-servicio').click()
        await expect(page).toHaveURL(_URL_AGREGAR_SERVICIOS_PRODUCTOS)
    
        const campo = page.getByTestId("deporte")
    
        // Clic en el campo sin llenar información
        await campo.click();
        await campo.blur();
    
        // Buscar mensaje de alerta requerido
        let alerta = page.getByTestId("alerta-deporte");
        let mensajeAlerta = await alerta.textContent()
    
        // Validar requerido
        await expect(alerta).toBeVisible()
        expect(mensajeAlerta.trim()).toEqual("El deporte es requerido")
    })
});

test.describe('Pantalla Detalle Servicio', () => {
    test('Debería cargar el detalle', async ({ page }) => {
        

       

        // Click en el botón de ver detalle
        const botonVerDetalle = page.getByTestId("ver-detalle").first()
        const idServicio = await botonVerDetalle.getAttribute("servicio-id")
        await botonVerDetalle.click()
        await expect(page).toHaveURL("/servicios/"+idServicio)

        // Pantalla detalle de servicio
        let valorCampo = await page.getByPlaceholder("Nombre", {exact: true}).inputValue();;
        expect(valorCampo).toEqual(_JSON_PRODUCTO_SERVICIO_DETALLE["respuesta"]["nombre"])

        valorCampo = await page.getByPlaceholder("Valor (USD)", {exact: true}).inputValue();;
        expect(valorCampo).toEqual(_JSON_PRODUCTO_SERVICIO_DETALLE["respuesta"]["valor"])

        valorCampo = await page.getByPlaceholder("Detalles", {exact: true}).inputValue();;
        expect(valorCampo).toEqual(_JSON_PRODUCTO_SERVICIO_DETALLE["respuesta"]["detalle"])

        valorCampo = await page.getByPlaceholder("Descripción", {exact: true}).inputValue();;
        expect(valorCampo).toEqual(_JSON_PRODUCTO_SERVICIO_DETALLE["respuesta"]["descripcion"])

        valorCampo = await page.getByPlaceholder("Socio de Negocio", {exact: true}).inputValue();;
        expect(valorCampo).toEqual(_JSON_SOCIOS["respuesta"][0]["nombre"] + " " + _JSON_SOCIOS["respuesta"][0]["apellido"])

        valorCampo = await page.getByPlaceholder("Deporte", {exact: true}).inputValue();;
        expect(valorCampo).toEqual(_JSON_DEPORTES[0]["nombre"])
        
        await page.getByTestId('volver-detalle-servicio').click()
        await page.waitForTimeout(1000);
        await expect(page).toHaveURL(_URL_SERVICIOS_PRODUCTOS)
    })
});