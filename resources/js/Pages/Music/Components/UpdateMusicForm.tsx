import ActionMessage from '@/Components/ActionMessage';
import FormSection from '@/Components/FormSection';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import ToggleSwitch from '@/Components/ToggleSwitch';
import useRoute from '@/Hooks/useRoute';
import { Album, Artist, Genre, Music } from '@/types';
import { useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';

interface Props {
  music: Music;
  albums: Album[];
  genres: Genre[];
  artists: Artist[];
}

export default function UpdateMusicForm({
  music,
  albums,
  genres,
  artists,
}: Props) {
  const route = useRoute();
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    music.image_url ?? null,
  );
  const photoRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    _method: 'PUT',
    title: music.title,
    artist_id: music.artist_id || '',
    genre_id: music.genre_id || '',
    album_id: music.album_id || '',
    file_url: null as File | null,
    image_url: null as File | null,
    duration: music.duration,
    is_published: music.is_published,
    is_featured: music.is_featured,
  });

  function updateMusicInfo() {
    form.post(route('tracks.update', music.id), {
      errorBag: 'updateTrack',
      preserveScroll: true,
      onSuccess: () => clearPhotoFileInput(),
    });
  }

  function selectNewPhoto() {
    photoRef.current?.click();
  }

  function updatePhotoPreview() {
    const photo = photoRef.current?.files?.[0];
    if (!photo) return;

    form.setData('image_url', photo);

    const reader = new FileReader();
    reader.onload = e => setPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(photo);
  }

  function clearPhotoFileInput() {
    if (photoRef.current?.value) {
      photoRef.current.value = '';
      form.setData('image_url', null);
    }
  }

  return (
    <FormSection
      onSubmit={updateMusicInfo}
      title="Edit Music Information"
      description="Update the metadata of your uploaded track."
      renderActions={() => (
        <>
          <ActionMessage on={form.recentlySuccessful} className="mr-3">
            Updated.
          </ActionMessage>

          <PrimaryButton
            className={classNames({ 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Save Changes
          </PrimaryButton>
        </>
      )}
    >
      {/* Cover Art */}
      <div className="col-span-6 sm:col-span-4">
        <input
          type="file"
          className="hidden"
          ref={photoRef}
          onChange={updatePhotoPreview}
        />
        <InputLabel htmlFor="photo" value="Music Cover" />

        {photoPreview && (
          <div className="mt-2">
            <span
              className="block rounded-lg w-20 h-20"
              style={{
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundImage: `url('${photoPreview}')`,
              }}
            ></span>
          </div>
        )}

{/* // <!-- Current Profile Photo --> */}
             <div className="mt-2">
             <img
               src={`/storage/${music.image_url}`}
               alt={music.title}
               className="rounded-lg h-20 w-20 object-cover"
             />
           </div>

        <SecondaryButton
          className="mt-2 mr-2"
          type="button"
          onClick={selectNewPhoto}
        >
          Change Cover
        </SecondaryButton>

        <InputError message={form.errors.image_url} className="mt-2" />
      </div>

      {/* Title */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="title" value="Title" />
        <TextInput
          id="title"
          type="text"
          className="mt-1 block w-full"
          value={form.data.title}
          onChange={e => form.setData('title', e.currentTarget.value)}
        />
        <InputError message={form.errors.title} className="mt-2" />
      </div>

      {/* Duration */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="duration" value="Duration (seconds)" />
        <TextInput
          id="duration"
          type="number"
          className="mt-1 block w-full"
          value={form.data.duration}
          onChange={e => form.setData('duration', e.currentTarget.value)}
        />
        <InputError message={form.errors.duration} className="mt-2" />
      </div>

      {/* Artist Select */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="artist_id" value="Artist" />
        <select
          id="artist_id"
          className="mt-1 block w-full border border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-900 rounded-md shadow-sm"
          value={form.data.artist_id}
          onChange={e => form.setData('artist_id', e.currentTarget.value)}
        >
          <option value="">Select an artist</option>
          {artists.map(artist => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
        <InputError message={form.errors.artist_id} className="mt-2" />
      </div>

      {/* Genre Select */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="genre_id" value="Genre" />
        <select
          id="genre_id"
          className="mt-1 block w-full border border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-900 rounded-md shadow-sm"
          value={form.data.genre_id}
          onChange={e => form.setData('genre_id', e.currentTarget.value)}
        >
          <option value="">Select a genre</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <InputError message={form.errors.genre_id} className="mt-2" />
      </div>

      {/* Album Select */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="album_id" value="Album (Optional)" />
        <select
          id="album_id"
          className="mt-1 block w-full border border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-900 rounded-md shadow-sm"
          value={form.data.album_id}
          onChange={e => form.setData('album_id', e.currentTarget.value)}
        >
          <option value="">No album</option>
          {albums.map(album => (
            <option key={album.id} value={album.id}>
              {album.title}
            </option>
          ))}
        </select>
        <InputError message={form.errors.album_id} className="mt-2" />
      </div>

      {/* Music File (optional) */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="file_url" value="Replace Music File (Optional)" />
        <input
          id="file_url"
          type="file"
          className="mt-1 block w-full"
          onChange={e => form.setData('file_url', e.target.files?.[0] ?? null)}
        />
        <InputError message={form.errors.file_url} className="mt-2" />
        {/* <InputLabel htmlFor="file_path" value="Music File (path)" />
<div className="">
    {music.original_filename}
</div> */}
      </div>

      {/* Publish Toggle */}
      {/* <div className="col-span-6 sm:col-span-4">
        <label className="flex items-center mt-4">
          <input
            type="checkbox"
            checked={!!form.data.is_published}
            onChange={e => form.setData('is_published', e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-600">Publish this track</span>
        </label>
        <InputError message={form.errors.is_published} className="mt-2" />
      </div> */}
      <div className="col-span-6 sm:col-span-4">
        <label className="block text-sm font-medium dark:text-gray-200 mb-1">
          Publish this track
        </label>
        <ToggleSwitch
          checked={form.data.is_published}
          onChange={val => form.setData('is_published', val)}
          color="indigo"
        />
      </div>

      {/* Is Featured */}
      <div className="col-span-6 sm:col-span-4">
        <label className="block text-sm font-medium dark:text-gray-200 mb-1">
          Feature this track
        </label>
        <ToggleSwitch
          checked={form.data.is_featured}
          onChange={val => form.setData('is_featured', val)}
          color="yellow"
        />
      </div>
      {/* <div className="col-span-6 sm:col-span-4">
        <label className="flex items-center mt-4">
          <input
            type="checkbox"
            checked={!!form.data.is_featured}
            onChange={e => form.setData('is_featured', e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-600">Mark as Featured</span>
        </label>
        <InputError message={form.errors.is_featured} className="mt-2" />
      </div> */}
    </FormSection>
  );
}
