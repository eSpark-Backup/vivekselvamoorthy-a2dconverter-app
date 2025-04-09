import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('screen');

const isTablet = () => {
  return Math.min(width, height) >= 600 ? true : false;
};

const handleDigitsOnly = (text: string) => {
  return text.replace(/[^0-9]/g, '');
};

export {isTablet, handleDigitsOnly};
