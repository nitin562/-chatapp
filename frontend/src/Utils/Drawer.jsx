import React from "react";

export default function Drawer({ n, pos, widths }) {
    const arr=new Array(n).fill(0)
    console.log(arr,widths,pos)
  return (
    <div className="flex items-center gap-6">
      {arr.map((e, idx) => {
        return (
          <div
            className={`transition-all duration-300 rounded-full border-[1px] border-white`}
            key={idx}
            style={{
              backgroundColor: `${pos == idx+1 ? "#fff" : "transparent"}`,
              width: `${widths}px`,
              height: `${widths}px`,
            }}
          ></div>
        );
      })}
    </div>
  );
}
