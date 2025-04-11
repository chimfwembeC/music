import ActionMessage from '@/Components/ActionMessage';
import FormSection from '@/Components/FormSection';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import ToggleSwitch from '@/Components/ToggleSwitch';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import { Album, Artist, Genre } from '@/types';
import { useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';

interface Music {
  id: number;
  title: string;
  slug: string;
  artist_id: number;
  genre_id: number;
  album_id?: number | null;
  file_url: string;
  original_filename?: string | null;
  image_url?: string | null;
  download_counts: number;
  duration: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;

  // Optional related models (if eager-loaded from backend)
  artist?: Artist;
  genre?: Genre;
  album?: Album;
}

interface Props {
  //   music: Music;
  albums: Album[];
  genres: Genre[];
  artists: Artist[];
}

export default function AddMusicForm({ albums, genres, artists }: Props) {
  const page = useTypedPage();
  const form = useForm({
    _method: 'POST',
    title: '',
    // slug: '',
    artist_id: '',
    genre_id: '',
    album_id: '',
    file_url: null as File | null,
    image_url: null as File | null,
    duration: '',
    is_published: false,
    is_featured: false,
  });
  const route = useRoute();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  function updateProfileInformation() {
    form.post(route('tracks.store'), {
      errorBag: 'createTrack',
      preserveScroll: true,
      onSuccess: () => clearPhotoFileInput(),
    });
  }

  function selectNewPhoto() {
    photoRef.current?.click();
  }

  function updatePhotoPreview() {
    const photo = photoRef.current?.files?.[0];

    if (!photo) {
      return;
    }

    form.setData('image_url', photo);

    const reader = new FileReader();

    reader.onload = e => {
      setPhotoPreview(e.target?.result as string);
    };

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
      onSubmit={updateProfileInformation}
      title={'Add Music Information'}
      description={`Add your account's profile information and email address.`}
      renderActions={() => (
        <>
          <ActionMessage on={form.recentlySuccessful} className="mr-3">
            Saved.
          </ActionMessage>

          <PrimaryButton
            className={classNames({ 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Save
          </PrimaryButton>
        </>
      )}
    >
      {/* <!-- Profile Photo --> */}
      <div className="col-span-6 sm:col-span-4">
        {/* <!-- Profile Photo File Input --> */}
        <input
          type="file"
          className="hidden"
          ref={photoRef}
          onChange={updatePhotoPreview}
        />

        <InputLabel htmlFor="photo" value="Music Cover" />

        {photoPreview ? (
          // <!-- New Profile Photo Preview -->
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
        ) : null}

        <SecondaryButton
          className="mt-2 mr-2"
          type="button"
          onClick={selectNewPhoto}
        >
          Select Music Cover
        </SecondaryButton>

        <InputError message={form.errors.image_url} className="mt-2" />
      </div>

      {/* <!-- Title --> */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="title" value="Title" />
        <TextInput
          id="title"
          type="text"
          className="mt-1 block w-full"
          value={form.data.title}
          onChange={e => form.setData('title', e.currentTarget.value)}
          autoComplete="title"
        />
        <InputError message={form.errors.title} className="mt-2" />
      </div>

      {/* <!-- Duration --> */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="duration" value="Duration" />
        <TextInput
          id="duration"
          type="number"
          className="mt-1 block w-full"
          value={form.data.duration}
          onChange={e => form.setData('duration', e.currentTarget.value)}
        />
        <InputError message={form.errors.duration} className="mt-2" />
      </div>

      {/* Artist */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="artist_id" value="Artist" />
        <select
          id="artist_id"
          className="mt-1 block w-full border  border-gray-300 dark:border-gray-700 dark:text-gray-400  dark:bg-gray-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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

      {/* Genre */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="genre_id" value="Genre" />
        <select
          id="genre_id"
          className="mt-1 block w-full border  border-gray-300 dark:border-gray-700 dark:text-gray-400  dark:bg-gray-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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

      {/* Album (optional) */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="album_id" value="Album (Optional)" />
        <select
          id="album_id"
          className="mt-1 block w-full border border-gray-300 dark:border-gray-700 dark:text-gray-400  dark:bg-gray-900 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          value={form.data.album_id || ''}
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

      {/* Music File Upload */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="file_url" value="Music File" />
        <input
          id="file_url"
          type="file"
          className="mt-1 block w-full"
          onChange={e => form.setData('file_url', e.target.files?.[0] ?? null)}
        />
        <InputError message={form.errors.file_url} className="mt-2" />
      </div>

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
    </FormSection>
  );
}
