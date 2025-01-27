document.getElementById('login').addEventListener('submit', login);

function login(event) {
    event.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    if(!email || !password)
    {
        alert('Please fill required fields');
    }
    const user={
        email,
        password
    }
    axios.post('http://16.170.246.115:3000/user/login', user )
    .then(result => {
        if(result.status===200)
        {
            alert(result.data.message);
            localStorage.setItem('token', result.data.token);
            console.log(result.data.premium);          
            if(result.data.premium===true)
                {
                    localStorage.setItem('user', true);
                    window.location.href='/expense/premium'
                }
            else
            {
                 localStorage.setItem('user', false);
                 window.location.href = '/expense'
            }    
           
        }
        document.querySelector('form').reset();
    })
    .catch(error => {
        console.log(error);
          if(error.status===401)
          {
            return alert('User not authorized');
          }
          if(error.status===404)
          {
            return alert('User not found');
          }
          
    });
}