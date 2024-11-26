import { combineReducers } from 'redux';
import ChangeLayoutMode from './themeLayout/reducers';
import Todo from './todo/reducers';
import Task from './task/reducers';

const rootReducers = combineReducers({
  ChangeLayoutMode,
  Todo,
  Task,
});

export default rootReducers;
