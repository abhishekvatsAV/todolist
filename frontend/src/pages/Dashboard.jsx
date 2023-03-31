import axios from "axios";
import Item from "../components/Item";
import { useEffect, useState } from "react";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

let itemId;
const Dashboard = () => {

  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: "", link: "" });
  const updatelist = async (items) => {
    console.log("update list has been called.");
    let res = await axios.put("http://localhost:4000/", {
      itemId: itemId,
      items: items,
    });

    if (res.status !== 200) {
      // handle error
      console.log("failed to update the list.");
    }
    itemId = res.data.itemId;
  };

  useEffect(() => {
    const getTodo = async () => {
      const response = await axios.get("http://localhost:4000/");
      if (response.status !== 200) {
        return;
      }
      let todos = response.data.length !== 0 ? response.data[0].item : [];
      itemId = response.data.length !== 0 ? response.data[0]._id : null;
      setTodoList(todos);
    };
    getTodo();
  }, []);

  const handleAddTodo = () => {
    const newId = Math.max(...todoList.map((todo) => todo.id), 0) + 1;
    let newArr = [...todoList, { id: newId, ...newTodo }];
    updatelist(newArr);
    setTodoList(newArr);
    setNewTodo({ title: "", link: "", completed: false });
  };

  const handleComplete = (id) => {
    let newArr = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodoList(newArr);
    updatelist(newArr);
  };

  const handleDelete = (id) => {
    console.log("first : ", id);
    let newArr = todoList.filter((todo, i) => i !== id);
    setTodoList(newArr);
    console.log(todoList);
    updatelist(newArr);
  };

  const handleChange = (e) => {
    setNewTodo({ ...newTodo, [e.target.name]: e.target.value });
  };

  const handleDragEnd = (result) => {
    console.log("TODOS: ", todoList);
    if (!result.destination) return;
    console.log("result: ", result);
    const tempData = Array.from(todoList);
    console.log("tempData: ", tempData);
    console.log(tempData, result.source, result.source.index - 1);
    const [moveItem] = tempData.splice(result.source.index, 1);
    console.log("moveItem: ", moveItem);
    tempData.splice(result.destination.index, 0, moveItem);

    console.log("TODOS: ", todoList);
    console.log("tempData: ", tempData);
    setTodoList(tempData);
    updatelist(tempData);
  };

  return (
    <div className="container mx-auto text-white">
      <h1 className="p-4 text-4xl font-bold text-center text-white">
        Dashboard
      </h1>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col w-64 gap-4 p-4 m-4 border border-gray-400 rounded-md">
          <input
            type="text"
            name="title"
            placeholder="Todo Title"
            value={newTodo.title}
            onChange={handleChange}
            className="block w-full p-2 mb-2 rounded-md text-white outline-none focus:outline-[#FFDF2B] bg-transparent"
          />
          <input
            type="text"
            name="link"
            placeholder="Todo Link"
            value={newTodo.link}
            onChange={handleChange}
            className="block w-full p-2 mb-2  rounded-md text-white outline-none focus:outline-[#FFDF2B] bg-transparent"
          />
          <button
            onClick={handleAddTodo}
            className="px-4 py-2 font-bold transition ease-in delay-100 border  hover:text-[#232325] hover:bg-[#FFDF2B] text-[#FFDF2B] bg-[#232325] rounded-lg border-[#FFDF2B]"
          >
            Add Todo
          </button>
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId={"1"}>
            {(provided, snapshot) => {
              return (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {todoList.map((item, i) => (
                    <Draggable draggableId={`${i}`} index={i}>
                      {(provided) => {
                        return (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <Item
                              key={i}
                              id={i}
                              title={item.title}
                              link={item.link}
                              handleComplete={handleComplete}
                              handleDelete={handleDelete}
                            />
                          </div>
                        );
                      }}
                    </Draggable>
                  ))}
                </div>
              );
            }}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Dashboard;
