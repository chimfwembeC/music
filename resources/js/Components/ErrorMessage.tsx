import React from 'react'

export function ErrorMessage({ message }: { message: string }) {
    return <p className="text-red-500 text-sm">{message}</p>;
  }
  