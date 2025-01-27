document.getElementById('signUp').addEventListener('submit', signUp);
function signUp(event) {
    event.preventDefault();
    const name=document.getElementById('username').value;
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    if(!name || !email || !password)
    {
        alert('Please fill required fields');
    }
    const user= {
        name,
        email,
        password
    }
    console.log('sending to backend');
    axios.post('http://127.0.0.1:3000/user/signup', user)
    .then(res => {
        if(res.status===201)
        {
            alert(res.data.message);
           
            window.location.href='/user/login';
        }
    })
    .catch(err => {
        if(err.status===400)
        {
            alert(err.response.data.message);
        }
        else
        {
            alert('Something went wrong. Please try again');
        }
    });
    document.querySelector('form').reset();
}