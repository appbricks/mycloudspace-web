import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OptionsObject } from 'notistack';

import { closeButton } from '../components/notification';

import { persistReducer } from 'redux-persist'
import sessionStorage from 'redux-persist/lib/storage/session'

import { Content } from '../state/content';
import { Values } from '../components/content/StaticContent';

const notifications = createSlice({
  name: 'notifications',

  initialState: {
    notifications: []
  } as NotificationState,

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
        message: Message,
        options: OptionsObject = {
          variant: 'default'
        },
      ) => {

        if (typeof message != 'string' && message.content.props.contentType != 'notification') {
          throw 'cannot dispatch content which is not a notification type';
        }

        const key = (options && options.key) || 
          (Date.now() + Math.random());
        const action = options && options.action || 
          ((key: string) => closeButton(key));

        return { 
          payload: {
            message,
            options: {
              ...options,
              key,
              action
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
} = notifications.actions;

export default persistReducer(
  {
    key: 'notifications',
    storage: sessionStorage,
    blacklist: []
  }, 
  notifications.reducer
);

type NotificationState = {
  notifications: Notification[]
}

export type Notification  = {
  message: Message
  options: OptionsObject

  dismissed?: boolean
}

type Message = string | {
  content: Content,
  values?: Values
}
