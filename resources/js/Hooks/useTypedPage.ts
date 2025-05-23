import { usePage } from '@inertiajs/react';
import { InertiaSharedProps } from '@/types/inertia';

export default function useTypedPage<T = {}>() {
  return usePage<InertiaSharedProps<T>>();
}
