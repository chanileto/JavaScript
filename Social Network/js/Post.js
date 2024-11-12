class Post {
	post_id = '';
	post_content = '';
	user_id = '';
	likes = '';
	api_url = 'https://65c0f84cdc74300bce8d1525.mockapi.io';

	async create() {
		let session = new Session();							
		session_id = session.getSession();

		let data = {
			user_id: session_id,									
			content: this.post_content,							
			likes: 0
		}

		data = JSON.stringify(data);

		let response = await fetch(this.api_url + '/posts', {	//ulazimo u mockAPIposts
			method: 'POST',										//request: POST, zato sto kreiramo sadrzaj
			headers: {
				'Content-Type': 'application/json'				//saljemo mu json
			},
			body: data			 								//body-u saljemo data 
		}); 

		data = await response.json();

		return data;
	}

	async getAllPostsGetRequest() {
		let response = await fetch(this.api_url + '/posts');	//GET request, uzimamo sve postove
		let data = await response.json();
		return data;
	}

	like(post_id, likes) {
		let data = {
			likes: likes
		};

		data = JSON.stringify(data);

		fetch(this.api_url + '/posts/' + post_id, {				
			method: 'PUT',									//request: PUT, zato sto mijenjamo vec postojeci post(dodajemo broj lajkova)
			headers: {
				'Content-Type': 'application/json',
			},
			body: data								
		})
		.then(response => response.json())
		.then(data => {alert('Post lajkovan')});
	}

	delete(post_id) {											//brisemo post(button: remove)
		fetch(this.api_url + '/posts/' + post_id, {				//moramo znati koji tacno post brisemo(+ post_id)
			method: 'DELETE'					
		})
		.then(response => response.json())
		.then(data => {alert('Post obrisan')});
	}
}