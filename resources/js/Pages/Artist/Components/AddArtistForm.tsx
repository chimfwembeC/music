import ActionMessage from '@/Components/ActionMessage';
import FormSection from '@/Components/FormSection';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import { Textarea } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useRef, useState } from 'react'

export default function AddArtistForm() {
     const page = useTypedPage();
      const form = useForm({
        _method: 'POST',
        name: '',
        slug: '',
        bio: '',       
        image_url: null as File | null,      
      });
   
      const route = useRoute();
      const [photoPreview, setPhotoPreview] = useState<string | null>(null);
      const photoRef = useRef<HTMLInputElement>(null);
    
      function addArtistInformation() {
        form.post(route('artists.store'), {
          errorBag: 'addArtist',
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
       onSubmit={addArtistInformation}
       title={'Add Artist Information'}
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
 
         <InputLabel htmlFor="photo" value="Profile Photo" />
 
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
           Select Profile Photo
         </SecondaryButton>
 
         <InputError message={form.errors.image_url} className="mt-2" />
       </div>
 
       {/* <!-- Name --> */}
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
 
       {/* <!-- Duration --> */}
       <div className="col-span-6 sm:col-span-4">
         <InputLabel htmlFor="bio" value="Bio" />
         <Textarea
           id="bio"
        //    type="te"
        rows={6}
           className="w-full mt-1 block border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
           value={form.data.bio}
           onChange={e => form.setData('bio', e.currentTarget.value)}
         />
         <InputError message={form.errors.bio} className="mt-2" />
       </div>
      
       {/* Is Featured
       <div className="col-span-6 sm:col-span-4">
         <label className="block text-sm font-medium dark:text-gray-200 mb-1">
           Feature this track
         </label>
         <ToggleSwitch
           checked={form.data.is_featured}
           onChange={val => form.setData('is_featured', val)}
           color="yellow"
         />
       </div> */}
     </FormSection>
  )
}
