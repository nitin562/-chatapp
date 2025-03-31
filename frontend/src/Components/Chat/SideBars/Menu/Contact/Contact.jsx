import React, { useEffect, useState } from "react";
import { RiChatNewFill } from "react-icons/ri";
import { HiDotsVertical } from "react-icons/hi";
import {
  InputGroup,
  Input,
  InputLeftElement,
  border,
  Spinner,
} from "@chakra-ui/react";
import { MdOutlineSearch, MdArrowBack } from "react-icons/md";
import { useSelector } from "react-redux";
import ContactTile from "./ContactTile";
import { convertRelativeTimes } from "../../../../../Utils/TimeExpressions";
import { apiLinks } from "../../../../../links";
import { useFetch } from "../../../../../Utils/Helpers/UseFetch";

export default function Contact() {
  const asyncFetch = useFetch();
  const [searchVal, setSearchVal] = useState("");
  const contacts = useSelector((state) => state.contact.all);
  const messages = useSelector((state) => state.messages.messages);
  const [searchResult, setsearchResult] = useState({});
  const [searchLoading, setsearchLoading] = useState(false);
  console.log(contacts);
  const searchExternally = async (value) => {
    const url = apiLinks.searchByChat + "?value=" + value;
    const { error, result } = await asyncFetch(
      "GET",
      url,
      {},
      null,
      null,
      true
    );
    console.log(error, result);
    if (result.success == true) {
      setTimeout(() => {
        setsearchResult((prev) => {
          const obj = prev;
          obj.externalContacts = {
            loading: false,
            extContacts: result.payload,
          };
          console.log(obj);
          return obj;
        });
      }, 0);
    }
  };
  const search = async (raw_value) => {
    if (!raw_value || raw_value.length < 3) {
      return;
    }
    setsearchLoading(true);
    let value = raw_value.toLocaleLowerCase();
    let searchedResult = {
      filteredContacts: {},
      filteredMessagesContact: {},
      externalContacts: {
        loading: false,
      },
    };
    const keys = Object.keys(contacts);
    //search in exisiting contacts
    const filteredContacts = {};
    keys.forEach((key) => {
      const contact = contacts[key];
      console.log(contact);
      let name = contact.name.toLocaleLowerCase();
      if (name.includes(value)) {
        filteredContacts[key] = contact;
      }
    });
    console.log("filteredContacts", filteredContacts, keys);
    //search in messages
    const filteredMessagesContact = {};
    Object.keys(messages).forEach((mes_key) => {
      const message_list = messages[mes_key];
      message_list.forEach((message) => {
        const data = message.data.toLocaleLowerCase();
        if (data.includes(value)) {
          const relativeContact = contacts[mes_key];
          const index = data.indexOf(value);
          const trimmedMessage = { ...message };
          if (index != 0 && index > 15) {
            const trimmedData = "..." + data.slice(index, index + 10) + "...";
            trimmedMessage.data = trimmedData;
          }
          if (filteredMessagesContact[mes_key]) {
            filteredMessagesContact[mes_key].filter_messages.push(
              trimmedMessage
            );
          } else {
            filteredMessagesContact[mes_key] = {
              contact: relativeContact,
              filter_messages: [trimmedMessage],
            };
          }
        }
      });
    });
    searchedResult = { filteredContacts, filteredMessagesContact };

    if (Object.keys(filteredContacts).length == 0) {
      searchedResult["externalContacts"] = {
        loading: true,
      };
      await searchExternally(raw_value);
    }
    setsearchResult(searchedResult);
    setsearchLoading(false);
  };
  const handleSearchInputChange = (e) => {
    setSearchVal(e.target.value);
    search(e.target.value);
  };
  const getContactsFromSearchResult = (result) => {
    const keys = Object.keys(result);
    if (keys.length == 0) {
      return <span className="text-gray-400 m-auto">No Contacts Found</span>;
    }
    const single=keys.length==1
    const output = keys.map((key, idx) => {
      const contact = result[key];

      const last_message =
        messages[key].length == 0 ? null : messages[key].at(-1);
      return (
        <ContactTile
          index={contacts.length - idx - 1}
          key={key}
          id={contact.id}
          type={contact.type}
          src={contact.img}
          time={contact.updated}
          name={contact.name}
          last_message={last_message}
          single={single}
        />
      );
    });
    return output;
  };
  const getMessagesFromSearchResult = (result) => {
    const keys = Object.keys(result);
    if (keys.length == 0) {
      return <span className="text-gray-400 m-auto">No Matches Found</span>;
    }
    const output = keys.map((key) => {
      const contactObj = result[key];
      const messages = contactObj.filter_messages; //array
      const contact = contactObj.contact; //object
      return (
        <div className="flex flex-col w-full p-2 gap-4" key={contact.id}>
          {messages.map((msg) => {
            const time = convertRelativeTimes(msg.created);

            return (
              <div
                className="w-full hover:bg-blue-300/10 p-2 cursor-pointer border-b-[1px] !border-gray-400/30"
                key={msg.id}
              >
                <div className="flex justify-between items-center *:text-gray-300 text-lg">
                  <span className="font-semibold">{contact.name}</span>
                  <span className="!text-sm">{time}</span>
                </div>
                <p className="text-gray-400 p-1 text-sm">{msg.data}</p>
              </div>
            );
          })}
        </div>
      );
    });
    return output;
  };
  const getExternalContactsFromResult = (result) => {
    if (result.length == 0) {
      return <span className="text-gray-400 m-auto">No Matches Found</span>;
    }
    const len=result.length;
    return result.map((contact, idx) => {
      return (
        <ContactTile

          id={contact.user_id}
          name={contact.name}
          src={contact.img}
          index={idx}
          time={contact.created}
          key={"ext_" + contact.user_id}
          type={contact.type}
          single={len==1}
          externalContact={true}
        />
      );
    });
  };

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="w-full flex items-center justify-between p-4">
        <span className="text-2xl font-bold text-white">Chats</span>
        <div className="flex items-center gap-4 md:gap-9">
          <RiChatNewFill className=" text-gray-300 text-2xl" />
          <HiDotsVertical className="text-gray-300 text-xl" />
        </div>
      </div>
      <div className="p-2 px-4">
        <InputGroup backgroundColor={"#1d293d"} borderRadius={"2rem"}>
          <InputLeftElement>
            {!searchVal && (
              <MdOutlineSearch className="text-white rotateThroughRight text-xl" />
            )}
            {searchVal && (
              <MdArrowBack
                onClick={() => setSearchVal("")}
                className="text-xl cursor-pointer rotateThroughLeft text-emerald-300/80"
              />
            )}
          </InputLeftElement>
          <Input
            value={searchVal}
            onChange={handleSearchInputChange}
            placeholder="Search"
            color={"whiteAlpha.700"}
            border="none"
            focusBorderColor="transparent"
          />
        </InputGroup>
      </div>
      {searchVal.length < 3 && (
        <div className="flex flex-col-reverse p-2">
          {getContactsFromSearchResult(contacts)}
        </div>
      )}
      {searchVal.length >= 3 && (
        <div className="p-2">
          {!searchLoading && (
            <div className="flex flex-col gap-3">
              {Object.keys(searchResult.filteredContacts).length != 0 && (
                <div className="flex flex-col-reverse py-2 rounded-md !bg-[#2bff951c]  justify-center items-center">
                  {getContactsFromSearchResult(searchResult.filteredContacts)}
                  <span className="text-emerald-300 my-2">FROM YOUR CHATS</span>
                </div>
              )}

              {Object.keys(searchResult.filteredMessagesContact).length !=
                0 && (
                <div className="flex flex-col-reverse rounded-md py-2 !bg-[#2bff951c] justify-center items-center">
                  {getMessagesFromSearchResult(
                    searchResult.filteredMessagesContact
                  )}
                  <span className="text-emerald-300 my-2">
                    FROM YOUR MESSAGES
                  </span>
                </div>
              )}
              {searchResult.externalContacts && (
                <div className="flex flex-col-reverse rounded-md !bg-[#2bff951c] py-2 justify-center items-center">
                  {/* {getMessagesFromSearchResult(
                  searchResult.filteredMessagesContact
                )} */}
                  {searchResult.externalContacts.loading && (
                    <Spinner color="cyan" my="10" />
                  )}
                  {!searchResult.externalContacts.loading &&
                    getExternalContactsFromResult(
                      searchResult.externalContacts.extContacts
                    )}
                  <span className="text-emerald-300 my-2">
                    NOT IN YOUR CHATS
                  </span>
                </div>
              )}
          
            </div>
          )}
          {searchLoading && <Spinner color="cyan" my={"10"} />}
        </div>
      )}
    </div>
  );
}
