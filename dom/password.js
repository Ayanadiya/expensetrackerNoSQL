document.getElementById('getpassword').addEventListener('submit', getpassword);

function getpassword(event) {
    event.preventDefault();
    const email=document.getElementById('email').value;
    axios.post('http://127.0.0.1:3000/password/forgotpassword', {email:email})
    .then(result =>{
        alert(result.data.message)
    })
    .catch(err => console.log(err));
}

