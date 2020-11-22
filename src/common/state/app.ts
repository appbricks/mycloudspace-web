import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OptionsObject } from 'notistack';

import { closeButton } from '../components/notification';

export const app = createSlice({
  name: 'app',

  initialState: {
    notifications: []
  } as AppState,

  reducers: {

    /**
     * Notifications
     */
    notify: {
      reducer: (state, action: PayloadAction<Notification>) => {
        return {
          ...state,
          notifications: [
            ...state.notifications,
            action.payload
          ],
        };
      },
      prepare: ( 
        message: string | { 
          title: string
          message: string
        },
        type: 'default' | 'error' | 'success' | 'warning' | 'info' = 'default',
        options?: OptionsObject,
      ) => {

        const key = options && options.key;
        const action = options && options.action;

        return { 
          payload: {
            title: typeof message == 'string' ? message : message.title,
            message: typeof message == 'string' ? undefined : message.message,
            options: {
              ...options,
              key: key || (new Date().getTime() + Math.random()),
              action: action || ((key: string) => closeButton(key)),
              variant: type,
            }
          },
        };
      },
    },
    dismissNotification: {
      reducer: (state, action: PayloadAction<{ key?: string, dismissAll?: boolean}>) => {
        const { key, dismissAll } = action.payload;
        return {
          ...state,
          notifications: state.notifications.map(notification => (            
            (dismissAll || notification.options.key === key)
              ? { ...notification, dismissed: true }
              : { ...notification }
          )),
        };
      },
      prepare: (key?: string) => {
        return {
          payload: {
            key,
            dismissAll: !key
          }
        }
      }
    },
    removeNotification: {
      reducer: (state, action: PayloadAction<{ key?: string }>) => {
        const { key } = action.payload;
        return {
          ...state,
          notifications: state.notifications.filter(
            notification => notification.options.key !== key,
          ),
        };
      },
      prepare: (key?: string) => {
        return {
          payload: {
            key
          }
        }
      }
    }        
  }
})

export const { 
  notify,
  dismissNotification,
  removeNotification
} = app.actions;

export default app.reducer;

type AppState = {
  notifications: Notification[]
}

export type Notification  = {
  title: string
  message?: string

  dismissed?: boolean

  options?: any
}
