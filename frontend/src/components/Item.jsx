import React, { useState } from "react";

const Item = ({ id, title, link, handleComplete, handleDelete }) => {
  const [completed, setCompleted] = useState(false);

  const handleCheckbox = () => {
    setCompleted(!completed);
    handleComplete(id);
  };

  const handleDeleteClick = () => {
    handleDelete(id);
  };

  return (
    <div
      className={`border border-[#FFDF2B] rounded-md p-4 m-4 ${
        completed ? "opacity-50 line-through" : ""
      } shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col gap-4 max-w-md bg-[#232325]`}
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={completed}
          onChange={handleCheckbox}
          className="mr-2"
        />
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        {link}
      </a>
      <button
        onClick={handleDeleteClick}
        className="block transition ease-in delay-100 px-4 border py-2 text-[#232325] bg-[#FFDF2B] rounded-lg hover:text-[#FFDF2B] hover:bg-[#232325] border-[#FFDF2B]"
      >
        Delete
      </button>
    </div>
  );
};

export default Item;
