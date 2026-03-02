import { mdiFolderOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { MdOutlineDashboard } from "react-icons/md";
import "../Style/SideNavPar.css";
import { MdDeleteOutline } from "react-icons/md";

export default function SideNavPar({ pageLink, page }) {
  return (
    <>
      <div className="side-nav-parent">
        <div
          style={page == "Dashboard" ? { backgroundColor: "#293B5F" } : {}}
          className="dash-board"
          onClick={() => {
            pageLink("Dashboard");
          }}
        >
          <MdOutlineDashboard size={22} />
          <p>Dashboard</p>
        </div>

        <div
          style={page == "My Folders" ? { backgroundColor: "#293B5F" } : {}}
          className="my-folder"
          onClick={() => {
            pageLink("My Folders");
          }}
        >
          <Icon path={mdiFolderOutline} size={1} />
          <p>My Folders</p>
        </div>

        <div
          style={page == "Trash" ? { backgroundColor: "#293B5F" } : {}}
          className="trash"
          onClick={() => {
            pageLink("Trash");
          }}
        >
          <MdDeleteOutline size={26} />
          <p>Trash</p>
        </div>
      </div>
    </>
  );
}
