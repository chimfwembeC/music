import AppLayout from '@/Layouts/AppLayout'
import React from 'react'
import UpdateMusicForm from './Components/UpdateMusicForm'
import SectionBorder from '@/Components/SectionBorder'

export default function Edit({music, albums, genres, artists}) {
  return (
    <AppLayout title='Update Music' renderHeader={() => (
        <div>Update Music</div>
    )}>
 <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        <div>
          <UpdateMusicForm music={music} albums={albums} genres={genres} artists={artists} />

          <SectionBorder />
        </div>
      </div>
    </AppLayout>
  )
}
