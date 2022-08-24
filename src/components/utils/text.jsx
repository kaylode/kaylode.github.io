import React from "react";

export default function AuthorNames({ text, shouldBeBold }) {
    const textArray = text.split(shouldBeBold);
    return (
      <span>
        {textArray.map((item, index) => (
          <>
            <i> {item} </i>
            {index !== textArray.length - 1 && (
              <u><b><i>{shouldBeBold}</i></b></u>
            )}
          </>
        ))}
      </span>
  );
}