import React from 'react'
import AppLayout from '@/Layouts/AppLayout'
import { Artist } from '@/types'
import UpdateArtistForm from './Components/UpdateArtistForm'

export default function Edit({artist}: Artist) {
  return (
    <AppLayout
    title='Update Artist'
    renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
        Artist
        </h2>
    )}>
      <div className="max-w-5xl h-screen m-auto mt-4">
        <UpdateArtistForm artist={artist} />
      </div>
    </AppLayout>
  )
}
