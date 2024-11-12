let session = new Session();			
session_id = session.getSession()			

if(session_id !== "") {
	//alert('Ulogovan si');				//test

	async function populateUserData() {				//pravimo asinhronu funkciju za login trenutnog usera, da nam pise na hexa.html koji je user
		let user = new User();
		user = await user.get(session_id);			//await stavljamo posto je metoda get(User.js) asinhrona

		document.querySelector('#username').innerText = user['username'];			
		document.querySelector('#email').innerText = user['email'];

		document.querySelector("#korisnicko_ime").value = user['username'];		
		document.querySelector("#edit_email").value = user['email'];
	}

	populateUserData();

} else {
	window.location.href = "/";						//ako je sesija prazna, odnosno nema usera u cookies, onda redirektujemo na pocetnu stranicu
}

document.querySelector('#logout').addEventListener('click', e => {		//button: Odjavi se
	e.preventDefault();

	session.destroySession();						
	window.location.href = "/";						//kad se korisnik odjavi redirektujemo ga na pocetnu

});

document.querySelector('#editAccount').addEventListener('click', () => {		//eventi za popup izmjenu profila
	document.querySelector('.custom-modal').style.display = 'block';
});

document.querySelector('#closeModal').addEventListener('click', () => {			
	document.querySelector('.custom-modal').style.display = 'none';
});

document.querySelector('#editForm').addEventListener('submit', e => {			
	e.preventDefault();

	let user = new User();
	user.username = document.querySelector('#korisnicko_ime').value;
	user.email = document.querySelector('#edit_email').value;
	user.edit();
});

document.querySelector('#deleteProfile').addEventListener('click', e => {
	e.preventDefault();

	let text = 'Da li ste sigurni da zelite da izbrisete profil?';

	if(confirm(text) === true) {							//ako potvrdimo u popup-u izbrisacemo trenutni user
		let user = new User();					
		user.delete();
	}
});

document.querySelector("#postForm").addEventListener('submit', e => {		//KREIRANJE OBJAVE
	e.preventDefault();

	async function createPost() {
		let content = document.querySelector('#postContent').value;
		document.querySelector('#postContent').value = '';					//kad uzme value iz textarea, onda vracamo da bude textarea prazan EMPTY
		let post = new Post();
		post.post_content = content;
		post = await post.create();

		let current_user = new User();							//treba nam username od trenutnog usera, da znamo ko je objavio post
		current_user = await current_user.get(session_id);		//uzimamo ga preko trenutnog id-a, await(zato sto je get asinhrona metoda u User.js)
	
		let html = document.querySelector('#allPostsWrapper').innerHTML;

		let delete_post_html = '';

		if(session_id === post.user_id) {						//ako je id iz sesije jednak id-u trenutnog usera, onda moze da brise post
			delete_post_html = '<button class="remove-btn" onclick="removeMyPost(this)">Remove</button>'
		}

		document.querySelector('#allPostsWrapper').innerHTML = `<div class="single-post" data-post_id="${post.id}">
																	<div class="post-content">${post.content}</div>
																
																	<div class="post-actions">
																		<p><b>Autor:</b> ${current_user.username}</p>
																		<div>
																			<button onclick="likePost(this)" class="likePostJS like-btn"><span>${post.likes}</span>Likes</button>
																			<button class="comment-btn" onclick="commentPost(this)">Comments</button>
																			${delete_post_html}
																		</div>
																	</div>

																	<div class="post-comments">
																		<form>
																			<input placeholder="Napisi komentar..." type="text">
																			<button onclick="commentPostSubmit(event)">Comment</button>
																		</form>
																	</div>
																</div>
																` + html;
	}

	createPost();
});

async function getAllPosts() {									//funkcija koja ce da nam prikaze sve postove, svacije
	let all_posts = new Post()
	all_posts = await all_posts.getAllPostsGetRequest();		//pozivanje metode getRequest(Post.js)

	all_posts.forEach(post => {
		async function getPostUser() {

			let user = new User();								//uzimamo id usera koji je postavio post
			user = await user.get(post.user_id);

			let comments = new Comment();						//da bi sacuvali komentare kad se refresuje kreiramo sledece:
			comments = await comments.get(post.id);

			let comments_html = '';
			if(comments.length > 0) {
				comments.forEach(comment => {
					comments_html += `<div class="single-comment"><i>${user.username}</i>: ${comment.content}</div>`;
				});
			}

			let html = document.querySelector('#allPostsWrapper').innerHTML;

			let delete_post_html = '';

			if(session_id === post.user_id) {						
				delete_post_html = '<button class="remove-btn" onclick="removeMyPost(this)">Remove</button>'
			}

			document.querySelector('#allPostsWrapper').innerHTML = `<div class="single-post" data-post_id="${post.id}">
																	<div class="post-content">${post.content}</div>
																
																	<div class="post-actions">
																		<p><b>Autor:</b> ${user.username}</p>
																		<div>
																			<button onclick="likePost(this)" class="likePostJS like-btn"><span>${post.likes}</span>Likes</button>
																			<button class="comment-btn" onclick="commentPost(this)">Comments</button>
																			${delete_post_html}
																		</div>
																	</div>

																	<div class="post-comments">
																		<form>
																			<input placeholder="Napisi komentar..." type="text">
																			<button onclick="commentPostSubmit(event)">Comment</button>
																		</form>
																		${comments_html}
																	</div>
																</div>
																` + html;
		}

		getPostUser();
	});
} 

getAllPosts();

const commentPostSubmit = e => {							//onclick za button comment
	e.preventDefault();

	let btn = e.target;									//uzmemo trenutni btn koji smo kliknuli
	btn.setAttribute('disabled', 'true');				//korisnik moze da komentarise samo jednom!

	let main_post_el = btn.closest('.single-post');
	let post_id = main_post_el.getAttribute('data-post_id');

	let comment_value = main_post_el.querySelector('input').value;

	main_post_el.querySelector('input').value = '';

	main_post_el.querySelector('.post-comments').innerHTML += `<div class="single-comment">${comment_value}</div>`;

	let comment = new Comment();				//kreiramo objekat klase Comment
	comment.content = comment_value;			//sadrzaj iz inputa		
	comment.user_id = session_id;				//ko je komentarisao(pa trenutni id iz cookie)
	comment.post_id = post_id;					//id posta je trenutni post
	comment.create();							//pozivamo metodu iz Comment.js
}

const removeMyPost = btn => {
	let post_id = btn.closest('.single-post').getAttribute('data-post_id');

	btn.closest('.single-post').remove();

	let post = new Post();				
	post.delete(post_id);				//metodi delete(Post.js) saljemo nas post_id
}

const likePost = btn => {
	let main_post_el = btn.closest('.single-post');
	let post_id = btn.closest('.single-post').getAttribute('data-post_id');
	let number_of_likes_current = parseInt(btn.querySelector('span').innerText);		

	btn.querySelector('span').innerText = number_of_likes_current + 1;					
	btn.setAttribute('disabled', 'true');												

	let post = new Post();
	post.like(post_id, number_of_likes_current + 1);							//pozivamo metodu like(Post.js)
}

const commentPost = btn => {
	let main_post_el = btn.closest('.single-post');				//uzimamo njegov parent, ovo radimo da nam ne bi iskocili komentari u svih postova, vec  samo za taj post gdje kliknemo comment
	let post_id = main_post_el.getAttribute('data-post_id');	

	if(main_post_el.querySelector('.post-comments').style.display === 'none') {			//if sam ja dodao, da kad mi je otvoren komentar, da ga mogu zatvoriti na isti button(comment)
		main_post_el.querySelector('.post-comments').style.display = 'block';
	} else {
		main_post_el.querySelector('.post-comments').style.display = 'none';
	}
}
