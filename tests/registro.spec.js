const { test, expect } = require('@playwright/test');

const _URL_REGISTRO = "/registro"
const _URL_PERFIL_DEPORTIVO = "/perfil-deportista"

test.beforeEach(async ({ page }) => {
  await page.goto(_URL_REGISTRO);
});

test.describe('Registrar', () => {
  test('Debería guardar', async ({ page }) => {

    //Mock registro usuario exitoso
    await page.route('**/personas/usuario', async route => {
      const json = {"description": "Usuario Registrado con exito","id": "09c66758-3bf5-413b-b555-7e9eeac6011c"};
      await route.fulfill({ json });
    });

    //Mock registro perfil deportivo exitoso
    await page.route('**/personas/perfildeportivo', async route => {
      const json = {"description": "Perfil Deportivo Registrado con exito","id": "09c66758-3bf5-413b-b555-7e9eeac6011c"};
      await route.fulfill({ json });
    });

    //Mock direcciones
    await page.route('https://places.googleapis.com/v1/places:searchText', async route => {
      const json = {"places": [{"id": "ChIJQbTMs8qbP44RLHWo4fiEkEg", "formattedAddress":"Carrera 30 y Calle 57, Bogotá, Colombia", "location": {"latitude": 4.6458552,"longitude": -74.077377099999993}, "displayName": {"text": "Nemesio Camacho El Campín Stadium"}}]};
      await route.fulfill({ json });
    });
    
    // Ir al perfil deportivo 
    await page.getByRole('button', {name: ' Perfil deportivo '}).click()
    await expect(page).toHaveURL(_URL_PERFIL_DEPORTIVO)

    // Llenar los datos del perfil deportivo 
    await page.getByTestId('genero').selectOption({ label: 'Masculino' });
    await page.getByPlaceholder("Edad", {exact: true}).fill("30");
    await page.getByPlaceholder("Peso", {exact: true}).fill("60");
    await page.getByPlaceholder("Altura", {exact: true}).fill("160");

    await page.getByTestId('paisNacimiento').selectOption({ value: 'AR' });
    await page.getByTestId('paisResidencia').selectOption({ value: 'AR' });

    await page.getByPlaceholder("Antigüedad", {exact: true}).fill("5");

    await page.getByTestId('tipoSangre').selectOption({ label: 'O+' });
    await page.getByPlaceholder("IMC", {exact: true}).fill("40");
    await page.getByPlaceholder("Horas ejercicio por semana", {exact: true}).fill("7");
    await page.getByPlaceholder("Peso objetivo", {exact: true}).fill("55");

    await page.getByPlaceholder("Alergias", {exact: true}).fill("N/A");
    await page.getByTestId('deporte').selectOption({ label: 'Ciclismo' });

    await page.getByPlaceholder("Preferencia Alimentaria", {exact: true}).fill("Ninguna");
    await page.getByPlaceholder("Plan Nutricional", {exact: true}).fill("Ninguno");
    await page.getByPlaceholder("Historia Clinica", {exact: true}).fill("No tiene");

    await page.waitForTimeout(2000);
    await page.getByTestId('ciudadNacimiento').selectOption({ value: 'AA' });
    await page.getByTestId('ciudadResidencia').selectOption({ value: 'AA' });

    await page.getByRole('button', {name: ' Guardar '}).click()
    await expect(page).toHaveURL(_URL_REGISTRO)

    // Llenar los datos del registro
    await page.getByPlaceholder("Nombres", {exact: true}).fill("Monica");
    await page.getByPlaceholder("Apellidos", {exact: true}).fill("Bajonero");

    await page.getByPlaceholder("Usuario", {exact: true}).fill("monicabajonero1");
    await page.getByPlaceholder("E-mail", {exact: true}).fill("monicabajonero@gmail.com");

    await page.getByTestId('tipoIdenficacion').selectOption({ label: 'CC' });
    await page.getByPlaceholder("Número de identificación", {exact: true}).fill("1072660");

    await page.getByPlaceholder("Direccion", {exact: true}).fill("mapa");
    await page.getByTestId("direccion-1").click();

    await page.getByPlaceholder("Contraseña", {exact: true}).fill("123456");
    await page.getByPlaceholder("Confirmar contraseña", {exact: true}).fill("123456");

    await page.getByTestId('suscripcion').selectOption({ label: 'Plan Básico' });

    // Enviar datos de registro
    await page.getByRole('button', {name: ' Crear cuenta '}).click()
    await expect(page.getByTestId('exitoRegistro')).toBeVisible();
  })
});

test.describe('Validaciones Perfil Deportivo', () => {
  test('Validaciones perfil deportivo - Campo: Género', async ({ page }) => {
    
    // Ir al perfil deportivo 
    await page.getByRole('button', {name: ' Perfil deportivo '}).click()
    await expect(page).toHaveURL(_URL_PERFIL_DEPORTIVO)

    const campo = page.getByTestId("genero"); 

    // Clic en el campo sin llenar información
    await campo.click();
    await campo.blur();

    // Buscar mensaje de alerta
    const alerta = page.getByTestId("alerta-genero");
    const mensajeAlerta = await alerta.textContent()

    // Validar
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("El género es requerido")
  })

  test('Validaciones perfil deportivo - Campo: Edad', async ({ page }) => {
    
    // Ir al perfil deportivo 
    await page.getByRole('button', {name: ' Perfil deportivo '}).click()
    await expect(page).toHaveURL(_URL_PERFIL_DEPORTIVO)

    const campo = page.getByPlaceholder("Edad", {exact: true})

    // Clic en el campo sin llenar información
    await campo.fill("");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    let alerta = page.getByTestId("alerta-edad");
    let mensajeAlerta = await alerta.textContent()

    // Validar requerido
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("La edad es requerida")

    // Llenar el campo con campo menor al mínimo
    await campo.fill("9");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    alerta = page.getByTestId("alerta-edad-min");
    mensajeAlerta = await alerta.textContent()

    // Validar valor mínimo
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("La edad debe ser mayor a 10 años")

    // Llenar el campo con campo menor al máximo
    await campo.fill("100");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    alerta = page.getByTestId("alerta-edad-max");
    mensajeAlerta = await alerta.textContent()

    // Validar valor mínimo
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("La edad debe ser menor a 99 años")
  })

  test('Validaciones perfil deportivo - Campo: Peso', async ({ page }) => {
    
    // Ir al perfil deportivo 
    await page.getByRole('button', {name: ' Perfil deportivo '}).click()
    await expect(page).toHaveURL(_URL_PERFIL_DEPORTIVO)

    const campo = page.getByPlaceholder("Peso", {exact: true})

    // Clic en el campo sin llenar información
    await campo.fill("");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    let alerta = page.getByTestId("alerta-peso");
    let mensajeAlerta = await alerta.textContent()

    // Validar requerido
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("El peso es requerido")

    // Llenar el campo con campo menor al mínimo
    await campo.fill("19");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    alerta = page.getByTestId("alerta-peso-min");
    mensajeAlerta = await alerta.textContent()

    // Validar valor mínimo
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("El peso debe ser mayor a 20 kg")

    // Llenar el campo con campo menor al máximo
    await campo.fill("181");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    alerta = page.getByTestId("alerta-peso-max");
    mensajeAlerta = await alerta.textContent()

    // Validar valor mínimo
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("El peso debe ser menor a 180 kg")
  })

  test('Validaciones perfil deportivo - Campo: Altura', async ({ page }) => {
    
    // Ir al perfil deportivo 
    await page.getByRole('button', {name: ' Perfil deportivo '}).click()
    await expect(page).toHaveURL(_URL_PERFIL_DEPORTIVO)

    const campo = page.getByPlaceholder("Altura", {exact: true})

    // Clic en el campo sin llenar información
    await campo.fill("");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    let alerta = page.getByTestId("alerta-altura");
    let mensajeAlerta = await alerta.textContent()

    // Validar requerido
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("La altura es requerida")

    // Llenar el campo con campo menor al mínimo
    await campo.fill("49");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    alerta = page.getByTestId("alerta-altura-min");
    mensajeAlerta = await alerta.textContent()

    // Validar valor mínimo
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("La altura debe ser mayor a 50 cm")

    // Llenar el campo con campo menor al máximo
    await campo.fill("251");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    alerta = page.getByTestId("alerta-altura-max");
    mensajeAlerta = await alerta.textContent()

    // Validar valor mínimo
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("La altura debe ser menor a 250 cm")
  })

  test('Validaciones perfil deportivo - Campo: País Nacimiento', async ({ page }) => {
    
    // Ir al perfil deportivo 
    await page.getByRole('button', {name: ' Perfil deportivo '}).click()
    await expect(page).toHaveURL(_URL_PERFIL_DEPORTIVO)

    const campo = page.getByTestId("paisNacimiento"); 

    // Clic en el campo sin llenar información
    await campo.click();
    await campo.blur();

    // Buscar mensaje de alerta
    const alerta = page.getByTestId("alerta-pais-nacimiento");
    const mensajeAlerta = await alerta.textContent()

    // Validar
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("Se requiere el país de nacimiento")
  })

  test('Validaciones perfil deportivo - Campo: Ciudad Nacimiento', async ({ page }) => {
    
    // Ir al perfil deportivo 
    await page.getByRole('button', {name: ' Perfil deportivo '}).click()
    await expect(page).toHaveURL(_URL_PERFIL_DEPORTIVO)

    const campo = page.getByTestId("ciudadNacimiento"); 

    // Clic en el campo sin llenar información
    await campo.click();
    await campo.blur();

    // Buscar mensaje de alerta
    const alerta = page.getByTestId("alerta-ciudad-nacimiento");
    const mensajeAlerta = await alerta.textContent()

    // Validar
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("Se requiere la ciudad de nacimiento")
  })

  test('Validaciones perfil deportivo - Campo: País Residencia', async ({ page }) => {
    
    // Ir al perfil deportivo 
    await page.getByRole('button', {name: ' Perfil deportivo '}).click()
    await expect(page).toHaveURL(_URL_PERFIL_DEPORTIVO)

    const campo = page.getByTestId("paisResidencia"); 

    // Clic en el campo sin llenar información
    await campo.click();
    await campo.blur();

    // Buscar mensaje de alerta
    const alerta = page.getByTestId("alerta-pais-residencia");
    const mensajeAlerta = await alerta.textContent()

    // Validar
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("Se requiere el país de residencia")
  })

  test('Validaciones perfil deportivo - Campo: Ciudad Residencia', async ({ page }) => {
    
    // Ir al perfil deportivo 
    await page.getByRole('button', {name: ' Perfil deportivo '}).click()
    await expect(page).toHaveURL(_URL_PERFIL_DEPORTIVO)

    const campo = page.getByTestId("ciudadResidencia"); 

    // Clic en el campo sin llenar información
    await campo.click();
    await campo.blur();

    // Buscar mensaje de alerta
    const alerta = page.getByTestId("alerta-ciudad-residencia");
    const mensajeAlerta = await alerta.textContent()

    // Validar
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("Se requiere la ciudad de residencia")
  })

  test('Validaciones perfil deportivo - Campo: Antigüedad', async ({ page }) => {
    
    // Ir al perfil deportivo 
    await page.getByRole('button', {name: ' Perfil deportivo '}).click()
    await expect(page).toHaveURL(_URL_PERFIL_DEPORTIVO)

    const campo = page.getByPlaceholder("Antigüedad", {exact: true})

    // Clic en el campo sin llenar información
    await campo.fill("");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    let alerta = page.getByTestId("alerta-antiguedad");
    let mensajeAlerta = await alerta.textContent()

    // Validar requerido
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("Se requiere la antigüedad en años")

    // Llenar el campo con campo menor al mínimo
    await campo.fill("0");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    alerta = page.getByTestId("alerta-antiguedad-min");
    mensajeAlerta = await alerta.textContent()

    // Validar valor mínimo
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("La antigüedad debe ser mayor o igual a 1 año")

    // Llenar el campo con campo menor al máximo
    await campo.fill("100");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    alerta = page.getByTestId("alerta-antiguedad-max");
    mensajeAlerta = await alerta.textContent()

    // Validar valor mínimo
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("La antigüedad debe ser menor a 99 años")
  })

  test('Validaciones perfil deportivo - Campo: Tipo Sangre', async ({ page }) => {
    
    // Ir al perfil deportivo 
    await page.getByRole('button', {name: ' Perfil deportivo '}).click()
    await expect(page).toHaveURL(_URL_PERFIL_DEPORTIVO)

    const campo = page.getByTestId("tipoSangre"); 

    // Clic en el campo sin llenar información
    await campo.click();
    await campo.blur();

    // Buscar mensaje de alerta
    const alerta = page.getByTestId("alerta-tipo-sangre");
    const mensajeAlerta = await alerta.textContent()

    // Validar
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("El tipo de sangre es requerido")
  })

  test('Validaciones perfil deportivo - Campo: IMC', async ({ page }) => {
    
    // Ir al perfil deportivo 
    await page.getByRole('button', {name: ' Perfil deportivo '}).click()
    await expect(page).toHaveURL(_URL_PERFIL_DEPORTIVO)

    const campo = page.getByPlaceholder("IMC", {exact: true})

    // Clic en el campo sin llenar información
    await campo.fill("");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    let alerta = page.getByTestId("alerta-imc");
    let mensajeAlerta = await alerta.textContent()

    // Validar requerido
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("El IMC es requerido")

    // Llenar el campo con campo menor al mínimo
    await campo.fill("9");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    alerta = page.getByTestId("alerta-imc-min");
    mensajeAlerta = await alerta.textContent()

    // Validar valor mínimo
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("El IMC debe ser mayor a 10")

    // Llenar el campo con campo menor al máximo
    await campo.fill("101");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    alerta = page.getByTestId("alerta-imc-max");
    mensajeAlerta = await alerta.textContent()

    // Validar valor mínimo
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("El IMC debe ser menor a 100")
  })

  test('Validaciones perfil deportivo - Campo: Ejercicio por semana', async ({ page }) => {
    
    // Ir al perfil deportivo 
    await page.getByRole('button', {name: ' Perfil deportivo '}).click()
    await expect(page).toHaveURL(_URL_PERFIL_DEPORTIVO)

    const campo = page.getByPlaceholder("Horas ejercicio por semana", {exact: true})

    // Clic en el campo sin llenar información
    await campo.fill("");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    let alerta = page.getByTestId("alerta-horas-semanal");
    let mensajeAlerta = await alerta.textContent()

    // Validar requerido
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("Las horas de ejercicio por semana son requeridas")

    // Llenar el campo con campo menor al mínimo
    await campo.fill("0");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    alerta = page.getByTestId("alerta-horas-semanal-min");
    mensajeAlerta = await alerta.textContent()

    // Validar valor mínimo
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("La cantidad de horas semanales deben ser mayor a 1")

    // Llenar el campo con campo menor al máximo
    await campo.fill("101");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    alerta = page.getByTestId("alerta-horas-semanal-max");
    mensajeAlerta = await alerta.textContent()

    // Validar valor mínimo
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("La cantidad de horas semanales deben ser menor a 100")
  })

  test('Validaciones perfil deportivo - Campo: Peso objetivo', async ({ page }) => {
    
    // Ir al perfil deportivo 
    await page.getByRole('button', {name: ' Perfil deportivo '}).click()
    await expect(page).toHaveURL(_URL_PERFIL_DEPORTIVO)

    const campo = page.getByPlaceholder("Peso objetivo", {exact: true})

    // Clic en el campo sin llenar información
    await campo.fill("");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    let alerta = page.getByTestId("alerta-peso-objetivo");
    let mensajeAlerta = await alerta.textContent()

    // Validar requerido
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("El peso objetivo es requerido")

    // Llenar el campo con campo menor al mínimo
    await campo.fill("19");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    alerta = page.getByTestId("alerta-peso-objetivo-min");
    mensajeAlerta = await alerta.textContent()

    // Validar valor mínimo
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("El peso objetivo debe ser mayor a 20 kg")

    // Llenar el campo con campo menor al máximo
    await campo.fill("181");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    alerta = page.getByTestId("alerta-peso-objetivo-max");
    mensajeAlerta = await alerta.textContent()

    // Validar valor mínimo
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("El peso objetivo ser menor a 180 kg")
  })

  test('Validaciones perfil deportivo - Campo: Alergias', async ({ page }) => {
    
    // Ir al perfil deportivo 
    await page.getByRole('button', {name: ' Perfil deportivo '}).click()
    await expect(page).toHaveURL(_URL_PERFIL_DEPORTIVO)

    const campo = page.getByPlaceholder("Alergias", {exact: true})

    // Clic en el campo sin llenar información
    await campo.fill("");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    let alerta = page.getByTestId("alerta-alergias");
    let mensajeAlerta = await alerta.textContent()

    // Validar requerido
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("Las alergias son requeridas")
  })

  test('Validaciones perfil deportivo - Campo: Deporte', async ({ page }) => {
    
    // Ir al perfil deportivo 
    await page.getByRole('button', {name: ' Perfil deportivo '}).click()
    await expect(page).toHaveURL(_URL_PERFIL_DEPORTIVO)

    const campo = page.getByTestId("deporte"); 

    // Clic en el campo sin llenar información
    await campo.click();
    await campo.blur();

    // Buscar mensaje de alerta
    const alerta = page.getByTestId("alerta-deporte");
    const mensajeAlerta = await alerta.textContent()

    // Validar
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("El deporte es requerido")
  })

  test('Validaciones perfil deportivo - Campo: Preferencia alimentaria', async ({ page }) => {
    
    // Ir al perfil deportivo 
    await page.getByRole('button', {name: ' Perfil deportivo '}).click()
    await expect(page).toHaveURL(_URL_PERFIL_DEPORTIVO)

    const campo = page.getByPlaceholder("Preferencia Alimentaria", {exact: true})

    // Clic en el campo sin llenar información
    await campo.fill("");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    let alerta = page.getByTestId("alerta-preferencia-alimentaria");
    let mensajeAlerta = await alerta.textContent()

    // Validar requerido
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("La preferencia alimentaria es requerida")
  })

  test('Validaciones perfil deportivo - Campo: Plan Nutricional', async ({ page }) => {
    
    // Ir al perfil deportivo 
    await page.getByRole('button', {name: ' Perfil deportivo '}).click()
    await expect(page).toHaveURL(_URL_PERFIL_DEPORTIVO)

    const campo = page.getByPlaceholder("Plan Nutricional", {exact: true})

    // Clic en el campo sin llenar información
    await campo.fill("");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    let alerta = page.getByTestId("alerta-plan-nutricional");
    let mensajeAlerta = await alerta.textContent()

    // Validar requerido
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("El plan nutricional es requerido")
  })

  test('Validaciones perfil deportivo - Campo: Historia Clinica', async ({ page }) => {
    
    // Ir al perfil deportivo 
    await page.getByRole('button', {name: ' Perfil deportivo '}).click()
    await expect(page).toHaveURL(_URL_PERFIL_DEPORTIVO)

    const campo = page.getByPlaceholder("Historia Clinica", {exact: true})

    // Clic en el campo sin llenar información
    await campo.fill("");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    let alerta = page.getByTestId("alerta-historia-clinica");
    let mensajeAlerta = await alerta.textContent()

    // Validar requerido
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("La historia clínica es requerida")
  })

});

test.describe('Validaciones Registro Principal', () => {
  test('Validaciones registro principal - Campo: Nombre', async ({ page }) => {

    const campo = page.getByPlaceholder("Nombres", {exact: true})

    // Clic en el campo sin llenar información
    await campo.fill("");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    let alerta = page.getByTestId("alerta-nombre");
    let mensajeAlerta = await alerta.textContent()

    // Validar requerido
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("El nombre es requerido")
  });

  test('Validaciones registro principal - Campo: Apellido', async ({ page }) => {

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

  });

  test('Validaciones registro principal - Campo: Usuario', async ({ page }) => {

    const campo = page.getByPlaceholder("Usuario", {exact: true})

    // Clic en el campo sin llenar información
    await campo.fill("");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    let alerta = page.getByTestId("alerta-username");
    let mensajeAlerta = await alerta.textContent()

    // Validar requerido
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("Se requiere el usuario")
  });

  test('Validaciones registro principal - Campo: Email', async ({ page }) => {

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

    // Clic en el campo sin formato correcto
    await campo.fill("1234567890");
    await campo.blur();

    // Buscar mensaje de alerta formato
    alerta = page.getByTestId("alerta-email-formato");
    mensajeAlerta = await alerta.textContent()

    // Validar requerido
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("Debe ser un email")
  });

  test('Validaciones registro principal - Campo: Tipo Identificación', async ({ page }) => {

    const campo = page.getByTestId("tipoIdenficacion"); 

    // Clic en el campo sin llenar información
    await campo.click();
    await campo.blur();

    // Buscar mensaje de alerta
    const alerta = page.getByTestId("alerta-tipo-identificacion");
    const mensajeAlerta = await alerta.textContent()

    // Validar
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("El tipo de identificación es requerido")
  });

  test('Validaciones registro principal - Campo: Número de identificación', async ({ page }) => {

    const campo = page.getByPlaceholder("Número de identificación", {exact: true})

    // Clic en el campo sin llenar información
    await campo.fill("");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    let alerta = page.getByTestId("alerta-numero-identificacion");
    let mensajeAlerta = await alerta.textContent()

    // Validar requerido
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("El número de identificación es requerido")
  });

  test('Validaciones registro principal - Campo: Dirección', async ({ page }) => {

    const campo = page.getByPlaceholder("Direccion", {exact: true})

    // Clic en el campo sin llenar información
    await campo.fill("");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    let alerta = page.getByTestId("alerta-direccion");
    let mensajeAlerta = await alerta.textContent()

    // Validar requerido
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("La dirección es requerida")

    // Escribir la dirección sin seleccionar alguna de la lista
    await campo.fill("coliseo");
    await campo.blur();

    // Buscar mensaje de alerta requerido seleccionado en lista
    alerta = page.getByTestId("alerta-direccion-lista");
    mensajeAlerta = await alerta.textContent()

    // Validar requerido
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("Se debe seleccionar una dirección de la lista")
  });

  test('Validaciones registro principal - Campo: Contraseña', async ({ page }) => {

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

    // Clic en el campo y llenar contraseña de menor longitud
    await campo.fill("1234");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    alerta = page.getByTestId("alerta-password-min");
    mensajeAlerta = await alerta.textContent()

    // Validar requerido
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("La contraseña deben tener al menos 6 caracteres")
  });

  test('Validaciones registro principal - Campo: Confirmación de Contraseña', async ({ page }) => {

    const campo = page.getByPlaceholder("Confirmar contraseña", {exact: true})

    // Clic en el campo sin llenar información
    await campo.fill("");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    let alerta = page.getByTestId("alerta-confirmar-password");
    let mensajeAlerta = await alerta.textContent()

    // Validar requerido
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("La confirmación de contraseña es requerida")

    // Clic en el campo y llenar la confirmación de la contraseña de menor longitud
    await campo.fill("1234");
    await campo.blur();

    // Buscar mensaje de alerta requerido
    alerta = page.getByTestId("alerta-confirmar-password-min");
    mensajeAlerta = await alerta.textContent()

    // Validar requerido
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("La contraseña deben tener al menos 6 caracteres")

    // Buscar mensaje de alerta contraseñas no coinciden
    const campo_contraseña = page.getByPlaceholder("Contraseña", {exact: true})
    await campo_contraseña.fill("1234567890");
    await campo_contraseña.blur();

    alerta = page.getByTestId("alerta-password-match");
    mensajeAlerta = await alerta.textContent()

    // Validar requerido
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("Las contraseñas no coinciden")
  });

  test('Validaciones registro principal - Campo: Suscripción', async ({ page }) => {
    
    const campo = page.getByTestId("suscripcion"); 

    // Clic en el campo sin llenar información
    await campo.click();
    await campo.blur();

    // Buscar mensaje de alerta
    const alerta = page.getByTestId("alerta-suscripcion");
    const mensajeAlerta = await alerta.textContent()

    // Validar
    await expect(alerta).toBeVisible()
    expect(mensajeAlerta.trim()).toEqual("La suscripción es requerida")
  })

});