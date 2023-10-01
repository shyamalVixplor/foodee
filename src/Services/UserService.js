/* eslint-disable prettier/prettier */
import axios from 'axios';
import * as a from '../api/api';

class UserService {
  async Post(url, data, token) {
    let postUrl = a.API_URL + url;
    let Bearer = 'Bearer ' + token;
    console.log(postUrl);
    // console.log('Token from profile page',token);
    try {
      let res = await axios.post(postUrl, data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: Bearer,
        },
      });
      return res.data;
    } catch (e) {
      throw this.handler(e);
    }
  }
  async GuestPost(url, data) {
    let PostUrl = a.API_URL + url;
    console.log(PostUrl);
    // return

    try {
      let res = await axios.post(PostUrl, data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      return res.data;
    } catch (e) {
      throw this.handler(e);
    }
  }

  handler(err) {
    console.log('error found', err);
    let error = err;
    if (err.response && err.response.data.hasOwnProperty('message'))
      error = err.response.data;
    else if (!err.hasOwnProperty('message')) error = err.toJSON();
    return new Error(error.message);
  }
};


export default new UserService;
