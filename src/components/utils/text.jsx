import React from "react";

export default function AuthorNames({ text, shouldBeBold }) {
    const textArray = text.split(shouldBeBold);
    return (
      <span className="text-gray-300">
        {textArray.map((item, index) => (
          <React.Fragment key={index}>
            <span className="text-gray-300 italic"> {item} </span>
            {index !== textArray.length - 1 && (
              <span className="text-blue-400 font-bold italic underline">{shouldBeBold}</span>
            )}
          </React.Fragment>
        ))}
      </span>
  );
}