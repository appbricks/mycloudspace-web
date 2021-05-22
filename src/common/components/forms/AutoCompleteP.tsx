import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PageBackIcon from '@material-ui/icons/ArrowBack';
import PageForwardIcon from '@material-ui/icons/ArrowForward';

import { 
  makeStyles,
  lighten,
  Theme
} from '@material-ui/core/styles';

import cx from 'clsx';

export default function AutoCompleteP<T>(props: AutoCompleteProps<T>) {
  const localClasses = useStyles();

  const [state, setState] = React.useState<State<T>>({ 
    selected: [], 
    open: false, 
    inputValue: '' 
  });
  const { selected, open, inputValue } = state;

  // component props
  const { 
    options, 
    optionLabel,
    optionEquals,

    handleUpdateOptionList,
    handleOptionPageNext,
    handleOptionPagePrev,
    handleOptionsSelected,

    className,
    classes,
    style,
  } = props;

  return (
    <Autocomplete
      freeSolo
      multiple
      size='small'
      value={selected}
      inputValue={inputValue}
      options={options}
      open={open}
      noOptionsText='No users found'
      getOptionSelected={optionEquals}
      getOptionDisabled={o => !!selected.find(s => optionEquals(o, s))}
      getOptionLabel={
        option => option.value 
          ? optionLabel(option)
          : ''
      }
      filterOptions={(options, state) => options}
      renderInput={(params) => (
        <TextField
          {...params}
          variant='outlined'
          label='Invite Users to Space'
          placeholder='username'
        />
      )}
      renderOption={(option) => (
        <React.Fragment>
          {option.value
            ? optionLabel(option)
            : option.navOption == ListPageNav.prev
              ? <PageBackIcon style={{ marginLeft: -5 }}/>
              : <PageForwardIcon style={{ marginLeft: -5 }}/>
          }
        </React.Fragment>
      )}
      className={cx(localClasses.autoCompleteComponent, className)}
      classes={Object.assign({
        input: localClasses.autoCompleteInput,
        paper: localClasses.autoCompleteList,
        option: localClasses.autoCompleteOption
      }, classes)}
      style={style}
      onOpen={() => {
        setState({ 
          ...state,
          open: true
        });
      }}
      onClose={(event, reason) => {
        if (reason != 'select-option') {
          handleUpdateOptionList('');
          setState({ 
            ...state,
            open: false,
            inputValue: ''
          });
        }
      }}
      onChange={(event, values, reason) => {
        if (reason == 'select-option') {
          // handle page navigation if page 
          // prev/next option selected
          const pageNavValue = values.find(
            value => !(value as Option<T>).value
          ) as Option<T>;
          if (pageNavValue) {
            switch (pageNavValue.navOption) {
              case ListPageNav.prev: {
                handleOptionPagePrev();
                return;
              }
              case ListPageNav.next: {
                handleOptionPageNext();
                return;
              }
            }            
          }
        }
        
        const selected = values.filter(
          value => !!(value as Option<T>).value
        ) as Option<T>[];
        handleOptionsSelected(selected.map(value => value.value as T));

        setState({ 
          ...state,
          selected
        });  
      }}
      onInputChange={(event, value, reason) => {
        if (reason == 'input') {
          handleUpdateOptionList(value);    
          setState({ 
            ...state,
            inputValue: value
          });
        }
      }}
    />
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  autoCompleteComponent: {
    backgroundColor: lighten('#efefef', 0.5),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  autoCompleteInput: {
    minHeight: '21px'
  },
  autoCompleteList: {
    borderStyle: 'solid',
    borderWidth: '2px',
    borderColor: '#3f51b5',
    backgroundColor: lighten('#efefef', 0.5),
    marginBlockEnd: theme.spacing(1.5)
  },
  autoCompleteOption: {
    '&[aria-selected="true"]': {
      backgroundColor: '#3f51b5',
      color: '#ffffff'
    },
    '&[aria-disabled="true"]': {
      opacity: 1
    }
  }
}));

type AutoCompleteProps<T = any> = {
  options: Option<T>[]
  optionLabel: (option: Option<T>) => string
  optionEquals: (o1: Option<T>, o2: Option<T>) => boolean

  handleUpdateOptionList: (filter: string) => void
  handleOptionPagePrev: () => void
  handleOptionPageNext: () => void
  handleOptionsSelected: (selected: T[]) => void

  className?: string
  classes?: any
  style?: any
}

export type Option<T> = {
  navOption?: ListPageNav
  value?: T
}

export enum ListPageNav {
  prev,
  next
}

type State<T> = {
  selected: Option<T>[]

  open: boolean
  inputValue: string
}
