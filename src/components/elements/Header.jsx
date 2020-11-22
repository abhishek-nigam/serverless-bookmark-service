import Navbar from "react-bootstrap/Navbar";
import { Icon } from "@iconify/react";
import bxBookmarkAlt from "@iconify-icons/bx/bx-bookmark-alt";

function Header() {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand>
        <Icon icon={bxBookmarkAlt} height="1.5rem" width="1.5rem" />
        <span className="ml-1">Bookmark Service</span>
      </Navbar.Brand>
    </Navbar>
  );
}

export default Header;
