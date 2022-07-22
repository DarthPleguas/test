'use strict';

const Product = require('./Product');

class Cart {
    constructor() {
        this.items = [];
        this.total = 0.00;
        this.fee = 0.00;
    }

    setItems(items) {
        if(Array.isArray(items)) {
            this.items = items;
        }
    }

    getItems() {
        return this.items;
    }

    setTotal(total) {
        if(typeof total === 'number') {
            this.total = total;
        }
    }

    getTotal() {
        return this.total;
    }

    setFee(fee) {
        if(typeof fee === 'number') {
            this.fee = fee;
        }
    }

    getFee() {
        return this.fee;
    }

    addToCart({product, quantity}) {
        if(product instanceof Product && !this.isInCart(product)) {
            this.items.push({
                product,
                quantity
            });

            this.calculateTotal();
        }
    }

    removeItem(productId) {
        for(let i = 0; i < this.items.length; i++) {
            if(this.items[i].product.id === productId) {
                this.items.splice(i, 1);
            }
        }
        this.calculateTotal();
    }

    isInCart(product) {
        const foundProduct = this.items.find(prod => { return prod.product.id === product.id } );
        return foundProduct ? true : false;
    }

    calculateTotal() {
        let total = 0.00;
        for(let item of this.items) {
            let partial = item.product.price * item.quantity;
            total += partial;
        }
        this.total = total + this.fee;
    }

    updateCart({id, quantity}) {
        if(quantity === 0) {
            return;
        }

        let index = 0;
        for(let i = 0; i < this.items.length; i++) {
            if(this.items[i].product.id === id) {
                index = i;
                break;
            }
        }
        this.items[index].quantity = quantity;
        this.calculateTotal();
    }
}

module.exports = Cart;