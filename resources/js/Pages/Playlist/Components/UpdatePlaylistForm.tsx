import React, { useRef, useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import useRoute from '@/Hooks/useRoute';
import FormSection from '@/Components/FormSection';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Checkbox from '@/Components/Checkbox';
import { Music, Playlist } from '@/types';

interface Props {
  playlist: Playlist;
  tracks: Music[];
}

export default function UpdatePlaylistForm({ playlist, tracks }: Props) {
  const form = useForm({
    _method: 'PUT',
    name: playlist.name || '',
    description: playlist.description || '',
    is_public: playlist.is_public,
    image_url: null as File | null,
    tracks: playlist.tracks?.map(track => track.id) || [],
  });
  const route = useRoute();
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    playlist.image_url ? `/storage/${playlist.image_url}` : null
  );
  const photoRef = useRef<HTMLInputElement>(null);
  const [selectedTracks, setSelectedTracks] = useState<number[]>(
    playlist.tracks?.map(track => track.id) || []
  );

  function updatePlaylist() {
    form.post(route('playlists.update', playlist.id), {
      errorBag: 'updatePlaylist',
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

  function toggleTrackSelection(trackId: number) {
    const updatedSelection = selectedTracks.includes(trackId)
      ? selectedTracks.filter(id => id !== trackId)
      : [...selectedTracks, trackId];
    
    setSelectedTracks(updatedSelection);
    form.setData('tracks', updatedSelection);
  }

  return (
    <FormSection
      title="Edit Playlist"
      description="Update your playlist information and track selection."
      onSubmit={updatePlaylist}
      renderActions={() => (
        <>
          <SecondaryButton
            onClick={() => window.history.back()}
            className="mr-2"
          >
            Cancel
          </SecondaryButton>

          <PrimaryButton
            className={form.processing ? 'opacity-25' : ''}
            disabled={form.processing}
          >
            Save
          </PrimaryButton>
        </>
      )}
    >
      {/* Playlist Name */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="name" value="Name" />
        <TextInput
          id="name"
          type="text"
          className="mt-1 block w-full"
          value={form.data.name}
          onChange={e => form.setData('name', e.currentTarget.value)}
          autoComplete="name"
        />
        <InputError message={form.errors.name} className="mt-2" />
      </div>

      {/* Playlist Description */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="description" value="Description" />
        <textarea
          id="description"
          className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
          value={form.data.description}
          onChange={e => form.setData('description', e.currentTarget.value)}
          rows={3}
        />
        <InputError message={form.errors.description} className="mt-2" />
      </div>

      {/* Playlist Visibility */}
      <div className="col-span-6 sm:col-span-4">
        <div className="flex items-center">
          <Checkbox
            id="is_public"
            checked={form.data.is_public}
            onChange={e => form.setData('is_public', e.currentTarget.checked)}
          />
          <InputLabel htmlFor="is_public" value="Make this playlist public" className="ml-2" />
        </div>
        <InputError message={form.errors.is_public} className="mt-2" />
      </div>

      {/* Playlist Cover Image */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="photo" value="Cover Image" />

        {/* Current Profile Photo */}
        <div className="mt-2">
          <div className="mt-2 w-24 h-24 rounded-md overflow-hidden bg-gray-100">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Playlist cover preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <span className="text-gray-400 dark:text-gray-500">No image</span>
              </div>
            )}
          </div>
        </div>

        <SecondaryButton
          className="mt-2 mr-2"
          type="button"
          onClick={selectNewPhoto}
        >
          Select A New Photo
        </SecondaryButton>

        <input
          type="file"
          className="hidden"
          ref={photoRef}
          onChange={updatePhotoPreview}
        />

        <InputError message={form.errors.image_url} className="mt-2" />
      </div>

      {/* Track Selection */}
      <div className="col-span-6">
        <InputLabel value="Select Tracks" />
        <div className="mt-2 max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-md p-2">
          {tracks.length > 0 ? (
            tracks.map(track => (
              <div key={track.id} className="flex items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <Checkbox
                  id={`track-${track.id}`}
                  checked={selectedTracks.includes(track.id)}
                  onChange={() => toggleTrackSelection(track.id)}
                />
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{track.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {track.artist?.name} • {track.genre?.name}
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-gray-500 dark:text-gray-400">
              No tracks available
            </div>
          )}
        </div>
        <InputError message={form.errors.tracks} className="mt-2" />
      </div>
    </FormSection>
  );
}
