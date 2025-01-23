"use strict";
const themeSwitcherBtn = document.getElementById("theme-switcher");
const bodyTag = document.querySelector("body");
const addBtn = document.getElementById("add-btn");
const todoInput = document.getElementById("addt");
const filter = document.querySelector(".filter");
const ul = document.querySelector(".todos");
const btnFilter = document.querySelector("#clear-completed");

function main() {
  themeSwitcherBtn.addEventListener("click", () => {
    bodyTag.classList.toggle("light");
    const themeImg = themeSwitcherBtn.children[0];
    themeImg.setAttribute(
      "src",
      themeImg.getAttribute("src") === "assets/images/icon-moon.svg"
        ? "assets/images/icon-sun.svg"
        : "assets/images/icon-moon.svg"
    );
  });

  filter.addEventListener("click", (e) => {
    const filterClass = e.target.id;
    if (filterClass) {
      document.querySelector(".on").classList.remove("on");
      e.target.classList.add("on");
      updateTodoDisplay(filterClass);
    }
  });
}

function updateTodoDisplay(filterClass) {
  const allTodos = document.querySelectorAll(".todos .card");
  allTodos.forEach((todo) => {
    todo.style.display = "flex";
    switch (filterClass) {
      case "active":
        if (todo.classList.contains("checked")) {
          todo.style.display = "none";
        }
        break;
      case "completed":
        if (!todo.classList.contains("checked")) {
          todo.style.display = "none";
        }
        break;
      case "all":
        break;
    }
  });
}

function removeToDo(index) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function removeCompletedTodos() {
  const todos = JSON.parse(localStorage.getItem("todos"));
  const incompleteTodos = todos.filter((todo) => !todo.isCompleted);
  localStorage.setItem("todos", JSON.stringify(incompleteTodos));
  renderTodos();
}

function stateTodo(index, isComplete) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos[index].isCompleted = isComplete;
  localStorage.setItem("todos", JSON.stringify(todos));
}

addBtn.addEventListener("click", () => {
  const item = todoInput.value.trim();
  if (item) {
    todoInput.value = "";
    const todos = !localStorage.getItem("todos")
      ? []
      : JSON.parse(localStorage.getItem("todos"));
    const currentTodo = {
      item: item,
      isCompleted: false,
    };
    todos.push(currentTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
  }
});

todoInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    addBtn.click();
  }
});

btnFilter.addEventListener("click", removeCompletedTodos);

function renderTodos() {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  const ItemsLeft = document.getElementById("items-left");
  ul.innerHTML = "";

  todos.forEach((todoObject, index) => {
    const card = document.createElement("li");
    const cbContainer = document.createElement("div");
    const cbInput = document.createElement("input");
    const checkSpan = document.createElement("span");
    const item = document.createElement("p");
    const clearBtn = document.createElement("button");
    const img = document.createElement("img");

    card.classList.add("card");
    cbContainer.classList.add("cb-container");
    cbInput.classList.add("cb-input");
    checkSpan.classList.add("check");
    item.classList.add("item");
    clearBtn.classList.add("clear");

    card.setAttribute("draggable", true);
    cbInput.setAttribute("type", "checkbox");
    img.setAttribute("src", "assets/images/icon-cross.svg");
    img.setAttribute("alt", "Clear It");

    item.textContent = todoObject.item;
    if (todoObject.isCompleted) {
      card.classList.add("checked");
      cbInput.setAttribute("checked", "checked");
    }

    card.addEventListener("dragstart", () => {
      card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
    });

    clearBtn.addEventListener("click", () => {
      removeToDo(index);
      renderTodos();
    });

    cbInput.addEventListener("click", () => {
      const checked = cbInput.checked;
      stateTodo(index, checked);
      checked
        ? card.classList.add("checked")
        : card.classList.remove("checked");
      renderItemsLeft();
    });

    clearBtn.appendChild(img);
    cbContainer.appendChild(cbInput);
    cbContainer.appendChild(checkSpan);
    card.appendChild(cbContainer);
    card.appendChild(item);
    card.appendChild(clearBtn);
    ul.appendChild(card);
  });

  renderItemsLeft();
}

function renderItemsLeft() {
  const itemsLeft = document.getElementById("items-left");
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  const incompleteTodos = todos.filter((todo) => !todo.isCompleted);
  itemsLeft.textContent = incompleteTodos.length;
}
function clearAllTodos() {
  localStorage.removeItem("todos");
  renderTodos();
}

document.addEventListener("DOMContentLoaded", () => {
  renderTodos();
  main();
});
