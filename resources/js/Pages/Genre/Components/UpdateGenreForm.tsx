import ActionMessage from '@/Components/ActionMessage';
import FormSection from '@/Components/FormSection';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import ToggleSwitch from '@/Components/ToggleSwitch';
import useRoute from '@/Hooks/useRoute';
import { Album, Artist, Genre } from '@/types';
import { Textarea } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';

interface Props { 
  genre: Genre[];  
}

export default function UpdateGenreForm({ 
  genre,  
}: Props) {
  const route = useRoute();
  // const [photoPreview, setPhotoPreview] = useState<string | null>(
  //   genre.image_url ?? null,
  // );
  // const photoRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    _method: 'PUT',
    name: genre?.name,
    description: genre?.description,
  });

  function updatealbumInfo() {
    form.post(route('genres.update', genre?.id), {
      errorBag: 'updateGenre',
      preserveScroll: true,      
    });
  }

 

  return (
    <FormSection
      onSubmit={updatealbumInfo}
      title="Edit Genre Information"
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

      {/* name */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="name" value="Name" />
        <TextInput
          id="name"
          type="text"
          className="mt-1 block w-full"
          value={form.data.name}
          onChange={e => form.setData('name', e.currentTarget.value)}
        />
        <InputError message={form.errors.name} className="mt-2" />
      </div>

       {/* name */}
       <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="description" value="Description" />
        <Textarea
          id="description"          
          rows={6}
          className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
          value={form.data.description}
          onChange={e => form.setData('description', e.currentTarget.value)}
        />
        <InputError message={form.errors.description} className="mt-2" />
      </div>

    
    </FormSection>
  );
}
