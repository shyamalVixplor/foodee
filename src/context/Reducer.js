import AsyncStorage from '@react-native-async-storage/async-storage';

export const cartReducer = (state, action) => {
  const { cartItem, totalPrice, qty } = state;
  let product;
  let index;
  let updatedPrice;
  let updatedQTY;
  switch (action.type) {
    // case 'FETCHCART':
    //   console.log('CartData Fetch From ASYNC', action.data);
    //   let cartData = action.data.cartItem;
    //   let fullAmount = action.data.totalPrice;
    //   let fullQty = action.data.qty;
    //   let prevCart = cartItem;

    //   let AsyncCart = {
    //     cartItem: cartData,
    //     totalPrice: fullAmount,
    //     qty: fullQty,
    //   };
    //   console.log('Async Cart', AsyncCart);

    //   return AsyncCart;
    //   break;
    case 'ADD_TO_CART':
      console.log('Food', action.food);
      console.log('Item Group ID', action.itemGrpID);
      const check = cartItem.find(product =>
        product.category_id
          ? product.id == action.food.id &&
          product.category_id == action.food.category_id
          : product.id == action.food.id,
      );
      if (check) {
        return state;
      } else {
        let product = action.food;
        // console.log('Product', product);
        // console.log('Type of Product', typeof product);
        console.log('action of cart', action);
        let restaurantID = product.restaurant_id;
        let discount = action.discount;
        product.qty = 1;
        product.isAdded = true;
        product.itemGrpID =
          action.itemGrpID != undefined ? action.itemGrpID : null;
        updatedQTY = qty + 1;

        let initialTotalPrice = totalPrice == null ? 0 : parseFloat(totalPrice);
        console.log('totalPrice', totalPrice);
        console.log('initialTotalPrice', initialTotalPrice);
        updatedPrice = initialTotalPrice + parseFloat(product.price);

        console.log('updatedPrice', updatedPrice);
        let prevCart = cartItem;

        let FullCart = {
          cartItem: [product, ...prevCart],
          totalPrice: parseFloat(updatedPrice).toFixed(2),
          qty: updatedQTY,
          resID: restaurantID,
          resDis: discount,
          service: action.service,
          resCondition: action.condition,
        };
        console.log('Full Cart', FullCart);

        return FullCart;
      }

      break;

    case 'CHOICE':
      console.log('Cart Item', cartItem);
      console.log('ChoiceProduct ID', action.payload);
      console.log('Choice Product', action.choiceProduct);
      console.log('Choice Product Amount', action.amount);
      console.log('Total Amount', parseFloat(totalPrice));
      let cartItemClone = cartItem;
      console.log('cartItemClone', cartItemClone);
      let newArray = [];
      let totalChoiceProductPrice = parseFloat(action.amount);
      let productChoicePrice = 0;
      cartItemClone.map(data => {
        if (data.id == action.payload) {
          data.choice = action.choiceProduct;
          productChoicePrice =
            parseFloat(totalPrice) + parseFloat(totalChoiceProductPrice);
          newArray.push(data);
        } else {
          newArray.push(data);
        }
      });
      updatedPrice = parseFloat(productChoicePrice);

      // console.log('cartItemClone', cartItemClone);
      // console.log('newArray', newArray);
      console.log('productChoicePrice', productChoicePrice);
      console.log('updatedPrice', updatedPrice);

      FullCart = {
        cartItem: [...newArray],
        totalPrice: parseFloat(updatedPrice).toFixed(2),
        qty: qty,
        resID: state.resID,
        resDis: state.resDis,
        service: state.service,
        resCondition: state.resCondition,
      };
      console.log('Full Cart', FullCart);
      return FullCart;
      break;

    case 'INC':
      console.log('Cart Item', cartItem);
      console.log('State of Cart', state);
      console.log('Food Item', action.food);
      console.log('Food Item ID', action.payload);
      product = action.food;
      product.qty = product.qty + 1;
      updatedPrice = parseFloat(totalPrice) + parseFloat(product.price);
      updatedQTY = qty + 1;
      index = cartItem.findIndex(cart => cart.id === action.payload);
      // console.log('product', product);
      // console.log('product QTY', product.qty);
      // console.log('QTY', qty);
      // console.log('updatedQTY', updatedQTY);
      cartItem[index] = product;

      let FullCart = {
        cartItem: [...cartItem],
        totalPrice: parseFloat(updatedPrice).toFixed(2),
        qty: updatedQTY,
        resID: state.resID,
        resDis: state.resDis,
        service: state.service,
        resCondition: state.resCondition,
      };
      console.log('Full Cart', FullCart);

      return FullCart;
      break;

    case 'DEC':
      console.log('Cart Item', cartItem);
      console.log('Food Item', action.food);
      // console.log('Food Item ID', action.payload);
      product = action.food;
      // console.log('product', product);
      if (product.qty > 1) {
        product.qty = product.qty - 1;
        updatedPrice = parseFloat(totalPrice) - parseFloat(product.price);
        updatedQTY = qty - 1;
        index = cartItem.findIndex(cart => cart.id === action.payload);
        cartItem[index] = product;
        let FullCart = {
          cartItem: [...cartItem],
          totalPrice: parseFloat(updatedPrice).toFixed(2),
          qty: updatedQTY,
          resID: state.resID,
          resDis: state.resDis,
          service: state.service,
          resCondition: state.resCondition,
        };
        console.log('Full Cart', FullCart);

        return FullCart;
      } else {
        return state;
      }
      break;
    case 'DELETE':
      let product = action.food;
      let choiceTotalPrice = 0;
      product.choice
        ? product.choice.map(data => {
          choiceTotalPrice = choiceTotalPrice + parseFloat(data.price);
        })
        : null;

      // console.log('PrevCart', cartItem);
      // console.log('total Price', totalPrice);
      // console.log('Product Details', product);
      // console.log('choiceTotalPrice', choiceTotalPrice);
      console.log('choiceTotalPrice', choiceTotalPrice);

      if (product.choice) {
        product.choice = null;
      }
      console.log('Updated Product Details', product);
      const filtered = cartItem.filter(item => item.id !== product.id);
      updatedQTY = qty - product.qty;

      updatedPrice = totalPrice - choiceTotalPrice;
      console.log(
        'updatedPrice After deleting choice product total price',
        updatedPrice,
      );
      updatedPrice = updatedPrice - parseFloat(product.price) * product.qty;
      console.log('Total Price', totalPrice);
      console.log('new updatedPrice', updatedPrice);

      product['isAdded'] = false;

      let NewCart = {
        cartItem: [...filtered],
        totalPrice:
          parseFloat(updatedPrice).toFixed(2) < 0
            ? 0.0
            : parseFloat(updatedPrice).toFixed(2),
        qty: updatedQTY,
        resID: state.resID,
        resDis: state.resDis,
        service: state.service,
        resCondition: state.resCondition,
      };
      console.log('Full Cart', NewCart);
      return NewCart;
      break;
    case 'REMOVEALL':
      return {
        cartItem: [],
        totalPrice: null,
        qty: null,
        resID: '',
        resDis: [],
        service: '',
        resCondition: 0,
      };
      break;

    default:
      return state;
  }
};
export const postCodeReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return (state = {
        postcode: action.updateCode,
        isChanged: action.payload,
      });

      break;

    default:
      return state;
      break;
  }
};

export const resDataReducer = (state, action) => {
  switch (action.type) {
    case 'SAVE':
      let ResData = action.payload;
      console.log('REstaurant Data==>', ResData);
      return (state = {
        conditionalAmount: ResData.conditionalAmount,
        discountType: ResData.discountType,
        discountVal: ResData.discountVal,
        restaurantCondition: ResData.restaurantCondition,
        restaurantID: ResData.restaurantID,
        service: ResData.service,
      });

      break;
    case 'CHANGE':
      return (state = {
        postcode: action.updateCode,
        isChanged: action.payload,
      });

      break;
    default:
      return state;
      break;
  }
};
