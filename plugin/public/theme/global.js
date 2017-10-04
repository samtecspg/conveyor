import primary from './palette/primary';

const wrapper = {
    height: 'auto',
    padding: '20px 20px 35px'
};
const border = `1px solid ${primary[50]}`;
const borderRadius = `3px`;
const hoverTransition = 'border-color .55s ease';
const box = {
    border,
    'border-radius': borderRadius,
    'padding': '0 20px ',
    'margin-bottom': '20px'
};

export default {
    wrapper, border, borderRadius, hoverTransition, box
};