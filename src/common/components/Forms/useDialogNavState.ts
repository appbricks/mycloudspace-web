const useDialogNavState = (
  height: number, 
  width: number, 
  props: DialogNavProps
): [ 
  // this dialog
  DialogState, 
  // from dialog
  DialogState 
]  => {

  const thisDialog = <DialogState>{ state: { height, width, data: {} } };
  if (props.location.state) {
    return [ thisDialog, <DialogState>{ state: { ...props.location.state } } ];
  } else {
    return [ thisDialog, <DialogState>{ state: { data: {} } } ];
  }
}

export default useDialogNavState;

export type DialogNavProps = {

  // reach router state when 
  // linking from another dialog
  location: DialogState
}

export type DialogState = {
  state: {
    height?: number
    width?: number
    data: { [ name: string ]: string }
  }
}
