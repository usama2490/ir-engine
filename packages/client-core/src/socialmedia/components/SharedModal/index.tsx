import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
interface Props {
    children?: any;
    open: boolean;
    TransitionComponent?: any;
    onClose?: any;
    title?: string;    
}

import { TransitionProps } from '@material-ui/core/transitions';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SharedModal = (props: Props) => {
    const {children, open, TransitionComponent, onClose, title} = props;
    return <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={onClose}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
          >
            <DialogActions>
                  <Button  variant="outlined" onClick={onClose} color="primary">
                      Close
                  </Button>                        
              </DialogActions>
              {title && <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>}
              {children}
              
          </Dialog>;
};

export default SharedModal;