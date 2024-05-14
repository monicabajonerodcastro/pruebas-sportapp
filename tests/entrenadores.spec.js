const { test, expect } = require('@playwright/test');

const _URL_SOCIOS = "/socios"
const _URL_SERVICIOS_PRODUCTOS = "/reuniones/disponibles"

const _JSON_REUNIONES_DISPONIBLES = {
    "respuesta": [
      {
        "detalle_entrenador": "Socio de cuidado corporal",
        "fecha": "28/05/24 00:00",
        "id": "7021109e-8046-4f93-aab2-ecd9f2e907c5",
        "id_entrenador": "e0127e1e-c9cf-4f92-b069-ffd2e4f2c84b",
        "id_usuario": null,
        "lugar": "Compensar Av. 68",
        "nombre_entrenador": "Pedro Levy"
      }
    ],
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTU4NDE2NDEsImlhdCI6MTcxNTgzOTg0MSwic3ViIjoiZjI5MjBmOWItZjA3MS00NGVkLTkwMzUtYzBmMDdlYzY4YzNmIn0.dABwtEKTG367QKGUIj1ElMDzrb6i_mB-u1SycrhrBkI"
  }

test.beforeEach(async ({ page }) => {
    //Mock reuniones disponibles
    await page.route('**/administracion/reuniones/disponibles', async route => {
        await route.fulfill({ json: _JSON_REUNIONES_DISPONIBLES });
    });
    await page.goto("/");
    await page.getByPlaceholder("Correo", {exact: true}).fill('correo@gmail.com');
    await page.getByPlaceholder("Contraseña", {exact: true}).fill('123456');

    // Clic al botón de iniciar sesión
    await page.getByRole('button', {name: 'ingresar'}).click()
    await expect(page).toHaveURL(_URL_SOCIOS)

  // Clic a la sección de "Entrenadores"
  await page.locator('[href="/reuniones/disponibles"]').click()
  await expect(page).toHaveURL(_URL_SERVICIOS_PRODUCTOS)
});
 
test.describe('Pantalla Entrenadores', () => {
    test('Debería mostrar campo de búsqueda', async ({ page }) => {
        // Buscar el elemento con el campo de búsqueda
        const cuadroBusqueda = page.getByPlaceholder("Buscar reunión disponible ...", {exact: true});
        await expect(cuadroBusqueda).toBeVisible()
    })

    test('Debería mostrar lista de reuniones', async ({ page }) => {
        // Buscar el elemento con las card de reuniones
        await page.waitForTimeout(1000);
        const cardsReuniones = await page.getByTestId("reuniones-card").count();
        expect(cardsReuniones).toBeGreaterThan(0)
    })

    test('Debería buscar por texto', async ({ page }) => {
        // Buscar un nombre de entrenador y llenar el campo de búsqueda con el nombre
        await page.getByPlaceholder("Buscar reunión disponible ...", {exact: true}).fill("Pedro")

        // Se debe mostrar al menos una carta con reuniones
        await page.waitForTimeout(1000);
        const cardsServicios = await page.getByTestId("reuniones-card").count();
        expect(cardsServicios).toBeGreaterThan(0)
    })

    test('Debería buscar por texto sin resultados', async ({ page }) => {
        // Buscar un nombre de entrenador y llenar el campo de búsqueda con el nombre
        await page.getByPlaceholder("Buscar reunión disponible ...", {exact: true}).fill("qwertyuiop")

        // No se debe mostrar cartas con reuniones
        await page.waitForTimeout(1000);
        const cardsServicios = await page.getByTestId("reuniones-card").count();
        expect(cardsServicios).toBe(0)
    });

    test('Debería agendar reunión', async ({ page }) => {
        //Mock agendamiento exitoso
        await page.route('**/administracion/reunion/**', async route => {
            const json = {"description": "Reunión asignada con éxito"};
            await route.fulfill({ json });
        });

        // Click en el botón de agendar sesion
        await page.getByTestId("agendar-sesion").first().click()
        await expect(page.getByTestId('asignacion-exitosa')).toBeVisible();

    });
});

