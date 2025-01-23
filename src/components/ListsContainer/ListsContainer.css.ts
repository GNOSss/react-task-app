import { style } from '@vanilla-extract/css';
import { vars } from '../../../public/style/APP.css';

export const listsContainer = style({
  height: 'max-content',
  display: 'flex',
  flexWrap: 'wrap',
  rowGap: vars.spacing.listSpacing,
  margin: vars.spacing.listSpacing,
});
