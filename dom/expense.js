
const expenselist=document.getElementById('expenselist');
const paginationContainer = document.getElementById('pagination');
let currentPage = 1;
let totalPages = 1;
let itemsPerPage = 5;

document.getElementById('download').addEventListener('click', download)

document.getElementById('addDailyexpense').addEventListener('submit', addDailyexpense);

document.getElementById('itemsPerPage').addEventListener('click', changeItemsPerPage);


function changeItemsPerPage() {
    itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    localStorage.setItem('itemsPerPage', JSON.stringify(itemsPerPage)) ;
    currentPage = 1;  
    loadExpenses();
}

const token = localStorage.getItem('token');

window.addEventListener('DOMContentLoaded', () => {
    if (!token) {
        console.error('No token found');
    }
    loadExpenses(currentPage);
});


function addDailyexpense(event) {
    event.preventDefault();
    const token=localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
      }
    const amount=parseFloat(document.getElementById('amount').value);
    const description=document.getElementById('description').value;
    const category= document.getElementById('category').value;
    if (isNaN(amount) || amount <= 0) {
        console.error('Invalid amount');
        alert('Please enter a valid amount.');
        return;
    }
    const expense={
        amount,
        description,
        category
    }
    axios.post(`http://127.0.0.1:3000/expense/addexpense`,expense,{headers: { 'Authorization': `Bearer ${token}` }})
    .then(result => {
        if(result.status===200)
        {
            const newexpense=result.data;
            addtolist(newexpense);
            document.querySelector('form').reset();
        }  
    })
    .catch(error=> {
        console.log(error);
    });
}

function addtolist(expense){
    const newli=document.createElement('li');
    newli.className="list-group-item";
    newli.textContent=`${expense.amount}-${expense.description}-${expense.category}`
    const dltbtn=document.createElement('button');
    dltbtn.type="button"
    dltbtn.className='delete-btn';
    dltbtn.textContent="Delete";
    dltbtn.onclick= () => deleteexpense(newli,expense._id);
    newli.appendChild(dltbtn);
    expenselist.appendChild(newli);
}

function deleteexpense(listitem, id){
  axios.delete(`http://127.0.0.1:3000/expense/delete/${id}`)
  .then(res => {
    if(res.status===200)
    {
        expenselist.removeChild(listitem);
    } 
  })
  .catch(err => console.log(err));
}

document.getElementById('rzp-button').onclick = async function(e) {
    const token=localStorage.getItem('token');
    const response= await axios.get(`http://127.0.0.1:3000/purchase/premiummembership`, {headers: { 'Authorization': `Bearer ${token}` }})
    console.log(response);
    var options ={
        key:response.data.key_id,
        order_id:response.data.order.id,
        handler: async function(response){
            await axios.post(`http://127.0.0.1:3000/purchase/updatetransactionstatus`, {
                order_id:options.order_id,
                payment_id:response.razorpay_payment_id,
                status:'success'
            }, {headers: { 'Authorization': `Bearer ${token}` }})
            alert('You are a Premium User Now');
            localStorage.removeItem('user');
            window.location.href='/expense/premium';
        },
    };
    const rzp1= new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', async function(response){
        console.log(response);
        try{
            await axios.post(`http://127.0.0.1:3000/purchase/updatetransactionstatus`, {
                order_id: options.order_id,
                payment_id: response.error.metadata.payment_id,
                status: 'failed'
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Payment failed. Please try again.');
        }catch (error) {
            console.error('Error updating transaction status on failure:', error);
            alert('Error updating transaction status.');
        };
    });
};


function download(){
    console.log('sending to axios');
    const token=localStorage.getItem('token');
    axios.get('http://127.0.0.1:3000/premium/download', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 200){
            var a = document.createElement("a");
            a.href = response.data.fileUrl;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        alert(err.response.data.message);
       console.log(err);
    });
}

function loadExpenses(page) {
    let itemsPerPage=JSON.parse(localStorage.getItem('itemsPerPage'));
    axios.get(`http://127.0.0.1:3000/expense/getexpense?page=${page}&limit=${itemsPerPage}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(result => {
        const { expenses, totalExpenses, totalPages } = result.data;
        console.log(expenses);

        // Set totalPages dynamically
        window.totalPages = totalPages;
        expenselist.innerHTML = ''
        expenses.forEach(expense => {
            addtolist(expense);
        });
        renderPagination(currentPage, totalPages);
    })
    .catch(err => console.log(err));
}

function renderPagination(currentPage, totalPages) {
    if(paginationContainer!==null)
    {
    paginationContainer.innerHTML = '';
    }

    const prevButton = document.createElement('li');
    prevButton.className = "page-item";
    const prevLink = document.createElement('a');
    prevLink.className = "page-link";
    prevLink.textContent = "Previous";
    prevLink.href = "#";
    prevLink.onclick = () => changePage(currentPage - 1);
    prevButton.appendChild(prevLink);
    prevButton.classList.toggle('disabled', currentPage === 1);
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('li');
        pageButton.className = "page-item";
        const pageLink = document.createElement('a');
        pageLink.className = "page-link";
        pageLink.textContent = i;
        pageLink.href = "#";
        pageLink.onclick = () => changePage(i);
        pageButton.appendChild(pageLink);
        pageButton.classList.toggle('active', i === currentPage);
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement('li');
    nextButton.className = "page-item";
    const nextLink = document.createElement('a');
    nextLink.className = "page-link";
    nextLink.textContent = "Next";
    nextLink.href = "#";
    nextLink.onclick = () => changePage(currentPage + 1);
    nextButton.appendChild(nextLink);
    nextButton.classList.toggle('disabled', currentPage === totalPages);
    paginationContainer.appendChild(nextButton);
}

function changePage(page) {
    if (page > 0 && page <= totalPages) {
        currentPage = page;
        loadExpenses(currentPage);
    }
}