import React from 'react';

export const themes = {
    light: {
      foreground: 'ThemeLightFG',
      background: 'ThemeLightBG',
      btnFG: 'ThemeLightBtnFG',
      btnBG: 'ThemeLightBtnBG',
      container: 'ThemeLightBox',
      fill: 'ThemeLightFill',
      stack: 'ThemeLightStack',
      nstack: 'ThemeLightNstack',      
      navb: 'ThemeLightNavb',
      navicon: 'ThemeLightNavIcon',
      navt: 'ThemeLightNavt',      
      glow: 'ThemeLightglow',
      zone: 'ThemeLightZone',
      panel1: 'ThemeLightPanel1',      
      panel2: 'ThemeLightPanel2',
      card: 'ThemeLightCard',
      cardbox: 'ThemeLightCardBox',
      selectSelf: 'ThemeLightSelects',
      selectChd: 'ThemeLightSelectc',
      activefill: 'ThemeLightActf',
      activeSelf: 'ThemeLightActs',
      chdbtn: 'ThemeLightChdBtn',
    },
    dark: {
      foreground: 'ThemeDarkFG',
      background: 'ThemeDarkBG',
      btnFG: 'ThemeDarkBtnFG',
      btnBG: 'ThemeDarkBtnBG',
      container: 'ThemeDarkBox',      
      fill: 'ThemeDarkFill',
      stack: 'ThemeDarkStack',
      nstack: 'ThemeDarkNstack',
      navb: 'ThemeDarkNavb',
      navicon: 'ThemeDarkNavIcon',
      navt: 'ThemeDarkNavt',
      glow: 'ThemeDarkglow',
      zone: 'ThemeDarkZone',
      panel1: 'ThemeDarkPanel1',      
      panel2: 'ThemeDarkPanel2',      
      card: 'ThemeDarkCard',
      cardbox: 'ThemeDarkCardBox',
      selectSelf: 'ThemeDarkSelects',
      selectChd: 'ThemeDarkSelectc',
      activefill: 'ThemeDarkActf',
      activeSelf: 'ThemeDarkActs',
      chdbtn: 'ThemeDarkChdBtn',
    },
  };

  const ThemeContext = React.createContext(
    themes.dark // default value
  );

export default ThemeContext;