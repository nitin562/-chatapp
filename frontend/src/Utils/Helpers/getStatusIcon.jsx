import { BiCheck } from "react-icons/bi";
import { BiCheckDouble } from "react-icons/bi";
import { MdErrorOutline } from "react-icons/md";
export const getStatusIcon = (status) => {
  if (status !== null) {
    if (status == 0) {
      return <BiCheck className="text-gray-400" title="Pending" />;
    } else if (status == 1) {
      return <BiCheckDouble className="text-gray-400" title="Delivered" />;
    } else if (status == 2) {
      return <BiCheckDouble className="text-emerald-300" title="seen" />;
    } else {
      return <MdErrorOutline className="text-red-500" title="Not Sent" />;
    }
  }
};
