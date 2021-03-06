import { Action } from 'redux';

import { TokenModel } from '../models/token';
import { BASE_URL } from '../constants/api';
import { discardUser, fetchUser } from '../actions/user';

export enum actionTypes {
  FETCH_TOKEN = 'FETCH_TOKEN',
  RECEIVE_TOKEN = 'RECEIVE_TOKEN',
  DISCARD_TOKEN = 'DISCARD_TOKEN',
}

export interface FetchTokenAction extends Action {
  type: actionTypes.FETCH_TOKEN;
  username: string;
  password: string;
}

export interface ReceiveTokenAction extends Action {
  type: actionTypes.RECEIVE_TOKEN;
  username: string;
  token: TokenModel;
}

export interface DiscardTokenAction extends Action {
  type: actionTypes.DISCARD_TOKEN;
}

export type TokenAction = FetchTokenAction | DiscardTokenAction | ReceiveTokenAction;

export function receiveTokenActionCreator(username: string, token: TokenModel): ReceiveTokenAction {
  return {
    type: actionTypes.RECEIVE_TOKEN,
    username,
    token
  };
}

export function discardTokenActionCreator(): DiscardTokenAction {
  return {
    type: actionTypes.DISCARD_TOKEN,
  };
}

export function fetchToken(username: string, password: string): any {
  function handleErrors(response: any) {
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }
    return response;
  }

  let credentials = {
    username: username,
    password: password
  };
  return (dispatch: any) => {
    return fetch(BASE_URL + '/users/token', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      }
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(json => dispatch(receiveTokenActionCreator(username, json)))
      .then(() => dispatch(fetchUser()));
  };
}

export function discardToken(): any {
  return (dispatch: any) => {
    dispatch(discardUser());
    return dispatch(discardTokenActionCreator());
  };
}
