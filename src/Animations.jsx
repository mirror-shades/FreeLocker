import TestnetWebpage from "./TestnetWebpage";
import MainnetWebpage from "./MainnetWebpage";
import "./App.css";
//import React, { useState, useEffect } from "react";
import { FormControlLabel, Collapse, Switch, Box, Grid } from "@mui/material";

import React, { useState } from "react";
import { Animated, View, Button } from "react-native";

const Component1 = () => <View style={{ backgroundColor: "red", flex: 1 }} />;

const Component2 = () => <View style={{ backgroundColor: "blue", flex: 1 }} />;

const SwitchComponent = () => {
  const [showComponent1, setShowComponent1] = useState(true);
  const [slideAnim] = useState(new Animated.Value(0));

  const handlePress = () => {
    Animated.timing(slideAnim, {
      toValue: showComponent1 ? -100 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setShowComponent1(!showComponent1);
  };

  return (
    <div>
      <p>hello world</p>
    </div>
  );
};

export default SwitchComponent;
