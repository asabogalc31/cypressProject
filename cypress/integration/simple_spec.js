var userInfo = [
	{
		"name" : "Alejandra",
		"lastName" : "Sabogal",
		"mail": "add@example.com", 
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
var teacherName = "Mario Linares Vasquez"
			
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

function lookForATeacher(teacherName){
	cy.get('#react-select-required_error_checksum--value > div.Select-input > input')
	.type(teacherName, { force: true })
}

context('Home actions', function() {
	beforeEach(function() {
		cy.visit('https://losestudiantes.co')
		cy.contains('Cerrar').click()
	})
  
	describe('Los estudiantes login', function() {
		it('Visits los estudiantes and fails at login', function() {	
			cy.screenshot()
			// Does the login
			doLogin(userInfo[1])
			cy.contains('El correo y la contraseña que ingresaste no figuran en la base de datos. Intenta de nuevo por favor.')
			cy.screenshot()
		})
		
		it('Creates an account twice', function() {			
			cy.screenshot()
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
			cy.screenshot()
		})
	})

	describe('Teacher´s page actions', function() {
		let subject
			
		it('Visits los estudiantes and look for a teacher', function() {
			cy.screenshot()
			// Does the login
			doLogin(userInfo[0])
			
			// Looks for a teacher
			lookForATeacher(teacherName)
			cy.get('div#react-select-required_error_checksum--option-0').eq(0)
			.should(($item) =>{
				expect($item).to.contain(teacherName)
			})
			cy.screenshot()
		})
		
		it('Visits los estudiantes and goes for a teacher`s page', function() {
			cy.screenshot()
			// Does the login
			doLogin(userInfo[0])
			
			// Looks for a teacher
			lookForATeacher(teacherName)
			cy.get('div#react-select-required_error_checksum--option-0').eq(0).click()
			
			// Validates teacher name
			const commonClass = "jsx-1339787052"
			cy.get('.columnLeft')
			.find(`div[class='${commonClass} boxElement']`)
			.find(`div[class='${commonClass} infoProfesor']`)
			.find(`div[class='${commonClass} descripcionProfesor']`)
			.find(`h1[class='${commonClass} nombreProfesor']`)
			.should('have.text', teacherName)
			cy.screenshot()
		})
		
		it('Visits los estudiantes and filter by subject', function() {
			cy.screenshot()
			// Does the login
			doLogin(userInfo[0])
			
			// Looks for a teacher
			lookForATeacher(teacherName)
			cy.get('div#react-select-required_error_checksum--option-0').eq(0).click()
			
			// Selects a random subject
			const commonClass = '.jsx-3367902293'			
			cy.get(`${commonClass}`).find('input').its('length').then(($lenght) => {
				const listElementNumber = Math.floor(Math.random() * $lenght)
				cy.get(`${commonClass}`).find('input').eq(listElementNumber)
				.parent().then(($checkbox) => {
					cy.get($checkbox).find('input').click()
					cy.get($checkbox).find('a').then(($textElement) => {
						subject = $textElement.text().trim()
					})					
				})
			})
			
			// Validates selection
			cy.wait(5000)
			cy.get('div[class="jsx-3672521041"]')
			.then(($existsComments) => {
				if ($existsComments.children().length > 0) {
					cy.get($existsComments)
					.find('div').eq(0)
					.find('li:visible')
					.find('div[class="jsx-1682178024 sobreCalificacion"]')
					.each(($title) => {
						cy.get($title)
						.find('a').eq(0)
						.should('have.text', subject.replace('Móvil...','Móviles'))
						
						cy.screenshot()
					})
				} else {
					expect($existsComments.children()).to.have.length(0)
				}
			})
		})
	})
})
