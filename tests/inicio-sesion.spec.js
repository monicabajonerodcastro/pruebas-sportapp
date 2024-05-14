const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe('Iniciar sesión', () => {
  test('Debería iniciar sesión', async ({ page }) => {
    // Llenar los datos de inicio de sesión
    await page.getByPlaceholder("Correo", {exact: true}).fill('correo@gmail.com');
    await page.getByPlaceholder("Contraseña", {exact: true}).fill('123456');

    // Clic al botón de iniciar sesión
    await page.getByRole('button', {name: 'ingresar'}).click()

    // Verificar el inicio de sesión exitosamente
    await expect(page).toHaveURL("/socios")
  })
});

test.describe('Validaciones al iniciar sesión', () => {
  test('Debería mostrar mensaje error usuario requerido en inicio de sesión', async ({ page }) => {
    // No ingresar información en el campo de usuario 
    await page.getByPlaceholder("Correo", {exact: true}).fill('');
    await page.getByPlaceholder("Correo", {exact: true}).blur();

    // Buscar el elemento con la alerta de correo requerido
    const alerta = page.getByTestId("alerta-correo");
    const mensajeAlerta = await alerta.textContent()

    // Verificar el mensaje de alerta
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("Se requiere el usuario")
  })

  test('Debería mostrar mensaje error contraseña requerida en inicio de sesión', async ({ page }) => {
    // No ingresar información en el campo de contraseña 
    await page.getByPlaceholder("Contraseña", {exact: true}).fill('');
    await page.getByPlaceholder("Contraseña", {exact: true}).blur();

    // Buscar el elemento con la alerta de contraseña requerida
    const alerta = page.getByTestId("alerta-contrasenia");
    const mensajeAlerta = await alerta.textContent()

    // Verificar el mensaje de alerta
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("Se requiere la contraseña")
  })
})

test.describe('Crear cuenta', () => {
  test('Debería abrir el formulario de crear cuenta', async ({ page }) => {
    // Clic al botón de iniciar sesión
    await page.getByTestId('crear-cuenta').click()

    // Verificar el inicio de sesión exitosamente
    await expect(page).toHaveURL("/registro")
  })
});

