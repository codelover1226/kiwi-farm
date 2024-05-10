// Body.js
import React from 'react'
import { PortableText } from '@portabletext/react';
import { PortableTextInput } from 'sanity';
export const Body = blocks => {
  return (
    <div>
        <PortableText value={blocks} />
        {/* <PortableTextInput  /> */}
    </div>
    )
}
