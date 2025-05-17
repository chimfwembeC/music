import React, { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { useRoute } from '@/Hooks/useRoute';
import FormSection from '@/Components/FormSection';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Select from '@/Components/Select';

export default function AddUserForm() {
  const form = useForm({
    _method: 'POST',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'listener',
    profile_photo: null as File | null,
  });
  const route = useRoute();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  function createUser() {
    form.post(route('users.store'), {
      errorBag: 'createUser',
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

    form.setData('profile_photo', photo);

    const reader = new FileReader();

    reader.onload = e => {
      setPhotoPreview(e.target?.result as string);
    };

    reader.readAsDataURL(photo);
  }

  function clearPhotoFileInput() {
    if (photoRef.current?.value) {
      photoRef.current.value = '';
      form.setData('profile_photo', null);
    }
  }

  return (
    <FormSection
      title="Create User"
      description="Create a new user account with the specified role."
      onSubmit={createUser}
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
            Create
          </PrimaryButton>
        </>
      )}
    >
      {/* Name */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="name" value="Name" />
        <TextInput
          id="name"
          type="text"
          className="mt-1 block w-full"
          value={form.data.name}
          onChange={e => form.setData('name', e.currentTarget.value)}
          autoComplete="name"
          required
        />
        <InputError message={form.errors.name} className="mt-2" />
      </div>

      {/* Email */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="email" value="Email" />
        <TextInput
          id="email"
          type="email"
          className="mt-1 block w-full"
          value={form.data.email}
          onChange={e => form.setData('email', e.currentTarget.value)}
          autoComplete="email"
          required
        />
        <InputError message={form.errors.email} className="mt-2" />
      </div>

      {/* Password */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="password" value="Password" />
        <TextInput
          id="password"
          type="password"
          className="mt-1 block w-full"
          value={form.data.password}
          onChange={e => form.setData('password', e.currentTarget.value)}
          autoComplete="new-password"
          required
        />
        <InputError message={form.errors.password} className="mt-2" />
      </div>

      {/* Password Confirmation */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
        <TextInput
          id="password_confirmation"
          type="password"
          className="mt-1 block w-full"
          value={form.data.password_confirmation}
          onChange={e => form.setData('password_confirmation', e.currentTarget.value)}
          autoComplete="new-password"
          required
        />
        <InputError message={form.errors.password_confirmation} className="mt-2" />
      </div>

      {/* Role */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="role" value="Role" />
        <Select
          id="role"
          className="mt-1 block w-full"
          value={form.data.role}
          onChange={e => form.setData('role', e.currentTarget.value)}
          required
        >
          <option value="listener">Listener</option>
          <option value="artist">Artist</option>
          <option value="admin">Admin</option>
        </Select>
        <InputError message={form.errors.role} className="mt-2" />
      </div>

      {/* Profile Photo */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="photo" value="Profile Photo" />

        {/* Photo Preview */}
        <div className="mt-2">
          <div className="mt-2 w-24 h-24 rounded-full overflow-hidden bg-gray-100">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile photo preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <span className="text-gray-400 dark:text-gray-500">No photo</span>
              </div>
            )}
          </div>
        </div>

        <SecondaryButton
          className="mt-2 mr-2"
          type="button"
          onClick={selectNewPhoto}
        >
          Select A Photo
        </SecondaryButton>

        <input
          type="file"
          className="hidden"
          ref={photoRef}
          onChange={updatePhotoPreview}
        />

        <InputError message={form.errors.profile_photo} className="mt-2" />
      </div>
    </FormSection>
  );
}
