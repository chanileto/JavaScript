//--------------------------------------Session.js--------------------------------------------------


class Session {
	user_id = '';											//cuvamo samo ID

	startSession() {									//startujemo sesiju
		const d = new Date();
		d.setTime(d.getTime() + (2*24*60*60*1000));		//kada se korisnik uloguje, sesija ce mu isteci za 2 dana
		let expires = "expires=" + d.toUTCString();
		document.cookie = "user_id=" + this.user_id + ";" + expires;
		console.log('Metoda startSession:');
	}

	getSession() {												//pravimo metodu getSession koju pozivamo u app.js
		let name = 'user_id=';
		let ca = document.cookie.split(';');

		for(let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}

		return "";
	}

	destroySession() {											//pravimo metodu da kad se neko izloguje da mu se unisti cookie
		let cookies = document.cookie.split(';');				//uzimamo svaki cookie

		for (let i = 0; i < cookies.length; i++) {
			let cookie = cookies[i];
			let eqPos = cookie.indexOf("=");
			let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";		//BITNO: s ovim unistavamo cookie, stavljamo stari expire date
		}
	}
}



//--------------------------------------User.js----------------------------------------------------------------------------------------



class User {
	user_id = '';
	username = '';
	email = '';
	password = '';
	api_url = 'https://65c0f84cdc74300bce8d1525.mockapi.io';		//nas url sa mockAPI


	create() {
		let data = {										
			username: this.username,
			email: this.email,
			password: this.password
		}

		console.log('mockAPI: ');				
		console.log(data);												
		data = JSON.stringify(data);						//JS objekat smo pretvorili u JSON

		fetch(this.api_url + '/users', {
			method: 'POST',										//pomocu POST metode kreiramo novog korisnika
			headers: {											//saljemo serveru json(odnosno nas objekat data)
				'Content-Type': 'application/json'
			},
			body: data
		})
		.then(response => response.json())						//kada se kreira korisnik, mockAPI ce u povratnim informacijama da nam posalje json, da kaze npr KORISNIK JE KREIRAN				
		.then(data => {
			//console.log('mockAPI: "Korisnik kreiran!"');					
			let session = new Session();						//pravimo sesiju prije hexa.html
			session.user_id = data.id;							//uzimamo user koji nam je mockAPI vratio(user koji smo smjestili u bazu)
			session.startSession();

			console.log('mockAPI:')
			console.log(session);

			window.location.href = 'hexa.html';					//rediktujemo user, kada se kreira korisnik, vodi nas na ovu stranicu
		})
	}

	async get(user_id) {										//naglasavamo da nam metoda bude ASINHRONA
		let api_url = this.api_url + '/users/' + user_id;

		let response = await fetch(api_url);
		let data = await response.json();

		return data;

		/*fetch(api_url)										//POSTO JE OVO SINHRONO, ONDA GA PRESKACE I NE VRACA PODATKE NA VRIJEME, PA MORAMO PISATI ASINHRONO(napisano iznad)
		.then(response => response.json())
		.then(data => {
			console.log(data);									//test
			return data;
		})*/
	}

	edit() {
		let data = {
			username: this.username,
			email: this.email
		};

		data = JSON.stringify(data);							//pretvaranje u json

		 let session = new Session();							//uvijek ovako uzimamo id trenutnog usera(posto je on sacuvan u cookie)
		 session_id = session.getSession();						//bukvalno uzimamo ID iz cookie	

		 fetch(this.api_url + '/users/' + session_id, {
		 	method: 'PUT',										//request je PUT, jer mijenjamo podatke
		 	headers: {
		 		'Content-Type': 'application/json'				//saljemo JSON
		 	},
		 	body: data											//u body saljemo data
		 })
		 .then(response => response.json())
		 .then(data => {
		 	window.location.href = 'hexa.html';					//kad izmijenimo podatke, rediktujemo na istu stranicu
		 });
	}  

	login() {													//kreiramo login formu(GET request)
		fetch(this.api_url + '/users')							//ne pisemo method: get zato sto je get po default-u
		.then(response => response.json())						//da je neka druga(post, put, delete) onda bi morali pisati method:...
		.then(data => {

			console.log('mockAPI ce nam vratiti trenutnu listu usera:');
			console.log(data);

			let login_successful = 0;
			data.forEach(db_user => {
				if(db_user.email === this.email && db_user.password === this.password) {
					//console.log('ulogovan');
					let session = new Session();
					session.user_id = db_user.id;
					session.startSession();
					login_successful = 1;
					window.location.href = 'hexa.html';				//ako ispuni uslov(ako je vec registrovan korisnik) redirektujemo ga na hexa.html
				}
			});

			if(login_successful === 0) {
				alert('Pogresan email ili lozinka');
			}
		});
	}

	delete() {
		let session = new Session();
		session_id = session.getSession();

		fetch(this.api_url + '/users/' + session_id, {
		 	method: 'DELETE',										//request je DELETE, jer brisemo								
		 })
		 .then(response => response.json())
		 .then(data => {
		 	let session = new Session();				
		 	session.destroySession();

		 	window.location.href = '/';					//kad izmijenimo podatke, rediktujemo na istu stranicu
		 });
	}
}








