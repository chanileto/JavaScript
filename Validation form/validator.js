class Validator {
	constructor(config) {					// konstruktor treba da primi config
		this.elementsConfig = config;	
		this.errors = {};					// prazan objekat 
	
		this.generateErrorsObject();        // deklarisanje funkcije(metode) za generisanje gresaka
		this.inputListener();				// metoda za povratne informacije gresaka
	}

	generateErrorsObject() {
		for(let field in this.elementsConfig) {
			this.errors[field] = [];				// za svako polje pravimo prazan niz u kome cemo smjestiti greske
		}
	}

	inputListener() {
		let inputSelector = this.elementsConfig;						// uzimamo sva polja

		for(let field in inputSelector) {
			let el = document.querySelector(`input[name="${field}"]`);		// uzimamo polje po nazivu		

			el.addEventListener('input', this.validate.bind(this));			/* validate - funkcija koja ce da validira inpute
																			   bind(this) - da bismo mogli da uzmemo polje pojedinacno */
		}
	}

	validate(e) {									// e - to nam je u stvari pojedinacno polje, zato smo stavili bind(this)
		let elFields = this.elementsConfig;			// uzimamo sva polja koja imamo
		let field = e.target;						// uzimamo trenutno polje
		let fieldName = field.getAttribute('name');	// uzimamo ime od trenutnog polja
		let fieldValue = field.value;

		this.errors[fieldName] = [];				// u prazan objekat errors ubacujemo ovo

		if(elFields[fieldName].required) {			// ako je polje obavezno da se popuni
			if(fieldValue === '') {
				this.errors[fieldName].push('Polje je prazno');		// ako je polje prazno ubacujemo poruku u errors
			}
		}

		if(elFields[fieldName].email) {
			if(!this.validateEmail(fieldValue)) {
				this.errors[fieldName].push('Neispravna email adresa');
			}
		}

		if(fieldValue.length < elFields[fieldName].minlength || fieldValue.length > elFields[fieldName].maxlength) {
			this.errors[fieldName].push(`Polje mora imati minimalno ${elFields[fieldName].minlength} i maksimalno ${elFields[fieldName].maxlength} karaktera`);
		}

		if(elFields[fieldName].matching) {
			let matchingEl = document.querySelector(`input[name="${elFields[fieldName].matching}"]`);

			if(fieldValue !== matchingEl.value) {
				this.errors[fieldName].push('Lozinke se ne poklapaju');
			}

			if(this.errors[fieldName].length === 0) {
				this.errors[fieldName] = [];						// praznimo errors, da se ne bi nagomilavalo poruka Lozinke se ne poklapaju
				this.errors[elFields[fieldName].matching] = [];
			}
		}

		 this.populateErrors(this.errors);
	}

	populateErrors(errors) {										// ispis isti kao sto smo pravili proceduralno prosli put
		for(const elem of document.querySelectorAll('ul')) {
			elem.remove();
		}

		for(let key of Object.keys(errors)) {
			let parentElement = document.querySelector(`input[name="${key}"]`).parentElement;
			let errorsElement = document.createElement('ul');
			parentElement.appendChild(errorsElement);

			errors[key].forEach(error => {
				let li = document.createElement('li');
				li.innerText = error;

				errorsElement.appendChild(li);
			});
		}
	}

	validateEmail(email) {
		if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {		// google, js validation email regex
		return true;
	} 

	return false;
	}

}