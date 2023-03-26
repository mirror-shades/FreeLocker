import TestnetWebpage from "./TestnetWebpage";
import MainnetWebpage from "./MainnetWebpage";
import "./App.css";
import React, { useState, useEffect } from "react";
import { FormControlLabel, Collapse, Switch } from "@mui/material";

const Input = () => {
  const [checked, setChecked] = React.useState(false);
  const [net, setNet] = React.useState("Test");

  const handleChange = () => {
    if (checked == false) {
      setNet("Main");
    }
    if (checked == true) {
      setNet("Test");
    }
    setChecked((prev) => !prev);
  };
  var mainNet = <MainnetWebpage />;
  var testNet = <TestnetWebpage />;
  return (
    <div className="mui">
      <FormControlLabel
        control={<Switch checked={checked} onChange={handleChange} />}
        label={net}
        sx={{ width: 300, color: "success.main" }}
      />
      <div className="above">
        <Collapse
          orientation="horizontal"
          in={!checked}
          appear={0}
          enter={1000}
          exit={0}
        >
          {testNet}
        </Collapse>
      </div>
      <div className="below">
        <Collapse
          orientation="horizontal"
          in={checked}
          appear={0}
          enter={1000}
          exit={0}
        >
          {mainNet}
        </Collapse>
      </div>
    </div>
  );
};

export default Input;
