const { test, expect } = require('@playwright/test');
const { webkit } = require('playwright');

const _URL_SOCIOS = "/socios"
const _URL_EVENTOS = "/eventos"

const _JSON_DEPORTISTA = {
    "respuesta": [
        {
            "detalle": "Entrenamiento basico para principiantes",
            "fecha_creacion": "2024-05-01 12:00:00",
            "fecha_fin": "2024-06-02 00:46:27.898000",
            "fecha_inicio": "2024-06-01 00:46:27.898000",
            "id": "f0ee1aed-3af4-4207-8649-6013d61ee2d7",
            "id_deporte": "bf8806fa-6287-4a0d-a646-c99c36d2be7c",
            "id_socio": "780f59a1-b719-45f7-a7b7-d8ce6691d825",
            "nombre": "Entrenamiento ba1sico para principiantes",
            "ubicacion": {
                "direccion": "El Penol, Penol, Antioquia, Colombia",
                "id": "add44c49-145d-4fb5-915f-e0cd557bcd29",
                "id_evento": "f0ee1aed-3af4-4207-8649-6013d61ee2d7",
                "id_ubicacion": "ChIJBRMhx-AdRI4RKgY4Mh7FuS0",
                "nombre": "El Penol",
                "ubicacion_latitud": "6.2199662",
                "ubicacion_longitud": "-75.2435307"
            }
        }
    ],
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTU4MzE3NTEsImlhdCI6MTcxNTgyOTk1MSwic3ViIjoiZjI5MjBmOWItZjA3MS00NGVkLTkwMzUtYzBmMDdlYzY4YzNmIn0.TdoxIbTaE0ZXlIBJF2nWSfKtrc8C8tnOMKOqZcVHeOQ"
}

const _JSON_EVENTOS = {
    "respuesta": [
        {
            "detalle": "Competencia que se realizara en Bogota ",
            "fecha_creacion": "2024-05-01 12:00:00",
            "fecha_fin": "2024-05-29 00:00:00",
            "fecha_inicio": "2024-05-28 12:00:00",
            "id": "5a0b032f-41d7-4478-bcf9-14d1bfb26e20",
            "id_deporte": "15077f2c-6c63-4c60-b9e4-3d6ba67ca8cb",
            "id_socio": "780f59a1-b719-45f7-a7b7-d8ce6691d825",
            "nombre": "Competencia Local de Ciclismo",
            "ubicacion": {
                "direccion": "Centro Chia",
                "id": "27b44fb6-d526-4b54-b4d4-c7de4b355f7e",
                "id_evento": "5a0b032f-41d7-4478-bcf9-14d1bfb26e20",
                "id_ubicacion": "ChIJP7nUxjx5QI4RPzY-wNH8vt9",
                "nombre": "Centro Chia",
                "ubicacion_latitud": "4.787121",
                "ubicacion_longitud": "-74.122071"
            }
        }
    ],
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTU4MzE3NTEsImlhdCI6MTcxNTgyOTk1MSwic3ViIjoiZjI5MjBmOWItZjA3MS00NGVkLTkwMzUtYzBmMDdlYzY4YzNmIn0.TdoxIbTaE0ZXlIBJF2nWSfKtrc8C8tnOMKOqZcVHeOQ"
}

const _JSON_DETALLE_EVENTO = {
    "respuesta": {
        "detalle": "Entrenamiento b\u00e1sico para principiantes",
        "fecha_creacion": "2024-05-01 12:00:00",
        "fecha_fin": "2024-06-02 00:46:27.898000",
        "fecha_inicio": "2024-06-01 00:46:27.898000",
        "id": "f0ee1aed-3af4-4207-8649-6013d61ee2d7",
        "id_deporte": "bf8806fa-6287-4a0d-a646-c99c36d2be7c",
        "id_socio": "780f59a1-b719-45f7-a7b7-d8ce6691d825",
        "nombre": "Entrenamiento b\u00e1sico para principiantes",
        "ubicacion": {
            "direccion": "El Pe\u00f1ol, Pe\u00f1ol, Antioquia, Colombia",
            "id": "add44c49-145d-4fb5-915f-e0cd557bcd29",
            "id_evento": "f0ee1aed-3af4-4207-8649-6013d61ee2d7",
            "id_ubicacion": "ChIJBRMhx-AdRI4RKgY4Mh7FuS0",
            "nombre": "El Pe\u00f1ol",
            "ubicacion_latitud": "6.2199662",
            "ubicacion_longitud": "-75.2435307"
        }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTU4NDMwOTksImlhdCI6MTcxNTg0MTI5OSwic3ViIjoiZjI5MjBmOWItZjA3MS00NGVkLTkwMzUtYzBmMDdlYzY4YzNmIn0.NQRCrSXZizBXGPke-ZGhsOlAhDqEJhdSz6kiaDEiilQ"
}

const _JSON_SERVICIOS_RECOMENDADOS_EVENTO = {
    "respuesta": [
        {
            "descripcion": "Se presta el servicio de hidrataci\u00f3n durante la competencia",
            "detalle": "Se presta el servicio de hidrataci\u00f3n durante la competencia",
            "id": "39d1d612-56b5-40dc-9bf8-676203356518",
            "id_deporte": "b5bde524-046d-4584-9a31-250c0de1e41a",
            "id_socio": "781c65f5-4580-41fe-beba-6f9672b1212d",
            "nombre": "Hidrataci\u00f3n",
            "valor": "20.0"
        },
    ],
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTU4NDMwOTksImlhdCI6MTcxNTg0MTI5OSwic3ViIjoiZjI5MjBmOWItZjA3MS00NGVkLTkwMzUtYzBmMDdlYzY4YzNmIn0.NQRCrSXZizBXGPke-ZGhsOlAhDqEJhdSz6kiaDEiilQ"
}

const _JSON_SOCIOS = {
    "respuesta": [
        {
            "apellido": "Fernadez",
            "detalle": "Socio de deporte",
            "email": "sociof@gmail.com",
            "id": "780f59a1-b719-45f7-a7b7-d8ce6691d825",
            "nombre": "Fernanda",
            "numero_identificacion": "123456",
            "tipo_id": "CC",
            "username": "fernanda.fernandez"
        },
    ],
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTU4NDQ4MTAsImlhdCI6MTcxNTg0MzAxMCwic3ViIjoiZjI5MjBmOWItZjA3MS00NGVkLTkwMzUtYzBmMDdlYzY4YzNmIn0.ikQkYVSXJEKZstY98C4HJL3Jv79RovELblKXyUPsU1A"
}

const _JSON_DETALLE_SOCIOS = {
    "respuesta": 
        {
            "apellido": "Fernadez",
            "detalle": "Socio de deporte",
            "email": "sociof@gmail.com",
            "id": "780f59a1-b719-45f7-a7b7-d8ce6691d825",
            "nombre": "Fernanda",
            "numero_identificacion": "123456",
            "tipo_id": "CC",
            "username": "fernanda.fernandez"
        },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTU4NDQ4MTAsImlhdCI6MTcxNTg0MzAxMCwic3ViIjoiZjI5MjBmOWItZjA3MS00NGVkLTkwMzUtYzBmMDdlYzY4YzNmIn0.ikQkYVSXJEKZstY98C4HJL3Jv79RovELblKXyUPsU1A"
}

const _JSON_DIRECCION_DEPORTISTA = {
    "direccion": "Laureles - Estadio, Medellin, Medell\u00edn, Laureles, Medellin, Antioquia, Colombia",
    "id": "7448cc04-6ac5-48a1-9de4-68529f371677",
    "id_direccion": "ChIJM_bPTgcpRI4RQ3TBut_5hpk",
    "id_usuario": "f2920f9b-f071-44ed-9035-c0f07ec68c3f",
    "nombre": "La Macarena",
    "ubicacion_latitud": "6.2495185",
    "ubicacion_longitud": "-75.5805318"
}

test.beforeEach(async ({ page }) => {
    //Mock consulta eventos deportista exitoso
    await page.route('**/administracion/eventos-deportista', async route => {
        await route.fulfill({ json: _JSON_DEPORTISTA });
    });
    // Mock consulta eventos próximos
    await page.route('**/administracion/eventos', async route => {
        await route.fulfill({ json: _JSON_EVENTOS });
    });

    // Mock consulta eventos cercanos
    await page.route('**/administracion/eventos-cercanos?**', async route => {
        await route.fulfill({ json: _JSON_EVENTOS });
    });

    // Mock consulta detalle evento
    await page.route('**/administracion/eventos/**', async route => {
        await route.fulfill({ json: _JSON_DETALLE_EVENTO });
    });

    // Mock servicios recomendados
    await page.route('**/administracion/evento/**/servicios', async route => {
        await route.fulfill({ json: _JSON_SERVICIOS_RECOMENDADOS_EVENTO });
    });

    // Mock asignacion exitosa de servicio recomendado
    await page.route('**/administracion/evento', async route => {
        await route.fulfill({ json: {"respuesta": "Evento registrado con \u00e9xito"} });
    });

    // Mock socios
    await page.route('**/administracion/socios', async route => {
        await route.fulfill({ json: _JSON_SOCIOS });
    });

    // Mock detalle socios
    await page.route('**/administracion/socios/**', async route => {
        await route.fulfill({ json: _JSON_DETALLE_SOCIOS });
    });

    //Mock direcciones
    await page.route('https://places.googleapis.com/v1/places:searchText', async route => {
      const json = {"places": [{"id": "ChIJQbTMs8qbP44RLHWo4fiEkEg", "formattedAddress":"Carrera 30 y Calle 57, Bogotá, Colombia", "location": {"latitude": 4.6458552,"longitude": -74.077377099999993}, "displayName": {"text": "Nemesio Camacho El Campín Stadium"}}]};
      await route.fulfill({ json });
    });

    // Mock creación exitosa evento
    await page.route('**/administracion/deportista/servicio/**', async route => {
        await route.fulfill({ json: {"respuesta": "Servicio asignado exitosamente"} });
    });

    // Mock direccion deportista
    await page.route('**/personas/persona/direccion', async route => {
        await route.fulfill({ json: _JSON_DIRECCION_DEPORTISTA });
    });

    await page.goto("/");
    await page.getByPlaceholder("Correo", {exact: true}).fill('correo@gmail.com');
    await page.getByPlaceholder("Contraseña", {exact: true}).fill('123456');

    // Clic al botón de iniciar sesión
    await page.getByRole('button', {name: 'ingresar'}).click()
    await expect(page).toHaveURL(_URL_SOCIOS)

    // Clic a la sección de "Eventos"
    await page.locator('[href="/eventos"]').click()
    await expect(page).toHaveURL(_URL_EVENTOS)
});
 
test.describe('Pantalla Eventos', () => {

    test('Debería mostrar campo de búsqueda', async ({ page }) => {
        // Buscar el elemento con el campo de búsqueda
        const cuadroBusqueda = page.getByPlaceholder("Buscar eventos ...", {exact: true});
        await expect(cuadroBusqueda).toBeVisible()
    });

    test('Debería mostrar campo de filtro de eventos', async ({ page }) => {
        // Buscar el elemento con el campo de búsqueda
        const campo = page.getByTestId("select-eventos");
        await expect(campo).toBeVisible()
    });

    test('Deberia mostrar lista de mis eventos', async ({ page }) => {
        // Buscar el elemento con las card de mis eventos
        await page.waitForTimeout(1000);
        const cardsEventos = await page.getByTestId("eventos-card").count();
        expect(cardsEventos).toBeGreaterThan(0)
        
    })

    test('Debería buscar en mis eventos por texto', async ({ page }) => {
        // Buscar un nombre de evento y llenar el campo de búsqueda con el nombre
        await page.getByPlaceholder("Buscar eventos ...", {exact: true}).fill("Entr")

        // Se debe mostrar al menos una carta con eventos
        await page.waitForTimeout(1000);
        const cardsEventos = await page.getByTestId("eventos-card").count();
        expect(cardsEventos).toBeGreaterThan(0)
    })

    test('Debería buscar mis eventos por texto sin resultados', async ({ page }) => {
        // Buscar un nombre de evento y llenar el campo de búsqueda con el nombre
        await page.getByPlaceholder("Buscar eventos ...", {exact: true}).fill("qwertyuiop")

        // No se debe mostrar cartas con eventos
        await page.waitForTimeout(1000);
        const cardsEventos = await page.getByTestId("eventos-card").count();
        expect(cardsEventos).toBe(0)
    });

    test('Debería mostrar lista de eventos próximos', async ({ page }) => {
        // Seleccionar eventos próximos
        await page.getByTestId("select-eventos").selectOption("PROXIMOS")

        // Buscar el elemento con las card de eventos próximos
        await page.waitForTimeout(1000);
        const cardsEventos = await page.getByTestId("eventos-card").count();
        expect(cardsEventos).toBeGreaterThan(0)
    })

    test('Debería buscar en eventos próximos por texto', async ({ page }) => {
       // Seleccionar eventos próximos
        await page.getByTestId("select-eventos").selectOption("PROXIMOS")

        // Buscar un nombre de evento y llenar el campo de búsqueda con el nombre
        await page.getByPlaceholder("Buscar eventos ...", {exact: true}).fill("Comp")

        // Se debe mostrar al menos una carta con eventos
        await page.waitForTimeout(1000);
        const cardsEventos = await page.getByTestId("eventos-card").count();
        expect(cardsEventos).toBeGreaterThan(0)
    })

    test('Debería buscar eventos próximos por texto sin resultados', async ({ page }) => {
        // Seleccionar eventos próximos
        await page.getByTestId("select-eventos").selectOption("PROXIMOS")

        // Buscar un nombre de evento y llenar el campo de búsqueda con el nombre
        await page.getByPlaceholder("Buscar eventos ...", {exact: true}).fill("qwertyuiop")

        // No se debe mostrar cartas con eventos
        await page.waitForTimeout(1000);
        const cardsEventos = await page.getByTestId("eventos-card").count();
        expect(cardsEventos).toBe(0)
    });

    test('Debería mostrar lista de eventos cercanos', async ({ page }) => {
        // Seleccionar eventos cercanos
        await page.getByTestId("select-eventos").selectOption("CERCANOS")

        // Buscar el elemento con las card de evnetos cercanos
        await page.waitForTimeout(1000);
        const cardsEventos = await page.getByTestId("eventos-card").count();
        expect(cardsEventos).toBeGreaterThan(0)
    })


    test('Debería buscar eventos cercanos por texto sin resultados', async ({ page }) => {
        // Seleccionar eventos cercanos
        await page.getByTestId("select-eventos").selectOption("CERCANOS")

        // Buscar un nombre de evento y llenar el campo de búsqueda con el nombre
        await page.getByPlaceholder("Buscar eventos ...", {exact: true}).fill("qwertyuiop")

        // No se debe mostrar cartas con eventos
        await page.waitForTimeout(1000);
        const cardsEventos = await page.getByTestId("eventos-card").count();
        expect(cardsEventos).toBe(0)
    });

    test('Debería inscribirme en evento proximo', async ({ page }) => {
        //Mock registro a evento
        await page.route('**/administracion/deportista/evento/**', async route => {
            await route.fulfill({json: {"respuesta": "Evento asignado correctamente al deportista"}});
        });

        // Seleccionar eventos proximos
        await page.getByTestId("select-eventos").selectOption("PROXIMOS")

        // Clic en el botón de registrame
        await page.waitForTimeout(1000);
        const boton = page.getByTestId("inscribirme").first()
        if (await boton.isEnabled()){
            await boton.click()

            // Mostrar mensaje de exito
            await page.waitForTimeout(1000);
            await expect(page.getByTestId('evento-asignado-exitoso')).toBeVisible();
        }  
        
    });

    test('Debería retirarme de evento proximo', async ({ page }) => {
        //Mock retiro a evento
        await page.route('**/administracion/deportista/evento/**', async route => {
            await route.fulfill({json: {"respuesta": "Evento eliminado correctamente de la agenda del deportista"}});
        });

        // Seleccionar eventos proximos
        await page.getByTestId("select-eventos").selectOption("DEPORTISTA")

        // Clic en el botón de registrame
        await page.waitForTimeout(1000);
        const boton = page.getByTestId("retirarme").first()
        await boton.click()

        // Mostrar mensaje de exito
        await expect(page.getByTestId('evento-eliminado-exitoso')).toBeVisible();
    });

    test('Debería inscribirme en evento cercano', async ({ page }) => {
        //Mock registro a evento
        await page.route('**/administracion/deportista/evento/**', async route => {
            await route.fulfill({json: {"respuesta": "Evento asignado correctamente al deportista"}});
        });
        // Seleccionar eventos cercanos
        await page.getByTestId("select-eventos").selectOption("CERCANOS")

        // Clic en el botón de registrame
        await page.waitForTimeout(1000);
        const boton = page.getByTestId("inscribirme").first()
        if (await boton.isVisible() && boton.isEnabled()){
            await boton.click()

            // Mostrar mensaje de exito
            await page.waitForTimeout(1000);
            await expect(page.getByTestId('evento-asignado-exitoso')).toBeVisible();
        }  
        
    });

    test('Debería retirarme de evento cercano', async ({ page }) => {
        //Mock retiro a evento
        await page.route('**/administracion/deportista/evento/**', async route => {
            await route.fulfill({json: {"respuesta": "Evento eliminado correctamente de la agenda del deportista"}});
        });

        // Seleccionar eventos deportista
        await page.getByTestId("select-eventos").selectOption("DEPORTISTA")

        // Clic en el botón de registrame
        await page.waitForTimeout(1000);
        const boton = page.getByTestId("retirarme").first()
        await boton.click()

        // Mostrar mensaje de exito
        await expect(page.getByTestId('evento-eliminado-exitoso')).toBeVisible();
    });
});

test.describe('Pantalla Detalle Eventos', () => {

    test('Debería ver detalle desde mis eventos', async ({ page }) => {
        // Seleccionar eventos deportista
        await page.getByTestId("select-eventos").selectOption("DEPORTISTA")

        // Clic en el botón de registrame
        await page.waitForTimeout(1000);
        const boton = page.getByTestId("ver-detalle").first()
        const idEvento = await boton.getAttribute("evento-id")
        await boton.click()
        await expect(page).toHaveURL("/eventos/"+idEvento)

        // Mostrar información del evento
        const detalleEvento = await page.getByTestId("detalle-evento").inputValue()
        expect(detalleEvento).toEqual(_JSON_DETALLE_EVENTO["respuesta"]["detalle"])
    });

    test('Debería ver detalle desde eventos próximos', async ({ page }) => {
        // Seleccionar eventos deportista
        await page.getByTestId("select-eventos").selectOption("PROXIMOS")

        // Clic en el botón de registrame
        await page.waitForTimeout(1000);
        const boton = page.getByTestId("ver-detalle").first()
        const idEvento = await boton.getAttribute("evento-id")
        await boton.click()
        await expect(page).toHaveURL("/eventos/"+idEvento)

        // Mostrar información del evento
        const detalleEvento = await page.getByTestId("detalle-evento").inputValue()
        expect(detalleEvento).toEqual(_JSON_DETALLE_EVENTO["respuesta"]["detalle"])
    });

    test('Debería ver detalle desde eventos cercanos', async ({ page }) => {
        // Seleccionar eventos deportista
        await page.getByTestId("select-eventos").selectOption("CERCANOS")

        // Clic en el botón de registrame
        await page.waitForTimeout(1000);
        const boton = page.getByTestId("ver-detalle").first()
        const idEvento = await boton.getAttribute("evento-id")
        await boton.click()
        await expect(page).toHaveURL("/eventos/"+idEvento)

        // Mostrar información del evento
        const detalleEvento = await page.getByTestId("detalle-evento").inputValue()
        expect(detalleEvento).toEqual(_JSON_DETALLE_EVENTO["respuesta"]["detalle"])
    });

    test('Debería modificar evento', async ({ page }) => {
        // Seleccionar eventos deportista
        await page.getByTestId("select-eventos").selectOption("DEPORTISTA")

        // Clic en el botón de registrame
        await page.waitForTimeout(1000);
        const boton = page.getByTestId("ver-detalle").first()
        const idEvento = await boton.getAttribute("evento-id")
        await boton.click()
        await expect(page).toHaveURL("/eventos/"+idEvento)

        // Clic campo de modificar
        await page.getByTestId("modificar-evento").click()
        await page.waitForTimeout(1000);
        await expect(page).toHaveURL("/modificar-evento/"+idEvento)

        // Verificar información del evento
        await page.getByPlaceholder("Nombres", {exact: true}).inputValue(_JSON_DETALLE_EVENTO["respuesta"]["nombre"]);
        await page.getByPlaceholder("Direccion", {exact: true}).inputValue(_JSON_DETALLE_EVENTO["respuesta"]["ubicacion"]["nombre"]);
        await page.getByPlaceholder("Detalles", {exact: true}).inputValue(_JSON_DETALLE_EVENTO["respuesta"]["detalle"]);
    });

});

test.describe('Pantalla Crear Evento', () => {
    test('Debería mostrar boton de crear evento', async ({ page }) => {
        // Buscar el elemento con el campo de búsqueda
        const campo = page.getByTestId("crear-evento");
        await expect(campo).toBeVisible()
    });

    test('Debería crear evento', async ({ page }) => {

        // Buscar el elemento con el campo de búsqueda
        const campo = page.getByTestId("crear-evento");
        await expect(campo).toBeVisible()
        await campo.click()

        // Llenar información del evento
        await page.getByPlaceholder("Nombres", {exact: true}).fill("Nombre evento")

        await page.getByPlaceholder("Direccion", {exact: true}).fill("mapa");
        await page.getByTestId("direccion-1").click();

        await page.locator('[aria-label="Select"]').nth(0).click()
        await page.locator('[aria-label="Wednesday, May 22, 2024"]').click()
        await page.keyboard.press('Enter');
        
        await page.locator('[aria-label="Select"]').nth(1).click()
        await page.locator('[data-value="2024/05/24"]').nth(1).click()
        await page.keyboard.press('Enter');
        
        await page.getByTestId('socio-negocio').selectOption({index: 1})
        await page.getByTestId('deporte').selectOption({index: 1})

        await page.getByPlaceholder("Detalles", {exact: true}).fill("Detalles del evento")

        await page.getByTestId('guardar-evento').click()

        const respuesta = page.getByTestId('guardo-exitoso')
        await expect(respuesta).toBeVisible()
        
    });
})

test.describe('Pantalla Servicios Recomendados', () => {
    test('Debería ver los servicios recomendados del evento', async ({ page }) => {
        // Seleccionar eventos deportista
        await page.getByTestId("select-eventos").selectOption("DEPORTISTA")

        // Clic en el botón de registrame
        await page.waitForTimeout(1000);
        const boton = page.getByTestId("ver-detalle").first()
        const idEvento = await boton.getAttribute("evento-id")
        await boton.click()
        await expect(page).toHaveURL("/eventos/"+idEvento)

        // Clic al botón de servciios recomendados
        await page.getByTestId("btn-servicios-recomendados").click()
        await expect(page).toHaveURL("/eventos/"+idEvento+"/servicios")

        // Campo de búsqueda
        const cuadroBusqueda = page.getByPlaceholder("Buscar servicio recomendado para el evento ...", {exact: true});
        await expect(cuadroBusqueda).toBeVisible()

        // Cards con los servicios recomendados
        const cardsServiciosRecomendados = await page.getByTestId("card-servicio-recomendado").count();
        expect(cardsServiciosRecomendados).toBeGreaterThan(0)
        
    });

    test('Debería filtrar servicios recomendados del evento', async ({ page }) => {
        // Seleccionar eventos deportista
        await page.getByTestId("select-eventos").selectOption("DEPORTISTA")

        // Clic en el botón de registrame
        await page.waitForTimeout(1000);
        const boton = page.getByTestId("ver-detalle").first()
        const idEvento = await boton.getAttribute("evento-id")
        await boton.click()
        await expect(page).toHaveURL("/eventos/"+idEvento)

        // Clic al botón de servciios recomendados
        await page.getByTestId("btn-servicios-recomendados").click()
        await expect(page).toHaveURL("/eventos/"+idEvento+"/servicios")

        // Campo de búsqueda
        const cuadroBusqueda = page.getByPlaceholder("Buscar servicio recomendado para el evento ...", {exact: true});
        await expect(cuadroBusqueda).toBeVisible()

        // Buscar un servicio recomendado y llenar el campo de búsqueda con el nombre
        await page.getByPlaceholder("Buscar servicio recomendado para el evento ...", {exact: true}).fill("Hidr")

        // Cards con los servicios recomendados
        const cardsServiciosRecomendados = await page.getByTestId("card-servicio-recomendado").count();
        expect(cardsServiciosRecomendados).toBeGreaterThan(0)
        
    });

    test('Debería filtrar servicios recomendados del evento sin resultados', async ({ page }) => {
        // Seleccionar eventos deportista
        await page.getByTestId("select-eventos").selectOption("DEPORTISTA")

        // Clic en el botón de registrame
        await page.waitForTimeout(1000);
        const boton = page.getByTestId("ver-detalle").first()
        const idEvento = await boton.getAttribute("evento-id")
        await boton.click()
        await expect(page).toHaveURL("/eventos/"+idEvento)

        // Clic al botón de servciios recomendados
        await page.getByTestId("btn-servicios-recomendados").click()
        await expect(page).toHaveURL("/eventos/"+idEvento+"/servicios")

        // Campo de búsqueda
        const cuadroBusqueda = page.getByPlaceholder("Buscar servicio recomendado para el evento ...", {exact: true});
        await expect(cuadroBusqueda).toBeVisible()

        // Buscar un servicio recomendado y llenar el campo de búsqueda con el nombre
        await page.getByPlaceholder("Buscar servicio recomendado para el evento ...", {exact: true}).fill("qwertyuiop")

        // Cards con los servicios recomendados
        const cardsServiciosRecomendados = await page.getByTestId("card-servicio-recomendado").count();
        expect(cardsServiciosRecomendados).toBe(0)
        
    });

    test('Debería solicitar servicios recomendados del evento', async ({ page }) => {
        // Seleccionar eventos deportista
        await page.getByTestId("select-eventos").selectOption("DEPORTISTA")

        // Clic en el botón de registrame
        await page.waitForTimeout(1000);
        const boton = page.getByTestId("ver-detalle").first()
        const idEvento = await boton.getAttribute("evento-id")
        await boton.click()
        await expect(page).toHaveURL("/eventos/"+idEvento)

        // Clic al botón de servciios recomendados
        await page.getByTestId("btn-servicios-recomendados").click()
        await expect(page).toHaveURL("/eventos/"+idEvento+"/servicios")

        // Cards con los servicios recomendados
        const cardsServiciosRecomendados = await page.getByTestId("card-servicio-recomendado").count();
        expect(cardsServiciosRecomendados).toBeGreaterThan(0)

        // Clic a solicitar servicio
        await page.getByTestId("solicitar-recomendado").first().click()
        await page.waitForTimeout(1000);
        await expect(page.getByTestId('asignacion-exitosa')).toBeVisible();
        
    });
})

