import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { RouteContext } from '@/Hooks/useRoute';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { DarkModeProvider } from "@/Context/DarkModeContext";

const appName =
    window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
    title: title => `${title} - ${appName}`,
    progress: {
        color: '#4B5563',
    },
    resolve: name =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        return root.render(
            <RouteContext.Provider value={(window as any).route}>
                <DarkModeProvider>
                    <App {...props} />
                </DarkModeProvider>
            </RouteContext.Provider>,
        );
    },
});
