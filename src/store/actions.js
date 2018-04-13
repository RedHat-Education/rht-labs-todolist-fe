import axios from "axios";
import config from "@/config";

const dummyData = [
  {
    title: "Learn awesome things about Labs 🔬",
    completed: false,
    important: false
  },
  {
    title: "Learn about my friend Jenkins 🎉",
    completed: true,
    important: false
  },
  {
    title: "Drink Coffee ☕💩",
    completed: false,
    important: true
  }
];
export default {
  loadTodos({ commit }) {
    axios
      .get(config.todoEndpoint)
      .then(r => r.data)
      .then(todos => {
        commit("SET_TODOS", todos);
        commit("SET_LOADING", false);
      })
      .catch(err => {
        if (err) {
          console.info("INFO - setting dummy data because of ", err);
          commit("SET_TODOS", dummyData);
          commit("SET_LOADING", false);
        }
      });
  },
  addTodo({ commit, state }) {
    if (!state.newTodo) {
      // do not add empty todos
      return;
    }
    // debugger
    const todo = {
      title: state.newTodo,
      completed: false,
      important: false
    };
    axios
      .post(config.todoEndpoint, todo)
      .then(mongoTodo => {
        commit("ADD_TODO", mongoTodo.data);
      })
      .catch(err => {
        if (err) {
          console.info("INFO - Adding dummy todo because of ", err);
          let mongoTodo = todo;
          mongoTodo._id = "fake-todo-item-" + Math.random();
          commit("ADD_TODO", mongoTodo);
        }
      });
  },
  setNewTodo({ commit }, todo) {
    // debugger
    commit("SET_NEW_TODO", todo);
  },
  clearNewTodo({ commit }) {
    commit("CLEAR_NEW_TODO");
  },
  clearTodos({ commit, state }, all) {
    // 1 fire and forget or
    const deleteStuff = id => {
      axios.delete(config.todoEndpoint + "/" + id).then(data => {
        console.info("INFO - item " + id + " deleted", data);
      });
    };

    if (all) {
      state.todos.map(todo => {
        deleteStuff(todo._id);
      });
      commit("CLEAR_ALL_TODOS");
    } else {
      state.todos.map(todo => {
        // axios remove all done by the id
        if (todo.completed) {
          deleteStuff(todo._id);
        }
      });
      commit("CLEAR_ALL_DONE_TODOS");
    }
    //  2 return array of promises and resolve all
  },
  updateTodo({ commit, state }, id) {
    let i = state.todos.findIndex(todo => todo._id === id);
    // todo - add back end
    axios
      .put(config.todoEndpoint + "/" + state.todos[i]._id, state.todos[i])
      .then(data => {
        console.info("INFO - item " + id + " updated", data);
      });
    commit("MARK_TODO_COMPLETED", i);
  }
};
