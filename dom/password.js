document.getElementById('getpassword').addEventListener('submit', getpassword);

function getpassword(event) {
    event.preventDefault();
    const email=document.getElementById('email').value;
    axios.post('http://16.170.246.115:3000/password/forgotpassword', {email:email})
    .then(result =>{
        alert(result.data.message)
    })
    .catch(err => console.log(err));
}

