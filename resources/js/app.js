
import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin';

let addToCart =document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter')

function updateCart(pizza){
    // send req to server
    //add pizza to cart
    //axios call use krenge
    axios.post('/update-cart',pizza).then(res=>{
        
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Item Added To Cart',
            progressBar: false,
        }).show();
    }).catch(err=>{
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Something Went Wrong',
            progressBar: false,
        }).show();
    })
}


addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        
        let pizza =JSON.parse(btn.dataset.pizza);
         updateCart(pizza)
    })
})

// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}


initAdmin();
