import React, { useState } from "react";

export default function IconBadge({ name }) {
  const [count, setCount] = useState(0);
  return (
    <>
      {count != 0 && (
        <div className="flex items-center absolute w-[1.8rem] aspect-square -top-4 -right-3 justify-center p-1 bg-green-400 rounded-full">
          <p className="text-sm font-bold text-fit  text-black ">
            {count>100?"99+":count}
          </p>
        </div>
      )}
    </>
  );
}
