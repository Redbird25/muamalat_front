import {UTILITY} from "../actions";
import {get} from "lodash";


const FavouritesAction = (action = "like", id = null, dispatch = null, products = null, item) => {
  if (action === "allCart") {
    products[get(item, "id")] = {
      ...item,
      like: get(products, `${get(item, "id")}.like`),
      equal: get(products, `${get(item, "id")}.equal`),
      cart: !get(products, `${get(item, "id")}.cart`),
      quantity: get(products, `${get(item, "id")}.quantity`, 1),
    }

    dispatch(UTILITY.success({
      products: products
    }));
  } else if (action === "allLike") {
    products[get(item, "id")] = {
      ...item,
      like: !get(products, `${get(item, "id")}.like`),
      equal: get(products, `${get(item, "id")}.equal`),
      cart: get(products, `${get(item, "id")}.cart`),
      quantity: get(products, `${get(item, "id")}.quantity`, 1),
    }

    dispatch(UTILITY.success({
      products: products
    }));
  } else {
    let product = {...products};

    product[get(item, "id")] = {
      ...item,
      like: action === "like" ? !get(product, `${get(item, "id")}.like`) : get(product, `${get(item, "id")}.like`),
      equal: action === "equal" ? !get(product, `${get(item, "id")}.equal`) : get(product, `${get(item, "id")}.equal`),
      cart: action === "cart" ? !get(product, `${get(item, "id")}.cart`) : get(product, `${get(item, "id")}.cart`),
      quantity: action === "quantity-minus" || action === "quantity-plus"
        ? action === "quantity-plus"
          ? get(product, `${get(item, "id")}.quantity`, 1) + 1
          : get(product, `${get(item, "id")}.quantity`, 1) === 1 ? 1 : get(product, `${get(item, "id")}.quantity`, 1) - 1
        : get(product, `${get(item, "id")}.quantity`, 1),
    }

    if (products) {
      if (!get(product[get(item, "id")], "like") && !get(product[get(item, "id")], "cart") && !get(product[get(item, "id")], "equal")) {
        delete product[get(item, "id")]
      }
    }


    dispatch(UTILITY.success({
      products: product
    }));
  }
};

export default FavouritesAction;
