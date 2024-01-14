import { createStore } from "./node_modules/redux/dist/redux.browser.mjs";

let index = 1;
let mode = "title";
let activeIndex = 0;

const ADD_NOTE = "ADD_NOTE";
const EDIT_NOTE = "EDIT_NOTE";
const DELETE_NOTE = "DELETE_NOTE";

// ACTIONS

const addNote = (note) => {
  return {
    type: ADD_NOTE,
    payload: note,
  };
};
const editNote = (note) => {
  return {
    type: EDIT_NOTE,
    payload: note,
  };
};
const deleteNote = (note) => {
  return {
    type: DELETE_NOTE,
    payload: note,
  };
};

// reducer

const appReducer = (state = [{ id: index, title: "", amount: 0 }], action) => {
  switch (action.type) {
    case ADD_NOTE:
      return [...state, action.payload];
    case EDIT_NOTE:
      const filteredState = state.filter((el) => el.id !== action.payload.id);
      return [...filteredState, action.payload].sort((a, b) => a.id - b.id);
    case DELETE_NOTE:
      return [...state.filter((el) => el.id !== action.payload.id)];
    default:
      return state;
  }
};

// store

const store = createStore(appReducer);

// dom

render();
document.getElementById("add-row").addEventListener("click", () => {
  mode = "title";
  activeIndex = store.getState().length;
  store.dispatch(addNote({ id: ++index, title: "", amount: 0 }));
});
document.getElementById("show-data").addEventListener("click", () => {
  console.log(store.getState());
});

store.subscribe(() => render());

// functions

function render() {
  const services = store.getState();
  document.querySelector(".app__body").innerHTML = "";

  services.forEach((service, idx) => {
    const serviceInput = createInput("text", "Service", service.title);
    const amountInput = createInput("number", "amount", service.amount);
    const deleteBtn = createBtn();

    serviceInput.addEventListener("change", () => {
      let rowData = {
        id: service.id,
        title: serviceInput.value,
        amount: service.amount,
      };
      mode = "amount";
      activeIndex = idx;
      store.dispatch(editNote(rowData));
    });
    amountInput.addEventListener("change", () => {
      let rowData = {
        id: service.id,
        title: service.title,
        amount: +amountInput.value,
      };
      mode = "delete";
      activeIndex = idx;
      store.dispatch(editNote(rowData));
    });
    deleteBtn.addEventListener("click", () => {
      mode = "title";
      activeIndex--;
      store.dispatch(deleteNote(service));
    });

    const row = createRow(serviceInput, amountInput, deleteBtn);
    document.querySelector(".app__body").appendChild(row);
  });

  let currentRow = document.querySelectorAll(".app__body > div")[activeIndex];

  switch (mode) {
    case "title":
      currentRow.querySelector('input[type="text"]').focus();
      break;
    case "amount":
      currentRow.querySelector('input[type="number"]').focus();
      currentRow.querySelector('input[type="number"]').select();
      break;
    case "delete":
      currentRow.querySelector("button").focus();
      break;
    default:
      currentRow.querySelector('input[type="text"]').focus();
  }

  const total = services.reduce((acc, el) => acc + +el.amount, 0);
  if (total)
    document.querySelector(".app__total").innerHTML = total.toLocaleString();
}

function createRow(...tags) {
  const rowTag = document.createElement("div");
  tags.forEach((tag) => {
    rowTag.appendChild(tag);
  });
  return rowTag;
}

function createInput(type, placeholder, value) {
  const input = document.createElement("input");
  input.setAttribute("type", type);
  input.setAttribute("placeholder", placeholder);
  input.value = value;
  return input;
}

function createBtn() {
  const btn = document.createElement("button");
  btn.innerHTML = "Delete";
  return btn;
}
