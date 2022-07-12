const submit_btn = document.getElementById('login-submit-btn').addEventListener('click', async (e) =>{
	e.preventDefault();
	const email = document.getElementById('email').value
	const password = document.getElementById('password').value
	console.log(email, password);

	try {
		const result = await fetch("/users/login",{
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({email,password})
		})

		const response =  await result.json();
		console.log("response from login_post: " + response);

		if(response.errors){

			if(response.errors.email === 'Email-id not registered'){
				document.getElementById('email').style.borderColor = 'red';
				document.getElementById('email').style.borderWidth = '2px';
				document.getElementById('email').style.borderStyle = 'solid';
				document.getElementById('email').value = '';
				document.getElementById('email').style.backgroundColor = '#ffdddd';
				document.getElementById('email').placeholder = 'Email-id not registered';
			}

			if(response.errors.password === 'Wrong Password'){
				document.getElementById('password').style.borderColor = 'red';
				document.getElementById('password').style.borderWidth = '2px';
				document.getElementById('password').style.borderStyle = 'solid';
				document.getElementById('password').value = '';
				document.getElementById('password').style.backgroundColor = '#ffdddd';
				document.getElementById('password').placeholder = 'Wrong Password';
			}

		}

		if(response.user){
			location.assign("/users/me");
		}


	}
	catch(err) {
		console.log(err);
	}


})












// const s = document.getElementById('login-submit-btn');

// 			async function login(event) {
// 				event.preventDefault()
// 				const email = document.getElementById('email').value
// 				const password = document.getElementById('password').value

// 				console.log(email, password);

// 				// const result = await fetch('/api/login', {
// 				// 	method: 'POST',
// 				// 	headers: {
// 				// 		'Content-Type': 'application/json'
// 				// 	},
// 				// 	body: JSON.stringify({
// 				// 		email,
// 				// 		password
// 				// 	})
// 				// }).then((res) => res.json())

// 				// if (result.status === 'ok') {
// 				// 	// everythign went fine
// 				// 	console.log('Got the token: ', result.data)
// 				// 	localStorage.setItem('token', result.data)
// 				// 	alert('Success')
// 				// } else {
// 				// 	alert(result.error)
// 				// }
// 			}