import React, { Component, PropTypes } from 'react'
import {bindActionCreators} from 'redux'
import { connect } from 'react-redux'
import { VisibilityFilters } from '../actions/actions.js'
import * as todoActionCreators from '../actions/actions.js'
import AddTodo from '../components/AddTodo'
import TodoList from '../components/TodoList'
import Footer from '../components/Footer'
import ReactDOM from 'react-dom'

class App extends Component {
  render() {
    // connect 之后, 会将 mapStateToProps, mapDispatchToProps 函数中所要返回的对象注入到 this.props 中
    // 注入之后, 用 this.props.dispatch 便可直接 dispatch 一个 action, 如果不用的话, 得 store.dispatch 一下了
    const { actions }  = this.props // react-redux actions 的函数
    const { visibleTodos, visibilityFilter} = this.props // react-redux state 的数据
    return (
      <div>
        <AddTodo
          actions = { actions }
        />
        <TodoList
          actions = { actions }
          visibleTodos={visibleTodos}
        />
        <Footer
          actions = { actions }
          visibilityFilter={visibilityFilter}
        />
      </div>
    )
  }
}

App.propTypes = {
  visibleTodos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired).isRequired,
  visibilityFilter: PropTypes.oneOf([
    'SHOW_ALL',
    'SHOW_COMPLETED',
    'SHOW_ACTIVE'
  ]).isRequired
}

function selectTodos(todos, filter) {
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return todos
    case VisibilityFilters.SHOW_COMPLETED:
      return todos.filter(todo => todo.completed)
    case VisibilityFilters.SHOW_ACTIVE:
      return todos.filter(todo => !todo.completed)
  }
}

// connect方法中的回调函数，负责向当前组件的 props 中注入 state
// 一旦状态树变化, mapStateToProps 函数就会被调用
function mapStateToProps(state) {
  // return 返回的是需要向组件中注入的 props
  // 注入之后通过 this.props 查看这些 state 了
  // 这里的参数 state, 就是 reducers.js 里的状态树了
  // console.log(state,'state')
  return {
    visibleTodos: selectTodos(state.todos, state.visibilityFilter),
    visibilityFilter: state.visibilityFilter
  }
}

function mapDispatchToProps(dispatch){
  // todoActionCreators 是从其他文件 import 的 一堆 action creators
  return {actions: bindActionCreators(todoActionCreators, dispatch)}
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(mapStateToProps)(App) 中；
// connect 之后就可以在当前组件用 this.props.actions, this.props.visibilityFilter 获取到 state 和 actions 了
export default connect(mapStateToProps,mapDispatchToProps)(App) // react-redux
