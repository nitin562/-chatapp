import React, { useEffect, useRef, useState } from "react";
import { CiEdit, CiSaveUp1 } from "react-icons/ci";
import { Spinner } from "@chakra-ui/react";

export default function ProfileDataShow({ Icon, fields, save }) {
  const [isEditing, setIsEditing] = useState(null);
  const [updatedVal, setupdatedVal] = useState("");
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState({ name: "", err: "" });
  const onClick = (name, value) => {
    if (isEditing) {
      return;
    }
    setupdatedVal(value);
    setIsEditing(name);
  };
  const onChange = (e) => {
    setupdatedVal(e.target.value);
  };
  const HandleSave = async (name, prevValue, newValue) => {
    setloading(true);
    seterror({ name: "", error: "" });
    if (prevValue != newValue) {
      let errors = await save(name, newValue);
      if (errors) {
        seterror({ name, err: errors[name] });
        setTimeout(() => {
          seterror({ name: "", error: "" });
        }, [2000]);
      }
    }
    setloading(false);
    setIsEditing(false);
  };
  return (
    <div className="flex flex-col w-full justify-center gap-4 py-2 relative border-t-[1px] border-b-[1px] border-white/20 p-1 px-4   cursor-pointer">
      <Icon className="absolute -top-3 z-10 text-xl bg-gray-950/70 right-4 text-white" />
      {fields.map((field) => {
        return (
          <div
            onClick={() => onClick(field.name, field.value)}
            key={field.name}
            className="flex-1 flex justify-between items-center *:text-white group hover:brightness-125 hover:bg-slate-800/10 "
          >
            <div className="flex flex-col w-[90%] gap-1 ">
              <span className="text-[0.8rem] text-blue-300/50">
                {field.name}
              </span>
              {isEditing != field.name && (
                <p
                  title={field.value}
                  className="break-after-words  text-wrap text-ellipsis w-full overflow-hidden"
                >
                  {field.value || "-"}
                </p>
              )}
              {isEditing == field.name &&
                (field.name == "Status" ? (
                  <textarea autoFocus value={updatedVal} onChange={onChange} />
                ) : (
                  <input autoFocus value={updatedVal} onChange={onChange} />
                ))}
              {error.name == field.raw_name && (
                <span className="text-red-500">{error.err}</span>
              )}
            </div>
            <div className="w-fit flex items-center justify-end">
              {isEditing != field.name && (
                <CiEdit className=" text-2xl group-hover:text-blue-300/50 " />
              )}
              {isEditing == field.name && !loading && (
                <CiSaveUp1
                  onClick={() => {
                    HandleSave(field.raw_name, field.value, updatedVal);
                  }}
                  className="text-2xl hover:text-red-400"
                />
              )}
              {isEditing == field.name && loading && <Spinner />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
