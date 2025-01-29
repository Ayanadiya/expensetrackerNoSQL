document.getElementById('resetpassword').addEventListener('submit', resetpassword);
function resetpassword(event) {
    event.preventDefault();
    const email=document.getElementById('email').value;
    const newpassword=document.getElementById('password').value;
    const cnfrmpassword=document.getElementById('confirmpassword').value;
    if(!email || !newpassword || !cnfrmpassword)
    {
        alert ('Please fill required fields');
    }
    if(newpassword!=cnfrmpassword)
    {
        alert('Password does not match');
    }
    const data={
        email,
        newpassword,
    };
    axios.post('http://127.0.0.1:3000/password/updatepassword',data)
    .then(result => {
        alert(result.data.message);
        window.location.href='/user/login';
    })
    .catch(err => console.log(err));
}