import ReactDOM from 'react-dom/client';

import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { store } from '@/store';
import { SWRConfig } from 'swr';
import { fetcher } from '@/api';
import { ModalProvider } from '@/providers/modal-providers';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <SWRConfig
        value={{
          fetcher,
        }}
      >
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
        <ModalProvider />
        <Toaster
        // toastOptions={{
        //   style: {
        //     fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        //   },
        // }}
        />
      </SWRConfig>
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>
);
