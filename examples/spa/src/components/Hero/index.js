import React from 'react';
import { injectContent } from '@trioxis/react-cafe-cms';

import Section from '../Section';
import logo from './logo.svg';

function Hero(props){
  return <Section>
    <img src={logo} alt="logo" />
    <h1>{props.content['site-title']}</h1>
    <h3>{props.content['hero-text']}</h3>
  </Section>
}

export default injectContent(
  'site-title',
  'hero-text'
)(Hero);