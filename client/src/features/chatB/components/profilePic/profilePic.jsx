import React from 'react';

import './style.scss';

export default function ProfilePic({ username }) {
  function getInitials(name) {
    if (typeof name !== 'string') {
      return '';
    }
    const words = name.split(' ');
    const firstInitial = words[0] ? words[0][0] : '';
    const secondInitial = words[1] ? words[1][0] : '';
    return `${firstInitial}${secondInitial}`;
  }

  return (
    <div className="profilePicture">
      <span>{getInitials(username)}</span>
    </div>
  );
}
