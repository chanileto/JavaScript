class Comment {
	post_id = '';
	user_id = '';
	content = '';
	api_url2 = 'https://65ce177ec715428e8b3ff131.mockapi.io';

	create() {											
		let data = {									//ovaj objekat saljemo mockAPI-u
			post_id: this.post_id,						
			user_id: this.user_id,									
			content: this.content						
		};

		data = JSON.stringify(data);

		fetch(this.api_url2 + '/comments', {					//ulazimo u mockAPI/comments
			method: 'POST',										//request: POST, zato sto kreiramo sadrzaj
			headers: {
				'Content-Type': 'application/json'				//saljemo mu json
			},
			body: data			 								//body-u saljemo data 
		})
		.then(response => response.json())
		.then(data => {alert('Postavljen komentar')});
	}

	async get(post_id) {
		let api_url2 = this.api_url2 + '/comments';				//uzimamo sve komentare

		const response = await fetch(api_url2);
		const data = await response.json();
		let post_comments = [];									//kreiramo prazan niz svih komentara jednog posta

		let i = 0;
		data.forEach(comment => {								
			if(comment.post_id === post_id) {						//ako je id u komentaru jednak id-u posta koji smo mi poslali
				post_comments[i] = comment;						//onda je to komentar tog posta i stavljamo ga u niz	
				i++;
			}
		});

		return post_comments;
	}
}