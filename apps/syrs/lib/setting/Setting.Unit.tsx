import { ModelProps } from '@core/client';
import { cnst } from '../cnst';

export const Card = ({ className, setting }: ModelProps<'setting', cnst.LightSetting>) => {
  return <div>{setting.id}</div>;
};
