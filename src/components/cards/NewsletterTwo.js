import React from 'react';

function Newsletter() {
  return (
    <div className="ninjadash-newsletter-theme-2">
      <img src={require('../../static/img/icon/message.svg').default} alt="" />
      <figcaption>
        <h2>Subscribe To Our Newsletter</h2>
        <p>Sed ut perspiciatis unde omnis iste natussit</p>
      </figcaption>
    </div>
  );
}

export default Newsletter;
