import WithLayout from '@/Components/WithLayout'
import GuestLayout from '@/Layouts/GuestLayout'
import { Link } from '@inertiajs/react'
import { Download, DownloadCloud } from 'lucide-react'
import React from 'react'

export default function Show({ album }) {
    return (
        <WithLayout title={'albums'}>
            <div className="h-full w-full px-6 mt-8">

                <div className="">
                    <img className='w-10 h-10 border border-gray-300 dark:border-gray-600' src={album.image_url} alt={album.title} />
                    {album.title}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">

                    <div className="col-span col-span-2">
                        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-lg p-4">
                            <div className="text-2xl">Music</div>
                            <div className="border border-t -mx-4 my-4 border-gray-400 dark:border-gray-600 rounded-lg" />
                            {album.music?.length > 0 ? (
                                <>
                                    {
                                        album?.music.map((music, index) => (
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

                                                {album.music.length > index + 1 && (
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
                        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-lg p-4">

                            <div className="text-2xl">Artist Details</div>
                            <div className="border border-t -mx-4 my-4 border-gray-300 dark:border-gray-600 rounded-lg" />

                            <img className='h-28 w-28 rounded-lg' src={album.artist?.image_url} alt={album.artist?.title} />
                            <div className="border border-t -mx-4 my-4 border-gray-300 dark:border-gray-600" />
                            <p className='text-2xl'>{album.artist?.name}</p>
                            <p className='text-sm'>Bio: {album.artist?.bio}</p>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-lg p-4 mt-4">

                            <div className="text-2xl">Genre Details</div>
                            <div className="border border-t -mx-4 my-4 border-gray-300 dark:border-gray-600 rounded-lg" />
                            <Link href={`/genres/${album.genre?.id}`}>
                                <span className='text-2xl hover:underline'>{album.genre?.name}</span>
                            </Link>
                            <p className='text-sm'>{album.genre?.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </WithLayout>
    )
}
