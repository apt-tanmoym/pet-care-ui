import React from "react";
import styles from "./styles.module.scss";
import GetStarted from "../GetStarted";

const ComponentsContainer = () => {
let ComponentToRender = <GetStarted/>;
  return <div className={styles.container}>   
    {ComponentToRender}
    </div>;
};

export default ComponentsContainer;
