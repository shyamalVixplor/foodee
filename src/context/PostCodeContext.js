import React, {useReducer, useContext, useEffect} from 'react';
const PostCodeContext = React.createContext();
import {postCodeReducer} from './Reducer';

const CodeContext = ({children}) => {
  const [state, dispatch] = useReducer(postCodeReducer, {
    postcode: null,
    isChanged: false,
  });

  // Post code updated
  const changePostCode = data => {
    console.log('data', data);
    let code = data.code;
    let update = data.updated;
    return dispatch({type: 'CHANGE', payload: update, updateCode: code});
  };
  return (
    <PostCodeContext.Provider value={{state, changePostCode}}>
      {children}
    </PostCodeContext.Provider>
  );
};
export default CodeContext;
export const PostCodeState = () => {
  return useContext(PostCodeContext);
};
