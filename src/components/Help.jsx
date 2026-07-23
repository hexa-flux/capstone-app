import React from "react";

import NavBar from "../routes/navBar";

export default function Help() {
  return (
    <div>
      <header>
        <NavBar />
      </header>
      <hr className="hr-large"></hr>
      <h1>Help</h1>
      <hr className="hr-medium"></hr>

      <footer>
        <hr className="hr-medium"></hr>
        <p>&copy; 2026 page by hexaflux.</p>
      </footer>
    </div>
  );
}
