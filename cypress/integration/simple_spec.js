var userInfo = [
	{
		"name" : "Alejandra",
		"lastName" : "Sabogal",
		"mail": "abd@example.com", 
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
	cy.get(loginBox).find('input[name="correo"]').click().type(userAccount.mail);
	cy.get(loginBox).find('input[name="password"]').click().type(userAccount.password);
	cy.get(loginBox).contains('Ingresar').click();
}

function createAccount (userAccount) {
	const signUpBox = ".cajaSignUp"
	cy.contains('Ingresar').click()
	cy.get(signUpBox).find('input[name="nombre"]').click().type(userAccount.name);
	cy.get(signUpBox).find('input[name="apellido"]').click().type(userAccount.lastName);
	cy.get(signUpBox).find('input[name="correo"]').click().type(userAccount.mail);
	cy.get(signUpBox).find('select[name="idUniversidad"]').select(userAccount.universityName);	
	cy.get(signUpBox).find('select[name="idDepartamento"]').select(userAccount.departmentName);
	cy.get(signUpBox).find('input[name="password"]').click().type(userAccount.password);
	
	if(userAccount.acceptTerms){
		cy.get(signUpBox).find('input[name="acepta"]').click();
	}
	
	cy.get(signUpBox).contains('Registrarse').click();
	
	// Selects 'OK' on success registry popup
	cy.contains('Ok').click()
	
	//TODO: Include the assert
}

context('Home actions', function() {
	beforeEach(function() {
		cy.visit('https://losestudiantes.co')
		cy.contains('Cerrar').click()
	})
  
	describe.skip('Los estudiantes login', function() {
		it('Visits los estudiantes and fails at login', function() {			
			// Does the login
			doLogin(userInfo[1])
			cy.contains('El correo y la contraseña que ingresaste no figuran en la base de datos. Intenta de nuevo por favor.')
		})
		
		it('Creates an account then to do login', function() {			
			// Create an account
			createAccount(userInfo[0])
			
			// Login with an valid user
			//doLogin(userAccountInfo)
			
			// Create an account with current login
			createAccount(userInfo[0])
		})
	})

	describe('Teacher´s page actions', function() {
		it('Visits los estudiantes and look for a teacher', function() {
			// Does the login
			doLogin(userInfo[0])
			// Looks for a teacher
			cy.get('.buscador').find('div[class="Select-placeholder"]').click().type("Mario Linares");
			
		})
	})
})

