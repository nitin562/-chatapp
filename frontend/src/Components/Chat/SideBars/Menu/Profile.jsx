import { Avatar } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiLinks, completeUrl } from "../../../../links";
import { CiUser, CiMail } from "react-icons/ci";
import { MdModeEditOutline } from "react-icons/md";
import { BsCardText } from "react-icons/bs";
import ProfileDataShow from "../../../../Utils/ProfileDataShow";

import { get_csrf_token } from "../../../../Utils/Helpers/getCSRF";
import { useGlobal } from "../../../../Utils/Context/Global";
import { updateUser } from "../../../../Redux/slice/user";
import { useFetch } from "../../../../Utils/Helpers/UseFetch";
export default function Profile() {
  const asyncFetch=useFetch()
  const [updatedPic, setupdatedPic] = useState(null);
  const user = useSelector((state) => state.user.user);
  console.log(user);
  const dispatch = useDispatch();
  const toast = useGlobal().toast;
  const profileRef = useRef(null);
  const handleProfilePicClick = () => {
    profileRef.current.click();
  };

  const handlePicSaveAndDisplay = async (e) => {
    if (e.target.files.length <= 0) {
      setupdatedPic(null);
      return;
    }
    const file = e.target.files[0];
    let fileUrl = null;
    let errors = await UpdateValue("profile_pic", file);
    console.log("he", errors);
    if (errors) {
      toast({
        status: "error",
        description: errors["profile_pic"],
        title: "Uploading Issue",
        isClosable: true,
      });
      setupdatedPic(null);
    }
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (!errors) {
        setupdatedPic(e.target.result);
      }
    };

    fileReader.readAsDataURL(file);
  };

  const UpdateValue = async (name, value) => {
    const { error: csrfError, result: csrfToken } = await get_csrf_token();
    const formData = new FormData();
    formData.append(name, value);
    const { error, result } = await asyncFetch(
      "POST",
      apiLinks.profile + `?change=${name}`,
      {},
      formData,
      csrfToken.payload,
      true
    );
    if (error) {
      //global error
      toast({
        description: error,
        status: "error",
        isClosable: true,
        title: "Try Later",
      });
    } else {
      if (result.success) {
        const updatedValue = result.payload.update;
        dispatch(updateUser({ name, value: updatedValue }));
      } else {
        //errors from backend
        return result.error;
      }
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full  w-full ">
      <div className="w-full flex items-center justify-between p-4">
        <span className="text-2xl font-bold text-white">Profile</span>
      </div>
      <div className="flex flex-col gap-4 items-center flex-1 justify-center p-1 scrollbar  ">
        <div
          onClick={handleProfilePicClick}
          className="w-[10rem] h-[10rem] mt-6 border-2 !border-blue-500/70 cursor-pointer rounded-full relative"
        >
          <Avatar
            key={updatedPic || user.demographic.profile_pic}
            size={"full"}
            src={completeUrl(updatedPic || user.demographic.profile_pic)}
          />
          <MdModeEditOutline className="absolute bottom-0 right-6 text-2xl bg-blue-500 rounded-full text-white p-1" />
          <input
          ref={profileRef}
          onChange={handlePicSaveAndDisplay}
          type="file"
          className="hidden"
          accept="image/*"
          name="profile_pic"
        />
        </div>

        <div className="flex flex-col w-full items-center p-2 px-4 gap-7 ">
          <ProfileDataShow
            save={UpdateValue}
            Icon={CiUser}
            fields={[
              {
                name: "First Name",
                value: user.first_name,
                raw_name: "first_name",
              },
              {
                name: "Last Name",
                value: user.last_name,
                raw_name: "last_name",
              },
              { name: "User Name", value: user.username, raw_name: "username" },
            ]}
          />
          <ProfileDataShow
            save={UpdateValue}
            Icon={CiMail}
            fields={[{ name: "Email", value: user.email, raw_name: "email" }]}
          />
          <ProfileDataShow
            save={UpdateValue}
            Icon={BsCardText}
            fields={[
              {
                name: "Status",
                value: user.demographic.description,
                raw_name: "description",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
