import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import PageBackIcon from '@material-ui/icons/ArrowBack';
import PageForwardIcon from '@material-ui/icons/ArrowForward';

import { 
  makeStyles,
  lighten,
  Theme
} from '@material-ui/core/styles';

import cx from 'clsx';

export default function AutoComplete<T>(props: AutoCompleteProps<T>) {
  const localClasses = useStyles();

  const [state, setState] = React.useState<State<T>>({ 
    open: false, 
    inputValue: '' 
  });
  const { open, inputValue } = state;

  // component props
  const { 
    inputLabel,
    inputPlaceholder,

    selected,
    options, 
    optionLabel,
    optionEquals,

    handleUpdateOptionList,
    handleOptionPageNext,
    handleOptionPagePrev,
    handleOptionsSelected,

    loading,
    disabled,

    className,
    classes,
    style,
  } = props;

  return (
    <Autocomplete
      freeSolo
      multiple
      size='small'
      loading={loading}
      disabled={disabled}
      value={selected}
      inputValue={inputValue}
      options={options}
      open={open}
      noOptionsText='No users found'
      getOptionSelected={optionEquals}
      getOptionDisabled={o => !!o.disabled}
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
          label={inputLabel}
          placeholder={inputPlaceholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      renderOption={(option) => (
        <React.Fragment>
          {option.value
            ? optionLabel(option)
            : option.navOption == ListPageNav.prev
              ? <PageBackIcon style={{ marginLeft: -5 }}/>
              : <PageForwardIcon style={{ marginLeft: 'auto' }}/>
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
      onFocus={() => {
        // handle intermittent case
        // where option list does not
        // popup when focus returns to
        // control
        setState({ 
          ...state,
          open: true
        });
      }}
      onOpen={() => {
        setState({ 
          ...state,
          open: true
        });
      }}
      onClose={(event, reason) => {
        const r = reason as string; // fix typescript warning
        if (r != 'select-option' && r != 'remove-option') {
          setState({ 
            ...state,
            open: false,
            inputValue: ''
          });
          handleUpdateOptionList('');
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
        handleOptionsSelected(selected);
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
    }
  }
}));

type AutoCompleteProps<T = any> = {
  inputLabel: string
  inputPlaceholder: string

  selected: Option<T>[]
  options: Option<T>[]
  optionLabel: (option: Option<T>) => string
  optionEquals: (o1: Option<T>, o2: Option<T>) => boolean

  handleUpdateOptionList: (filter: string) => void
  handleOptionPagePrev: () => void
  handleOptionPageNext: () => void
  handleOptionsSelected: (selected: Option<T>[]) => void

  loading?: boolean
  disabled?: boolean

  className?: string
  classes?: any
  style?: any
}

export type Option<T> = {
  navOption?: ListPageNav
  value?: T
  disabled?: boolean
}

export enum ListPageNav {
  prev,
  next
}

type State<T> = {
  open: boolean
  inputValue: string
}
