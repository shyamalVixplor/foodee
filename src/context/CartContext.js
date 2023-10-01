import React, {useReducer, useContext} from 'react';
const CartContext = React.createContext();
import {cartReducer} from './Reducer';
// export default CartContext;
const CartContextProvider = ({children}) => {
  const [cart, dispatch] = useReducer(cartReducer, {
    cartItem: [],
    totalPrice: 0,
    qty: 0,
    resID: '',
    resDis: [],
    service: '',
    resCondition: 0,
  });

  // // to Add previous item to  Cart

  // const getCartItemFromAsyncStorage = CartData => {
  //   // console.log('CartData Fetch From ASYNC', CartData);
  //   return dispatch({
  //     type: 'FETCHCART',
  //     data: CartData,
  //   });
  // };

  // to Add item to  Cart
  const addItem = (item, dataId, resDiscount, service, condition) => {
    // console.log('iD', id);
    // console.log('Food Item', item);
    console.log('dataId', dataId);
    console.log('Discount of Restaurant', resDiscount);
    console.log('Service type', service);
    console.log('restaurant Condition', condition);
    let groupID = dataId == undefined ? null : dataId;
    // console.log('mainItem', mainItem);
    // return;
    return dispatch({
      type: 'ADD_TO_CART',
      food: item,
      itemGrpID: groupID,
      discount: resDiscount,
      service: service,
      condition: condition,
    });
  };

  //to Handle Choice Product in cart

  const HandleChoice = (id, data, choiceTotalPrice) => {
    // console.log('ChoiceProduct ID', id);
    // console.log('Choice Product', data);

    return dispatch({
      type: 'CHOICE',
      payload: id,
      choiceProduct: data,
      amount: choiceTotalPrice,
    });
  };

  // to Increment item QTY to  Cart
  const increment = (id, item) => {
    // console.log('categoryIndex', categoryIndex);
    return dispatch({
      type: 'INC',
      payload: id,
      food: item,
    });
  };
  // to Decrement item QTY to  Cart
  const decrement = (id, item) => {
    return dispatch({type: 'DEC', payload: id, food: item});
  };
  // to Delete particular  item  to  Cart
  const deleteItem = item => {
    return dispatch({
      type: 'DELETE',
      food: item,
    });
  };
  // to Empty  Cart
  const removeAllItem = () => {
    return dispatch({type: 'REMOVEALL'});
  };
  return (
    <CartContext.Provider
      value={{
        ...cart,
        addItem,
        increment,
        decrement,
        deleteItem,
        removeAllItem,
        HandleChoice,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;

export const CartState = () => {
  return useContext(CartContext);
};
