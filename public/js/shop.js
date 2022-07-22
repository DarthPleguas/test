'use strict';

class Shop {
    constructor() {
       this.removeProduct();
       this.emptyCart(); 
       this.updateCart();
    }

    updateCart() {
        const btn = document.querySelector('#update-cart');
        if(btn) {
            btn.addEventListener('click', async e => {
                e.preventDefault();
                const quantities = document.querySelectorAll('.quantity');
                const data = [];
                quantities.forEach(quantity => {
                    let qty = quantity.dataset.id + '-' + quantity.value;
                    data.push(qty);
                });
                const qs = 'quantity=' + data.join(',');
                const params = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: qs
                };
                const response = await fetch('/cart/update', params);
                const output = await response.json();

                if(output.updated) {
                    window.location = location.href;
                }
            }, false);
        } 
    }

    emptyCart() {
        const btn = document.querySelector('#empty-cart');
        if(btn) {
            btn.addEventListener('click', async e => {
                e.preventDefault();
                const params = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: ''
                };
                const response = await fetch('/cart/empty', params);
                const output = await response.json();

                if(output.emptied) {
                    window.location = location.href;
                }
            }, false);
        }
    }

    removeProduct() {
        const links = document.querySelectorAll('.remove-product');
        if(links.length > 0) {
            links.forEach(link => {
                link.addEventListener('click', async e => {
                    e.preventDefault();
                    const id = link.dataset.id;
                    const params = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: 'id=' + id
                    };
                    const response = await fetch('/cart/remove', params);
                    const output = await response.json();

                    if(output.deleted) {
                        window.location = location.href;
                    }
                }, false);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const shop = new Shop();
});