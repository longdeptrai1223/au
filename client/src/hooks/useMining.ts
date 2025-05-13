import { useContext } from 'react';
import { MiningContext } from '../contexts/MiningContext';

export const useMining = () => {
  return useContext(MiningContext);
};
