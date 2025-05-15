import GuestLayout from '@/Layouts/GuestLayout'
import { Link } from '@inertiajs/react'
import { Download, DownloadCloud } from 'lucide-react'
import React from 'react'

export default function Show({ artist }) {
    return (
        <GuestLayout title={'artist detials'}>
            <div className='h-full w-full px-6 mt-8'>

                <div className="grid grid-cols-3 gap-4">

                    <div className="col-span col-span-2">
                        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-lg p-4 mt-4">
                            <div className="text-2xl">Music</div>
                            <div className="border border-t -mx-4 my-4 border-gray-400 dark:border-gray-600 rounded-lg" />
                            {artist?.music.length > 0 ? (
                                <>
                                    {
                                        artist?.music.map((music, index) => (
                                            <div className="" key={music.id}>
                                                <div className="flex justify-between items-center gap-2 mt-1">
                                                    <div className="flex justify-start items-center gap-2 mt-1">
                                                        <img className='w-10 h-10 border border-gray-300 dark:border-gray-600' src={music.image_url} alt={music.title} />

                                                        <Link href={`/music/${music.id}`}>
                                                            <span className="">
                                                                <div className="hover:underline">
                                                                    {music.title}
                                                                </div>

                                                                <div className="flex gap-2">
                                                                    <div className="bg-gray-200 dark:bg-gray-600 text-xs px-2 rounded-lg">
                                                                        <span>Downloads</span>
                                                                        <span className='border-r border-gray-300 dark:border-gray-500 mx-1'></span>
                                                                        {music?.download_counts}
                                                                    </div>
                                                                </div>
                                                            </span>
                                                        </Link>
                                                    </div>

                                                    <div className="p-2 bg-gray-400 dark:bg-gray-600 rounded-lg cursor-pointer">
                                                        <Download className='text-gray-200 dark:text-white' size={20} />
                                                    </div>
                                                </div>

                                                {artist.music.length > index + 1 && (
                                                    <div className="border border-t -mx-4 my-4 border-gray-300 dark:border-gray-600 rounded-lg" />
                                                )}
                                            </div>
                                        ))
                                    }
                                </>
                            ) : (
                                <div className="">No music found</div>
                            )}

                            <div className="border border-t -mx-4 my-4 border-gray-300 dark:border-gray-600 rounded-lg" />

                            <div className="mt-4">
                                <div className="flex justify-end">
                                    <div className="flex gap-2 p-2 text-white dark:text-gray-200 bg-gray-400 dark:bg-gray-600 rounded-lg cursor-pointer">
                                        <span>Download Album</span>  <DownloadCloud size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span col-span-1">
                        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-lg p-4 mt-4">
                            <div className="text-2xl">Albums</div>
                            <div className="border border-t -mx-4 my-4 border-gray-400 dark:border-gray-600 rounded-lg" />
                            {artist?.albums.length > 0 ? (
                                <div className="">
                                    {
                                        artist?.albums.map((album, index) => (
                                            <div className="" key={album.id}>
                                                <div className="flex justify-start items-center gap-2 mt-1">
                                                    <img className='w-10 h-10 border border-gray-400 dark:border-gray-600' src={album.image_url} alt={album.title} />

                                                    <div className="">
                                                        <Link href={`/albums/${album.id}`}>
                                                            <span className="hover:underline">
                                                                {album.title}
                                                            </span>
                                                        </Link>
                                                        <div className="flex gap-2">
                                                            <div className="bg-gray-200 dark:bg-gray-600 text-xs px-2 rounded-lg">
                                                                <span>Downloads</span>
                                                                <span className='border-r border-gray-300 dark:border-gray-500 mx-1'></span>
                                                                {album?.download_counts}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {artist.albums.length > index + 1 && (
                                                        <div className="border border-t -mx-4 my-4 border-gray-300 dark:border-gray-600 rounded-lg" />
                                                    )}
                                                </div>

                                                {artist.albums.length > index + 1 && (
                                                    <div className="border border-t -mx-4 my-4 border-gray-300 dark:border-gray-600 rounded-lg" />
                                                )}

                                            </div>
                                        ))
                                    }

                                </div>

                            ) : (
                                <div className="">No album found</div>
                            )}
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-lg p-4 mt-4">

                            <div className="text-2xl">Artist Details</div>
                            <div className="border border-t -mx-4 my-4 border-gray-300 dark:border-gray-600 rounded-lg" />

                            <img className='h-28 w-28 bg-gray-200 dark:bg-gray-600 border border-gray-400 dark:border-gray-500 rounded-lg' src={artist.image_url} alt={artist.title} />
                            <div className="border border-t -mx-4 my-4 border-gray-300 dark:border-gray-600" />
                            <p className='text-2xl'>{artist.name}</p>
                            <p className='text-sm'>Bio: {artist.bio}</p>
                            {/* <p>Artist name: {artist.name}</p> */}
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    )
}
