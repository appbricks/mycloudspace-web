import React, { 
  FunctionComponent,
  ReactNode,
  useEffect
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar, OptionsObject } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';

import { Logger } from '@appbricks/utils';

import { RootState } from '../../state/store';
import { 
  Notification, 
  removeNotification 
} from '../../state/notifications';

import { StaticContent } from '../../../common/components/content';

const Notifier: FunctionComponent<NotifierProps> = (props) => {
  const styles = useStyles(props);
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const notifications = useSelector<RootState, Notification[]>(
    store => store.notifications.notifications
  );

  useEffect(() => {
    notifications.forEach(
      ({ message, dismissed, options }) => {
        const key = options.key as string;

        if (dismissed) {
          // dismiss snackbar using notistack
          closeSnackbar(key);
          return;
        }

        // do nothing if snackbar exists enqueue 
        // request was made less than 50ms ago.
        // this handles the condition when enqueue
        // might not complete if a dom refresh
        // happened around the same time.
        const enqueuedTime = displayed[key];
        if (enqueuedTime) {
          if (enqueuedTime == -1) {
            // once a notification has been displayed
            // any dom updates should clear those
            // notifications from state
            dispatch(removeNotification(key));
            return
          } else if ((Date.now() - enqueuedTime) < 50) {
            return
          }
        }

        // display snackbar using notistack
        let content: ReactNode;
        if (typeof message == 'string') {
          content = message;
        } else {
          content = (
            <StaticContent 
              body={message.content.body}
              values={message.values}
              className={styles.content}
            />
          );
          options = {
            ...options,
            variant: message.content.props.notifyType as (typeof options.variant)
          }
        }

        enqueueSnackbar(content, {
          ...options,
          preventDuplicate: true,
          onEntered: (node, isAppearing, key) => {
            // reset timer of snackbars that 
            // we've displayed and tracking
            displayed[key] = -1;
            Logger.trace('Notifier', 'Notification has been displayed', key, displayed);
          },
          onExited: (node, key) => {
            // remove this snackbar from redux store
            delete displayed[key];
            dispatch(removeNotification(key as string));
            Logger.trace('Notifier', 'Notification has been removed', key, displayed);
          }
        });

        // keep track of snackbars that we've displayed
        displayed[key] = Date.now();

        // clean up any keys that have been displayed and 
        // may not have been removed for example if onExited 
        // was not called, due to a rerender while a 
        // notification was displayed
        for (const [key, value] of Object.entries(displayed)) {
          if (value == -1) {
            const found = notifications.find(({ options }) => {
              const nkey = (options as OptionsObject).key as string;
              return key == nkey;
            });
            if (!found) {
              delete displayed[key];
            }
          }
        }

        Logger.trace('Notifier', 'Enqueued notification for display', key, displayed);
      }
    );
  }, [notifications, closeSnackbar, enqueueSnackbar]);

  return null;
};

export default Notifier;

const useStyles = makeStyles(theme => ({
  content: {
    '& h1': {
      marginBlockStart: '0',
      marginBlockEnd: '0.2rem'
    },
    '& h2': {
      marginBlockStart: '0',
      marginBlockEnd: '0.2rem'
    },
    '& h3': {
      marginBlockStart: '0',
      marginBlockEnd: '0.2rem'
    },
    '& p': {
      marginBlockStart: '0',
      marginBlockEnd: '0'
    }
  }
}));

type NotifierProps = {
  title?: string
}

let displayed: { [key: string]: number} = {};
