var userInfo = [
	{
		"name" : "Alejandra",
		"lastName" : "Sabogal",
		"mail": "abi@example.com", 
		"universityName": "Universidad del Rosario",
		"isMaster":true,
		"departmentName": "Jurisprudencia",
		"password": "Prueb41234",
		"acceptTerms": true
	},
	{
		"name" : null,
		"lastName" : null,
		"mail": "wrongemail@example.com", 
		"universityName":null,
		"departmentName": null,
		"password": "1234",
		"acceptTerms": false
	}
];

function doLogin (userAccount) {
	var loginBox = ".cajaLogIn"
	cy.contains('Ingresar').click()
	cy.get(loginBox).find('input[name="correo"]').click().type(userAccount.mail)
	cy.get(loginBox).find('input[name="password"]').click().type(userAccount.password)
	cy.get(loginBox).contains('Ingresar').click();
}

function doLogout () {
	cy.get(".dropDown").find('button[id="cuenta"]').click()
	cy.get(".dropdown-menu").contains('Salir').click();
}

function createAccount (userAccount) {
	const signUpBox = ".cajaSignUp"
	cy.contains('Ingresar').click()
	cy.get(signUpBox).find('input[name="nombre"]').click().type(userAccount.name)
	cy.get(signUpBox).find('input[name="apellido"]').click().type(userAccount.lastName)
	cy.get(signUpBox).find('input[name="correo"]').click().type(userAccount.mail)
	cy.get(signUpBox).find('select[name="idUniversidad"]').select(userAccount.universityName)
	cy.get(signUpBox).find('select[name="idDepartamento"]').select(userAccount.departmentName)
	cy.get(signUpBox).find('input[name="password"]').click().type(userAccount.password)
	
	if(userAccount.acceptTerms){
		cy.get(signUpBox).find('input[name="acepta"]').click();
	}
	
	cy.get(signUpBox).contains('Registrarse').click();
}

function assertRegistryMessage(tittle, textMessage){
	// Validates pop up title
	cy.get('.sweet-alert')
	.find('h2')
	.should('have.text',tittle)
	
	// Validates pop up text
	cy.get('.sweet-alert')
	.find('div[class="text-muted lead"]')
	.should('have.text', textMessage)
	
	// Does clic on Ok button
	cy.contains('Ok').click()
}

context('Home actions', function() {
	beforeEach(function() {
		cy.visit('https://losestudiantes.co')
		cy.contains('Cerrar').click()
	})
  
	describe('Los estudiantes login', function() {
		it('Visits los estudiantes and fails at login', function() {			
			// Does the login
			doLogin(userInfo[1])
			cy.contains('El correo y la contraseña que ingresaste no figuran en la base de datos. Intenta de nuevo por favor.')
		})
		
		it('Creates an account twice', function() {			
			// Create an account
			createAccount(userInfo[0])
			assertRegistryMessage(
				'Registro exitoso!', 
				`Verifica tu correo y activa tu cuenta Con esto ya podrás calificar profesores.`
			)
			
			// Logout
			doLogout()
			
			// Create an account with current login
			createAccount(userInfo[0])			
			assertRegistryMessage(
				'Ocurrió un error activando tu cuenta', 
				`Error: Ya existe un usuario registrado con el correo '${userInfo[0].mail}'`
			)
		})
	})

	describe('Teacher´s page actions', function() {
		it('Visits los estudiantes and look for a teacher', function() {
			// Does the login
			doLogin(userInfo[0])
			
			// Looks for a teacher
			const teacherName = "Mario Linares Vasquez"
			cy.get('#react-select-required_error_checksum--value > div.Select-input > input')
			.type(teacherName, { force: true })
			.type('{Enter}');
			cy.get('div#react-select-required_error_checksum--option-0').eq(0)
			.should(($item) =>{
				expect($item).to.contain(teacherName)
			})
		})
		
		it('Visits los estudiantes and goes for a teacher`s page', function() {
			// Does the login
			doLogin(userInfo[0])
			
			// Looks for a teacher
			const teacherName = "Mario Linares Vasquez"
			cy.get('#react-select-required_error_checksum--value > div.Select-input > input')
			.type(teacherName, { force: true })
			.type('{Enter}');
			cy.get('div#react-select-required_error_checksum--option-0').eq(0).click()
			
			// Validates teacher name
			const commonClass = "jsx-1339787052"
			cy.get('.columnLeft')
			.find(`div[class='${commonClass} boxElement']`)
			.find(`div[class='${commonClass} infoProfesor']`)
			.find(`div[class='${commonClass} descripcionProfesor']`)
			.find(`h1[class='${commonClass} nombreProfesor']`)
			.should('have.text', teacherName)
		})
	})
})