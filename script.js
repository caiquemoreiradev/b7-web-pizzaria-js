pizzaJson.map((item, index) => {

    //Clonando o modelo
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);

    //Setando id
    pizzaItem.setAttribute('data-key', index);

    //Adicionando imagem
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;

    //Adicionando preço
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;

    //Adicionando nome
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;

    //Adicionando descrição
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    showModal(pizzaItem, pizzaJson);

    if (item.type == 'salgada') {
        document.querySelector('.pizza-area').append(pizzaItem);
    }

    if(item.type == 'doce') {
        document.querySelector('.pizza-doce-area').append(pizzaItem);
    }
});

let modalQt = 1;
let cart = [];
let modalKey = 0;

let sizePizza = 1;
let pizzaPrice;
let newPrice;
let arrayPizzas = [];


function showModal(pizzaItem, pizzaArray) {
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        document.querySelector('.pizzaBig img').src = pizzaArray[key].img;
        document.querySelector('.pizzaInfo h1').innerHTML = pizzaArray[key].name;
        document.querySelector('.pizzaInfo--desc').innerHTML = pizzaArray[key].description;

        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');

        document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {

            if (sizeIndex == 1) {
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = pizzaArray[key].sizes[sizeIndex];
        })

        pizzaPrice = pizzaArray[key].price;
        newPrice = pizzaPrice;

        document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaPrice.toFixed(2)}`;

        document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;

        document.querySelector('.pizzaWindowArea').style.opacity = 0;
        document.querySelector('.pizzaWindowArea').style.display = 'flex';

        setTimeout(() => {
            document.querySelector('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    })
}


//Modal Events
function closeModal() {
    document.querySelector('.pizzaWindowArea').style.opacity = 0;

    setTimeout(() => {
        document.querySelector('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

document.querySelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
})

document.querySelector('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;
    }
    else {
        return;
    }
})

document.querySelector('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;
})



document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        sizePizza = sizeIndex;
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');

        if (sizeIndex == 0) {
            newPrice = pizzaPrice - 5;
            document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${newPrice.toFixed(2)}`;
        }

        else if (sizeIndex == 1) {
            newPrice = pizzaPrice;
            document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${newPrice.toFixed(2)}`;
        }

        else if (sizeIndex == 2) {
            newPrice = pizzaPrice + 5;
            document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${newPrice.toFixed(2)}`;
        }
    })
})


document.querySelector('.pizzaInfo--addButton').addEventListener('click', () => {

    //Preço atacado
    let totalPrice = newPrice.toFixed(2) * modalQt;

    let identifier = pizzaJson[modalKey].id + '@' + sizePizza;

    let keyIdentifier = cart.findIndex(item => item.identifier == identifier)

    if (keyIdentifier > - 1) {
        cart[keyIdentifier].qt += modalQt;
    }
    else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            sizePizza,
            qt: modalQt,
            totalPrice
        });
    }

    updateCart();
    closeModal();
})

function updateCart() {
    if (cart.length > 0) {
        document.querySelector('aside').classList.add('show');

        document.querySelector('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzaJson.find(item =>  item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let carItem = document.querySelector('.models .cart--item').cloneNode(true);

            let pizzaSizeAbrev;

            switch(cart[i].sizePizza) {
                case 0: 
                pizzaSizeAbrev = 'P';
                break;
                case 1: 
                pizzaSizeAbrev = 'M';
                break;
                case 2: 
                pizzaSizeAbrev = 'G';
                break;
            }

            let pizzaTitle = `${pizzaItem.name} (${pizzaSizeAbrev})`; 

            carItem.querySelector('img').src = pizzaItem.img;
            carItem.querySelector('.cart--item-nome').innerHTML = pizzaTitle;
            carItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            carItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                }
                else {
                    cart.splice(i, 1);
                }
                updateCart();
            })
            carItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            })

            document.querySelector('.cart').append(carItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        document.querySelector('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        document.querySelector('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        document.querySelector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    }

    else {
        document.querySelector('aside').classList.remove('show');
    }
}



