import React, {useReducer, useContext, useEffect} from 'react';
const RestaurantContext = React.createContext();
import {resDataReducer} from './Reducer';

const ResDataContext = ({children}) => {
  const initialState = {
    conditionalAmount: '',
    discountType: '',
    discountVal: '',
    restaurantCondition: 0,
    restaurantID: '',
    service: '',
  };
  const [state, dispatch] = useReducer(resDataReducer, initialState);

  //Save Restaurant Data
  const SaveResData = data => {
    console.log('data', data);
    return dispatch({type: 'SAVE', payload: data});
  };

  // Post code updated

  const ResetResData = data => {
    console.log('data', data);
    return dispatch({type: 'CHANGE', payload: data});
  };
  return (
    <RestaurantContext.Provider
      value={{state, initialState, SaveResData, ResetResData, dispatch}}>
      {children}
    </RestaurantContext.Provider>
  );
};
export default ResDataContext;
export const ResDataState = () => {
  return useContext(RestaurantContext);
};
