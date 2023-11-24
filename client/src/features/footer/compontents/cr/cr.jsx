import React from 'react'

export default function Cr() {
    const currentYear = new Date().getFullYear();
  return (
    <strong>{ currentYear }</strong>
  )
}
