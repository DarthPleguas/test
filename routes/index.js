const products = require("../data/products");
const Product = require("../classes/Product");
const Cart = require("../classes/Cart");

module.exports = {
  home(req, res) {
    res.render("index", {
      title: "Home | Shop",
      products: products,
    });
  },
  cart(req, res) {
    if (!req.session.cart) {
      res.redirect("/");
      return;
    }
    const isEmpty = req.session.cart.items.length > 0 ? false : true;
    const cart = req.session.cart;

    res.render("cart", {
      title: "Cart | Shop",
      isEmpty,
      cart,
    });
  },
  addToCart(req, res) {
    const { id, quantity } = req.body;
    const product = products.find((prod) => {
      return prod.id === parseInt(id, 10);
    });
    if (!product) {
      res.sendStatus(404);
      return;
    }
    let cart, prod;
    if (!req.session.cart) {
      cart = new Cart();
      prod = new Product({
        name: product.name,
        price: product.price,
        id: product.id,
      });

      cart.addToCart({ product: prod, quantity: parseInt(quantity, 10) });

      req.session.cart = {
        items: cart.items,
        total: cart.total,
      };
    } else {
      cart = new Cart();
      prod = new Product({
        name: product.name,
        price: product.price,
        id: product.id,
      });

      cart.setItems(req.session.cart.items);
      cart.setTotal(req.session.cart.total);

      cart.addToCart({ product: prod, quantity: parseInt(quantity, 10) });

      req.session.cart = {
        items: cart.items,
        total: cart.total,
      };
    }

    res.redirect("/cart");
  },

  removeFromCart(req, res) {
    if (!req.session.cart) {
      res.sendStatus(403);
      return;
    }

    const { id } = req.body;
    const { items, total } = req.session.cart;

    const cart = new Cart();
    cart.setItems(items);
    cart.setTotal(total);
    cart.removeItem(parseInt(id, 10));

    req.session.cart = {
      items: cart.items,
      total: cart.total,
    };

    res.send({ deleted: true });
  },

  getCart(req, res) {
    const output = req.session.cart ? req.session.cart : {};
    res.send(output);
  },

  emptyCart(req, res) {
    if (!req.session.cart) {
      res.sendStatus(403);
      return;
    }
    delete req.session.cart;
    res.send({ emptied: true });
  },

  updateCart(req, res) {
    if (!req.session.cart) {
      res.sendStatus(403);
      return;
    }

    const { quantity } = req.body;
    const { items, total } = req.session.cart;
    const parts = quantity.split(",");

    const cart = new Cart();
    cart.setItems(items);
    cart.setTotal(total);

    for (let part of parts) {
      let data = part.split("-");
      let [id, qty] = data;
      cart.updateCart({ id: parseInt(id, 10), quantity: parseInt(qty, 10) });
    }

    req.session.cart = {
      items: cart.items,
      total: cart.total,
    };

    res.send({ updated: true });
  },
};
