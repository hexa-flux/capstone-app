import React from "react";

import NavBar from "../routes/navBar";
import Logo from "../assets/v2-logo-long.svg";

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
        <p>
          <strong>ADDING EVENTS</strong>
        </p>
        <p>
          To add an event, make sure you're signed in with your account first.
          Then go to the "Add Event" page and fill in the details of your event.
          Give it a memorable title, a date, time, location and description.
          When you are ready to add your event, click on the "Add Event" button
          and it will appear on your dashboard.
        </p>{" "}
        <br></br>
        <p>
          <strong>DELETING EVENTS</strong>
        </p>
        <p>
          All events on your dashboard can be easily deleted. Simply click on
          the "Delete" button, inside the box of any event you wish to remove.
        </p>{" "}
        <br></br>
        <p>
          <strong>EDITING EVENTS</strong>
        </p>
        <p>
          Made a mistake? Plans changed? Any event you've saved can be edited at
          any time! Simply click on the "Edit" button in the box of the desired
          event, and change the details in the pop-up form. Click on "Save" to
          save the updated details, or click on "Cancel" to discard your
          changes.
        </p>{" "}
        <br></br>
        <p>
          Tip: be sure to give your events short, but easy to remember titles.
          This will help you to keep track of many events and remember them
          better!
        </p>
      </main>

      <footer>
        <hr className="hr-medium"></hr>
        <div className="footerDiv">
          <p>&copy; 2026 page by hexaflux.</p>
          <img src={Logo} width={120} alt="hexaflux" />
        </div>
      </footer>
    </div>
  );
}
