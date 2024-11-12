
let crashRide = document.querySelector('#crash-ride');		// za E i R	
let hiHatTop = document.querySelector('#hihat-top');		// za K

const animateCrashOrRide = () => {
	crashRide.style.transform = 'rotate(0deg) scale(1.5)';
}

const animateHitHatClosed = () => {
	hiHatTop.style.top = '171px';
}

window.addEventListener("keydown", (event) => {
	let code = event.keyCode;
	let keyElement = document.querySelector(`div[data-key="${code}"]`);

	if(!keyElement)	  return;		 	// ako se pritisne slovo koje nema zvuk, vraca ga opet na novo
	

	let audio = document.querySelector(`audio[data-key="${code}"]`);
	audio.currentTime = 0;				// svaki put audio pocinje ispocetka
	audio.play();

	switch(code){
	case 69:
	case 82:
		animateCrashOrRide();
		break;
	case 75:
	case 73:
		animateHitHatClosed();
		break;
	}

	keyElement.classList.add('playing');
});  

/* funkcija za vracanje bubnja(E i R) u prvobitni polozaj */
const removeCrashRideTransition = e => {
	if(e.propertyName !== 'transform') return;					//ako nije vezano za E i R preskace

	e.target.style.transform = 'rotate(-7.2deg) scale(1.5)';
}

/* funkcija za vracanje bubnja(K) u prvobitni polozaj */
const removeHiHatTopTransition = e => {
	if(e.propertyName !==  'top') return;					// ako nije vezano za K preskace

	e.target.style.top = '166px';
}

/* funkcija da buttoni vrate kad se povecaju */
const removeKeyTransition = e => {
	if(e.propertyName !== 'transform') return;

	e.target.classList.remove('playing');
}

let drumKeys = document.querySelectorAll('.key');		// uzimamo sve key odnosno slova koja imaju audio

drumKeys.forEach(key => {										
	key.addEventListener("transitionend", removeKeyTransition);		// event koji nam vraca u prvobitni polozaj
});
 

crashRide.addEventListener("transitionend", removeCrashRideTransition);
hiHatTop.addEventListener("transitionend", removehiHatTopTransition);



 