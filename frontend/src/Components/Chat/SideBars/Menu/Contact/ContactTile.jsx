import { Avatar } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { completeUrl } from "../../../../../links";

import { useDispatch, useSelector } from "react-redux";
import { selectContact } from "../../../../../Redux/slice/contact";
import { convertRelativeTimes } from "../../../../../Utils/TimeExpressions";
import { useNavigate } from "react-router-dom";
import { getStatusIcon } from "../../../../../Utils/Helpers/getStatusIcon.jsx";
export default function ContactTile({
  index,
  src,
  name,
  time,
  id,
  type,
  last_message = null,
  single,
  externalContact = false,
}) {
  const selected = useSelector((state) => state.contact.selected);
  const key = `${type}${id}`;
  const nav=useNavigate()
  const [status, setstatus] = useState(null); //null, 0 - pending, 1- delivered, 2-seen
  const dispatch = useDispatch();
 
  const handleSelection = () => {
    dispatch(selectContact({id,type,externalContact}))
    nav(`/chat/message/${key}`)
  };
  useEffect(() => {
    if (!last_message) {
      return;
    }
    if(last_message.sender_uname!=localStorage.getItem("u_name")){
      return;
    }
    console.log("last_message changed",last_message);
    const { created:pending, delivered, seen } = last_message;
    const isPending = pending && !delivered && !seen;
    const isDelivered = pending && delivered && !seen;
    const isSeen = pending && delivered && seen;
    console.log(isDelivered,isPending,isSeen)
    if (isPending) {
      setstatus(0);
    } else if (isDelivered) {
      setstatus(1);
    } else if (isSeen) {
      setstatus(2);
    } else {
      setstatus(-1);
    }
  }, [last_message]);
  function* getMessageContent(msg) {
    // sender_uname
    if (!msg) {
      return;
    }
    const myname = localStorage.getItem("u_name");
    if (msg.sender_uname == myname) {
      //icons
      yield getStatusIcon(status);
    } else if (type == "Group") {
      yield <span className="text-gray-400 text-sm">{msg.sender_fname}:</span>;
    }

    yield (
      <p
        className="w-full text-gray-400 text-sm whitespace-nowrap text-ellipsis overflow-hidden "
        title={last_message.data}
      >
        {last_message.data.length > 50
          ? last_message.data.slice(50)
          : last_message.data}
        {/* {data} */}
      </p>
    );
  }
  const msgContent = getMessageContent(last_message);
  return (
    <div
      onClick={handleSelection}
      className={`w-full  flex group items-center gap-1 cursor-pointer hover:bg-blue-300/10 ${
        key == selected ? "!bg-blue-300/20" : ""
      }`}
    >
      <div className="p-2 w-[4rem]  ">
        <Avatar bg={"white"} src={completeUrl(src)} />
      </div>
      <div
        className={`w-[calc(100%-4rem)] py-2 h-full ${
          index == 0 && !single
            ? "border-t-[0.5px]"
            : "border-t-[0.5px] border-b-[0.5px]"
        } !border-blue-300/20 group-hover:!border-0 flex flex-col justify-center ${
          key == selected ? "!border-0" : ""
        } `}
      >
        <div className="flex justify-between items-center gap-2 md:gap-8 ">
          <p className="text-md  text-white overflow-hidden text-nowrap text-ellipsis ">
            {name}
          </p>
          <span className="text-gray-300 text-sm">
            {convertRelativeTimes(time)}
          </span>
        </div>
        {last_message && (
          <div className="flex items-end gap-1 w-full ">
            {msgContent.next().value}

            {msgContent.next().value}

            {msgContent.next().value}
          </div>
        )}
        {!last_message && (
          <div className="flex items-end gap-1 w-full ">
            <span className="text-gray-400 text-sm">Buzy on Chatapp</span>
          </div>
        )}
      </div>
    </div>
  );
}
