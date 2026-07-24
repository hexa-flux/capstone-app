import React from "react";

import NavBar from "../routes/navBar";

export default function Help() {
  return (
    <div>
      <header>
        <NavBar />
      </header>

      <main>
        <hr className="hr-large"></hr>
        <h1>Help</h1>
        <hr className="hr-medium"></hr>
        <h2>How to use the event app</h2>
      </main>

      <footer>
        <hr className="hr-medium"></hr>
        <p>&copy; 2026 page by hexaflux.</p>
      </footer>
    </div>
  );
}
