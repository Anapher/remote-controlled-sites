import { ClickAwayListener, Grow, MenuList, Paper, Popper } from '@mui/material';
import { RefObject } from 'react';
import { ScreenInfo } from '../../../shared/Screen';

type Props = {
   open: boolean;
   anchor: RefObject<HTMLElement | undefined>;
   onClose: () => void;
   screen?: ScreenInfo;
   renderMenuItems: (screen: ScreenInfo) => JSX.Element;
};

export default function ScreensContentActionPopper({ open, anchor, onClose, screen, renderMenuItems }: Props) {
   const handleClose = (event: Event) => {
      if (anchor.current && anchor.current.contains(event.target as HTMLElement)) {
         return;
      }

      onClose();
   };

   return (
      <Popper
         sx={{
            zIndex: 1,
         }}
         open={open}
         anchorEl={anchor.current}
         role={undefined}
         transition
         disablePortal
      >
         {({ TransitionProps, placement }) => (
            <Grow
               {...TransitionProps}
               style={{
                  transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
               }}
            >
               <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                     <MenuList id="split-button-menu">{screen && renderMenuItems(screen)}</MenuList>
                  </ClickAwayListener>
               </Paper>
            </Grow>
         )}
      </Popper>
   );
}
